import { useMemo } from 'react';
import { useDataStore } from '@/store/useDataStore';
import { lastMonths, monthKey } from '@/utils/format';
import type { Course, Employee, Enrollment } from '@/types';

// ---------------------------------------------------------------------------
// Visão de aprendizagem de um colaborador
// ---------------------------------------------------------------------------

export function useEmployeeLearning(employeeId?: string) {
  const enrollments = useDataStore((s) => s.enrollments);
  const courses = useDataStore((s) => s.courses);
  const certificates = useDataStore((s) => s.certificates);
  const activities = useDataStore((s) => s.activities);

  return useMemo(() => {
    if (!employeeId) {
      return {
        enrollments: [] as Enrollment[],
        items: [] as Array<{ enrollment: Enrollment; course: Course }>,
        total: 0,
        completed: 0,
        inProgress: 0,
        notStarted: 0,
        late: 0,
        pending: 0,
        progress: 0,
        minutes: 0,
        certificates: [],
        activities: [],
        continueItem: null as null | { enrollment: Enrollment; course: Course },
        nextDeadlines: [] as Array<{ enrollment: Enrollment; course: Course }>,
      };
    }

    const mine = enrollments.filter((e) => e.employeeId === employeeId);
    const items = mine
      .map((enrollment) => {
        const course = courses.find((c) => c.id === enrollment.courseId);
        return course ? { enrollment, course } : null;
      })
      .filter((item): item is { enrollment: Enrollment; course: Course } => Boolean(item));

    const completed = items.filter((i) => i.enrollment.status === 'concluido');
    const inProgress = items.filter((i) => i.enrollment.status === 'em_andamento');
    const late = items.filter((i) => i.enrollment.status === 'atrasado');
    const notStarted = items.filter((i) => i.enrollment.status === 'nao_iniciado');

    const minutes = completed.reduce((sum, i) => sum + i.course.durationMinutes, 0);
    const progress = items.length
      ? Math.round(items.reduce((sum, i) => sum + i.enrollment.progress, 0) / items.length)
      : 0;

    const continueItem =
      [...inProgress, ...late]
        .filter((i) => i.enrollment.progress > 0)
        .sort(
          (a, b) =>
            new Date(b.enrollment.lastAccessAt ?? 0).getTime() -
            new Date(a.enrollment.lastAccessAt ?? 0).getTime(),
        )[0] ?? null;

    const nextDeadlines = items
      .filter(
        (i) =>
          i.enrollment.status !== 'concluido' &&
          i.enrollment.dueDate &&
          i.course.mandatory,
      )
      .sort(
        (a, b) =>
          new Date(a.enrollment.dueDate ?? 0).getTime() -
          new Date(b.enrollment.dueDate ?? 0).getTime(),
      )
      .slice(0, 5);

    return {
      enrollments: mine,
      items,
      total: items.length,
      completed: completed.length,
      inProgress: inProgress.length,
      notStarted: notStarted.length,
      late: late.length,
      pending: inProgress.length + notStarted.length + late.length,
      progress,
      minutes,
      certificates: certificates
        .filter((c) => c.employeeId === employeeId)
        .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()),
      activities: activities
        .filter((a) => a.employeeId === employeeId)
        .slice(0, 12),
      continueItem,
      nextDeadlines,
    };
  }, [employeeId, enrollments, courses, certificates, activities]);
}

// ---------------------------------------------------------------------------
// Progresso de um treinamento específico
// ---------------------------------------------------------------------------

export function useCourseProgress(employeeId: string | undefined, courseId: string) {
  const enrollments = useDataStore((s) => s.enrollments);
  return useMemo(
    () =>
      employeeId
        ? enrollments.find(
            (e) => e.employeeId === employeeId && e.courseId === courseId,
          ) ?? null
        : null,
    [enrollments, employeeId, courseId],
  );
}

// ---------------------------------------------------------------------------
// Analytics gerencial
// ---------------------------------------------------------------------------

export interface AnalyticsFilter {
  departmentId?: string;
  months?: number;
}

export function useAnalytics({ departmentId, months = 12 }: AnalyticsFilter = {}) {
  const employees = useDataStore((s) => s.employees);
  const courses = useDataStore((s) => s.courses);
  const enrollments = useDataStore((s) => s.enrollments);
  const departments = useDataStore((s) => s.departments);
  const certificates = useDataStore((s) => s.certificates);

  return useMemo(() => {
    const scopedEmployees = departmentId
      ? employees.filter((e) => e.departmentId === departmentId)
      : employees;
    const employeeIds = new Set(scopedEmployees.map((e) => e.id));

    const monthsList = lastMonths(months);
    const oldest = monthsList[0]?.key ?? monthKey(new Date());

    const scoped = enrollments.filter((e) => employeeIds.has(e.employeeId));
    const inPeriod = (date: string | null) =>
      Boolean(date && monthKey(new Date(date)) >= oldest);

    const byStatus = {
      concluido: scoped.filter((e) => e.status === 'concluido').length,
      em_andamento: scoped.filter((e) => e.status === 'em_andamento').length,
      atrasado: scoped.filter((e) => e.status === 'atrasado').length,
      nao_iniciado: scoped.filter((e) => e.status === 'nao_iniciado').length,
    };

    const total = scoped.length;
    const completionRate = total ? Math.round((byStatus.concluido / total) * 100) : 0;

    const minutes = scoped
      .filter((e) => e.status === 'concluido')
      .reduce((sum, e) => {
        const course = courses.find((c) => c.id === e.courseId);
        return sum + (course?.durationMinutes ?? 0);
      }, 0);

    const lateEmployees = new Set(
      scoped.filter((e) => e.status === 'atrasado').map((e) => e.employeeId),
    );

    // ----------------------------- séries mensais -------------------------
    const series = monthsList.map(({ key, label }) => {
      const conclusoes = scoped.filter(
        (e) => e.completedAt && monthKey(new Date(e.completedAt)) === key,
      );
      const inicios = scoped.filter(
        (e) => e.startedAt && monthKey(new Date(e.startedAt)) === key,
      ).length;
      const horas = conclusoes.reduce((sum, e) => {
        const course = courses.find((c) => c.id === e.courseId);
        return sum + (course?.durationMinutes ?? 0) / 60;
      }, 0);
      return {
        key,
        label,
        conclusoes: conclusoes.length,
        inicios,
        horas: Math.round(horas),
      };
    });

    // Taxa de conclusão acumulada mês a mês
    let accumulated = 0;
    const rateSeries = series.map((item) => {
      accumulated += item.conclusoes;
      return {
        label: item.label,
        taxa: total ? Math.round((accumulated / total) * 100) : 0,
      };
    });

    // -------------------------- por departamento --------------------------
    const byDepartment = departments.map((department) => {
      const ids = new Set(
        employees.filter((e) => e.departmentId === department.id).map((e) => e.id),
      );
      const list = enrollments.filter((e) => ids.has(e.employeeId));
      const concluido = list.filter((e) => e.status === 'concluido').length;
      const departmentMinutes = list
        .filter((e) => e.status === 'concluido')
        .reduce((sum, e) => {
          const course = courses.find((c) => c.id === e.courseId);
          return sum + (course?.durationMinutes ?? 0);
        }, 0);

      return {
        department,
        label: department.name,
        employees: ids.size,
        total: list.length,
        concluido,
        em_andamento: list.filter((e) => e.status === 'em_andamento').length,
        atrasado: list.filter((e) => e.status === 'atrasado').length,
        nao_iniciado: list.filter((e) => e.status === 'nao_iniciado').length,
        rate: list.length ? Math.round((concluido / list.length) * 100) : 0,
        minutes: departmentMinutes,
        courses: courses.filter((c) => c.departmentId === department.id).length,
      };
    });

    // ----------------------- treinamentos mais acessados ------------------
    const courseStats = courses
      .map((course) => {
        const list = scoped.filter((e) => e.courseId === course.id);
        const accessed = list.filter((e) => e.status !== 'nao_iniciado').length;
        const concluido = list.filter((e) => e.status === 'concluido').length;
        const attempts = list.flatMap((e) => e.attempts);
        const approvals = attempts.filter((a) => a.passed).length;
        return {
          course,
          label: course.title,
          enrolled: list.length,
          accessed,
          concluido,
          rate: list.length ? Math.round((concluido / list.length) * 100) : 0,
          approvalRate: attempts.length
            ? Math.round((approvals / attempts.length) * 100)
            : 0,
          averageScore: concluido
            ? Math.round(
                list
                  .filter((e) => e.score !== null)
                  .reduce((sum, e) => sum + (e.score ?? 0), 0) /
                  Math.max(1, list.filter((e) => e.score !== null).length),
              )
            : 0,
        };
      })
      .sort((a, b) => b.accessed - a.accessed);

    // ----------------------------- ranking --------------------------------
    const ranking = scopedEmployees
      .map((employee) => {
        const list = enrollments.filter((e) => e.employeeId === employee.id);
        const concluido = list.filter((e) => e.status === 'concluido');
        const employeeMinutes = concluido.reduce((sum, e) => {
          const course = courses.find((c) => c.id === e.courseId);
          return sum + (course?.durationMinutes ?? 0);
        }, 0);
        return {
          employee,
          total: list.length,
          concluido: concluido.length,
          atrasado: list.filter((e) => e.status === 'atrasado').length,
          progress: list.length
            ? Math.round(list.reduce((sum, e) => sum + e.progress, 0) / list.length)
            : 0,
          minutes: employeeMinutes,
          certificates: certificates.filter((c) => c.employeeId === employee.id).length,
        };
      })
      .sort((a, b) => b.progress - a.progress || b.concluido - a.concluido);

    const attempts = scoped.flatMap((e) => e.attempts);
    const approvalRate = attempts.length
      ? Math.round((attempts.filter((a) => a.passed).length / attempts.length) * 100)
      : 0;

    const publishedCourses = courses.filter((c) => c.status === 'publicado');

    // Comparativo com o mês anterior (para indicadores de tendência)
    const lastMonth = series[series.length - 1]?.conclusoes ?? 0;
    const previousMonth = series[series.length - 2]?.conclusoes ?? 0;
    const trend =
      previousMonth === 0
        ? lastMonth > 0
          ? 100
          : 0
        : Math.round(((lastMonth - previousMonth) / previousMonth) * 100);

    return {
      employees: scopedEmployees,
      employeeCount: scopedEmployees.length,
      courseCount: publishedCourses.length,
      draftCount: courses.filter((c) => c.status === 'rascunho').length,
      total,
      byStatus,
      completionRate,
      minutes,
      hours: Math.round(minutes / 60),
      lateEmployees: lateEmployees.size,
      certificateCount: certificates.filter((c) => employeeIds.has(c.employeeId)).length,
      approvalRate,
      series,
      rateSeries,
      byDepartment,
      courseStats,
      ranking,
      trend,
      inPeriod,
    };
  }, [employees, courses, enrollments, departments, certificates, departmentId, months]);
}

// ---------------------------------------------------------------------------
// Progresso de trilhas
// ---------------------------------------------------------------------------

export function usePathsProgress(employeeId?: string) {
  const paths = useDataStore((s) => s.paths);
  const courses = useDataStore((s) => s.courses);
  const enrollments = useDataStore((s) => s.enrollments);

  return useMemo(
    () =>
      paths.map((path) => {
        const pathCourses = path.courseIds
          .map((id) => courses.find((c) => c.id === id))
          .filter((c): c is Course => Boolean(c));

        const mine = employeeId
          ? enrollments.filter(
              (e) => e.employeeId === employeeId && path.courseIds.includes(e.courseId),
            )
          : [];

        const completed = mine.filter((e) => e.status === 'concluido').length;
        const progress = pathCourses.length
          ? Math.round(
              pathCourses.reduce((sum, course) => {
                const enrollment = mine.find((e) => e.courseId === course.id);
                return sum + (enrollment?.progress ?? 0);
              }, 0) / pathCourses.length,
            )
          : 0;

        const minutes = pathCourses.reduce((sum, c) => sum + c.durationMinutes, 0);

        return {
          path,
          courses: pathCourses,
          enrollments: mine,
          completed,
          pending: pathCourses.length - completed,
          progress,
          minutes,
        };
      }),
    [paths, courses, enrollments, employeeId],
  );
}

/** Acompanhamento de uma trilha por toda a base de colaboradores (visão gestor). */
export function usePathAudience(pathId: string) {
  const paths = useDataStore((s) => s.paths);
  const employees = useDataStore((s) => s.employees);
  const enrollments = useDataStore((s) => s.enrollments);

  return useMemo(() => {
    const path = paths.find((p) => p.id === pathId);
    if (!path) return { path: null, rows: [] as Array<{ employee: Employee; progress: number; completed: number }> };

    const audience = path.departmentId
      ? employees.filter((e) => e.departmentId === path.departmentId)
      : employees;

    const rows = audience
      .map((employee) => {
        const list = enrollments.filter(
          (e) => e.employeeId === employee.id && path.courseIds.includes(e.courseId),
        );
        return {
          employee,
          completed: list.filter((e) => e.status === 'concluido').length,
          progress: path.courseIds.length
            ? Math.round(
                path.courseIds.reduce((sum, courseId) => {
                  const enrollment = list.find((e) => e.courseId === courseId);
                  return sum + (enrollment?.progress ?? 0);
                }, 0) / path.courseIds.length,
              )
            : 0,
        };
      })
      .sort((a, b) => b.progress - a.progress);

    return { path, rows };
  }, [paths, employees, enrollments, pathId]);
}

// ---------------------------------------------------------------------------
// Notificações do usuário logado
// ---------------------------------------------------------------------------

export function useMyNotifications(employeeId?: string, manager = false) {
  const notifications = useDataStore((s) => s.notifications);

  return useMemo(() => {
    const list = notifications.filter((n) => {
      if (manager) return !n.employeeId || n.audience === 'todos' || n.audience === 'admin';
      if (n.employeeId) return n.employeeId === employeeId;
      return n.audience === 'todos' || n.audience === 'colaborador';
    });
    return {
      list,
      unread: list.filter((n) => !n.read).length,
    };
  }, [notifications, employeeId, manager]);
}
