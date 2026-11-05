import type {
  ActivityLog,
  AttemptRecord,
  Certificate,
  Enrollment,
  EnrollmentStatus,
  LessonProgress,
  Notification,
} from '@/types';
import { employees } from './employees';
import { companyWideCourseIds, courses } from './courses';
import { announcements } from './announcements';

// ---------------------------------------------------------------------------
// Gerador determinístico — os mesmos dados são produzidos a cada execução,
// garantindo coerência entre dashboards, relatórios e históricos individuais.
// ---------------------------------------------------------------------------

function seedFrom(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h = Math.imul(h ^ value.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const iso = (date: Date) => date.toISOString();

function shiftDays(days: number): Date {
  const date = new Date();
  date.setHours(9, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
}

const SCORES = [70, 75, 80, 85, 90, 95, 100];

// Perfis fixos dos usuários de demonstração, para que a apresentação comercial
// sempre encontre o mesmo cenário (curso em andamento, pendência e atraso).
const DEMO_OVERRIDES: Record<string, Record<string, [EnrollmentStatus, number]>> = {
  'emp-01': {
    'crs-01': ['concluido', 100],
    'crs-09': ['concluido', 100],
    'crs-11': ['concluido', 100],
    'crs-02': ['em_andamento', 45],
    'crs-12': ['em_andamento', 70],
    'crs-03': ['atrasado', 15],
    'crs-04': ['nao_iniciado', 0],
    'crs-05': ['nao_iniciado', 0],
  },
  'emp-09': {
    'crs-06': ['concluido', 100],
    'crs-09': ['concluido', 100],
    'crs-11': ['concluido', 100],
    'crs-07': ['em_andamento', 60],
    'crs-01': ['em_andamento', 25],
    'crs-08': ['atrasado', 10],
    'crs-10': ['nao_iniciado', 0],
    'crs-12': ['nao_iniciado', 0],
  },
  'emp-17': {
    'crs-01': ['concluido', 100],
    'crs-09': ['concluido', 100],
    'crs-11': ['concluido', 100],
    'crs-12': ['concluido', 100],
    'crs-14': ['em_andamento', 55],
    'crs-13': ['atrasado', 20],
    'crs-15': ['nao_iniciado', 0],
  },
};

/** Treinamentos atribuídos a um colaborador: os do seu setor + obrigatórios gerais. */
export function assignedCourseIdsFor(departmentId: string): string[] {
  const own = courses
    .filter((c) => c.departmentId === departmentId && c.status === 'publicado')
    .map((c) => c.id);
  const global = companyWideCourseIds.filter((id) => !own.includes(id));
  return [...own, ...global];
}

function lessonIdsOf(courseId: string): string[] {
  const course = courses.find((c) => c.id === courseId);
  if (!course) return [];
  return course.modules.flatMap((m) => m.lessons.map((l) => l.id));
}

function buildLessonProgress(
  courseId: string,
  completedCount: number,
  referenceDate: Date,
): LessonProgress[] {
  const ids = lessonIdsOf(courseId);
  return ids.map((lessonId, index) => {
    const completed = index < completedCount;
    const date = new Date(referenceDate);
    date.setDate(date.getDate() - (completedCount - index));
    return {
      lessonId,
      completed,
      completedAt: completed ? iso(date) : null,
    };
  });
}

export function generateEnrollments(): Enrollment[] {
  const result: Enrollment[] = [];

  employees.forEach((employee, employeeIndex) => {
    const employeeRng = mulberry32(seedFrom(`dil-${employee.id}`));
    const diligence = 0.42 + employeeRng() * 0.46; // 0,42 .. 0,88
    const assigned = assignedCourseIdsFor(employee.departmentId);
    const override = DEMO_OVERRIDES[employee.id];

    assigned.forEach((courseId, courseIndex) => {
      const course = courses.find((c) => c.id === courseId);
      if (!course) return;

      const rng = mulberry32(seedFrom(`${employee.id}-${courseId}`));
      const r1 = rng();
      const r2 = rng();
      const r3 = rng();

      const totalLessons = lessonIdsOf(courseId).length;
      let status: EnrollmentStatus;
      let targetProgress: number;

      if (override && override[courseId]) {
        [status, targetProgress] = override[courseId];
      } else if (r1 < diligence) {
        status = 'concluido';
        targetProgress = 100;
      } else if (r1 < diligence + 0.15) {
        status = 'em_andamento';
        targetProgress = 15 + Math.floor(r2 * 70);
      } else if (r1 < diligence + 0.24 && course.mandatory) {
        status = 'atrasado';
        targetProgress = Math.floor(r2 * 35);
      } else {
        status = 'nao_iniciado';
        targetProgress = 0;
      }

      let completedLessons = Math.round((targetProgress / 100) * totalLessons);
      if (status === 'concluido') completedLessons = totalLessons;
      if (status === 'em_andamento') {
        completedLessons = Math.min(
          Math.max(completedLessons, 1),
          totalLessons - 1,
        );
      }
      if (status === 'nao_iniciado') completedLessons = 0;

      const progress =
        totalLessons === 0
          ? 0
          : Math.round((completedLessons / totalLessons) * 100);

      let startedAt: Date | null = null;
      let completedAt: Date | null = null;
      let dueDate: Date | null = null;
      let lastAccessAt: Date | null = null;

      if (status === 'concluido') {
        // Distribuição com leve concentração nos meses recentes (curva de adoção)
        const offset = Math.floor(Math.pow(r2, 1.55) * 320) + 2;
        completedAt = shiftDays(-offset);
        startedAt = shiftDays(-(offset + 4 + Math.floor(r3 * 22)));
        lastAccessAt = completedAt;
        dueDate = course.deadlineDays
          ? shiftDays(-(offset - 3 - Math.floor(r3 * 10)))
          : null;
      } else if (status === 'em_andamento') {
        const started = 6 + Math.floor(r3 * 40);
        startedAt = shiftDays(-started);
        lastAccessAt = shiftDays(-Math.floor(r2 * 6));
        dueDate = course.deadlineDays
          ? shiftDays(course.deadlineDays - started)
          : null;
      } else if (status === 'atrasado') {
        const started = 50 + Math.floor(r3 * 70);
        startedAt = completedLessons > 0 ? shiftDays(-started) : null;
        lastAccessAt = completedLessons > 0 ? shiftDays(-(started - 6)) : null;
        dueDate = shiftDays(-(4 + Math.floor(r2 * 48)));
      } else {
        dueDate = course.deadlineDays
          ? shiftDays(5 + Math.floor(r2 * 40))
          : null;
      }

      const score =
        status === 'concluido'
          ? SCORES[Math.floor(r3 * SCORES.length)]
          : null;

      const attempts: AttemptRecord[] = [];
      if (status === 'concluido' && course.assessment && completedAt) {
        // Em parte dos casos, uma primeira tentativa reprovada antes da aprovação
        if (r2 > 0.78) {
          const failedDate = new Date(completedAt);
          failedDate.setDate(failedDate.getDate() - 2);
          attempts.push({
            id: `${employee.id}-${courseId}-t1`,
            score: 40 + Math.floor(r1 * 25),
            passed: false,
            date: iso(failedDate),
            answers: {},
          });
        }
        attempts.push({
          id: `${employee.id}-${courseId}-t${attempts.length + 1}`,
          score: score ?? 80,
          passed: true,
          date: iso(completedAt),
          answers: {},
        });
      }

      result.push({
        id: `enr-${employeeIndex + 1}-${courseIndex + 1}`,
        employeeId: employee.id,
        courseId,
        status,
        progress,
        startedAt: startedAt ? iso(startedAt) : null,
        completedAt: completedAt ? iso(completedAt) : null,
        dueDate: dueDate ? iso(dueDate) : null,
        lastAccessAt: lastAccessAt ? iso(lastAccessAt) : null,
        lessonsProgress: buildLessonProgress(
          courseId,
          completedLessons,
          completedAt ?? lastAccessAt ?? new Date(),
        ),
        attempts,
        score,
      });
    });
  });

  return result;
}

export function generateCertificates(enrollments: Enrollment[]): Certificate[] {
  return enrollments
    .filter((e) => e.status === 'concluido')
    .map((enrollment, index) => {
      const course = courses.find((c) => c.id === enrollment.courseId);
      const hours = course ? Math.max(1, Math.round(course.durationMinutes / 60)) : 1;
      const rng = mulberry32(seedFrom(`cert-${enrollment.id}`));
      const serial = Math.floor(rng() * 899999 + 100000);
      const year = enrollment.completedAt
        ? new Date(enrollment.completedAt).getFullYear()
        : new Date().getFullYear();
      return {
        id: `cert-${index + 1}`,
        code: `UC-${year}-${serial}`,
        employeeId: enrollment.employeeId,
        courseId: enrollment.courseId,
        issuedAt: enrollment.completedAt ?? iso(new Date()),
        hours,
        score: enrollment.score ?? 80,
      };
    });
}

export function generateActivities(enrollments: Enrollment[]): ActivityLog[] {
  const logs: ActivityLog[] = [];

  enrollments.forEach((enrollment) => {
    const course = courses.find((c) => c.id === enrollment.courseId);
    if (!course) return;

    if (enrollment.startedAt) {
      logs.push({
        id: `act-i-${enrollment.id}`,
        employeeId: enrollment.employeeId,
        action: 'iniciou o treinamento',
        target: course.title,
        date: enrollment.startedAt,
        kind: 'inicio',
      });
    }

    enrollment.attempts.forEach((attempt, index) => {
      logs.push({
        id: `act-a-${enrollment.id}-${index}`,
        employeeId: enrollment.employeeId,
        action: attempt.passed
          ? `foi aprovado na avaliação com ${attempt.score}%`
          : `não alcançou a nota mínima na avaliação (${attempt.score}%)`,
        target: course.title,
        date: attempt.date,
        kind: 'avaliacao',
      });
    });

    if (enrollment.completedAt) {
      logs.push({
        id: `act-c-${enrollment.id}`,
        employeeId: enrollment.employeeId,
        action: 'concluiu o treinamento',
        target: course.title,
        date: enrollment.completedAt,
        kind: 'conclusao',
      });
      logs.push({
        id: `act-r-${enrollment.id}`,
        employeeId: enrollment.employeeId,
        action: 'recebeu o certificado de',
        target: course.title,
        date: enrollment.completedAt,
        kind: 'certificado',
      });
    }
  });

  return logs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 400);
}

export function generateNotifications(enrollments: Enrollment[]): Notification[] {
  const list: Notification[] = [];
  const now = Date.now();

  // Comunicados institucionais (visíveis a todos)
  announcements.forEach((announcement, index) => {
    list.push({
      id: `ntf-com-${index + 1}`,
      kind: 'comunicado',
      title: announcement.title,
      message: `${announcement.content.slice(0, 120)}…`,
      date: announcement.date,
      read: index > 1,
      audience: 'todos',
      link: '/app/notificacoes',
    });
  });

  // Novos treinamentos publicados
  const recentCourses = [...courses]
    .filter((c) => c.status === 'publicado')
    .sort(
      (a, b) =>
        new Date(b.publishedAt ?? b.createdAt).getTime() -
        new Date(a.publishedAt ?? a.createdAt).getTime(),
    )
    .slice(0, 3);

  recentCourses.forEach((course, index) => {
    const date = shiftDays(-(3 + index * 5));
    list.push({
      id: `ntf-new-${course.id}`,
      kind: 'novo_curso',
      title: `Novo treinamento disponível: ${course.title}`,
      message: `${course.summary} Confira no catálogo e inscreva-se.`,
      date: iso(date),
      read: index > 0,
      audience: 'todos',
      link: `/app/catalogo/${course.id}`,
    });
  });

  // Alertas individuais a partir das matrículas
  enrollments.forEach((enrollment) => {
    const course = courses.find((c) => c.id === enrollment.courseId);
    if (!course) return;
    const due = enrollment.dueDate ? new Date(enrollment.dueDate).getTime() : null;

    if (enrollment.status === 'atrasado' && due) {
      const days = Math.max(1, Math.round((now - due) / 86400000));
      list.push({
        id: `ntf-late-${enrollment.id}`,
        kind: 'atrasado',
        title: `Treinamento em atraso: ${course.title}`,
        message: `O prazo de conclusão venceu há ${days} ${days === 1 ? 'dia' : 'dias'}. Regularize o quanto antes para manter sua situação em conformidade.`,
        date: enrollment.dueDate!,
        read: false,
        audience: 'colaborador',
        employeeId: enrollment.employeeId,
        link: `/app/catalogo/${course.id}`,
      });
    }

    if (
      due &&
      (enrollment.status === 'em_andamento' || enrollment.status === 'nao_iniciado')
    ) {
      const daysLeft = Math.round((due - now) / 86400000);
      if (daysLeft >= 0 && daysLeft <= 12) {
        list.push({
          id: `ntf-due-${enrollment.id}`,
          kind: 'prazo',
          title: `Prazo próximo: ${course.title}`,
          message: `Faltam ${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'} para o encerramento do prazo deste treinamento.`,
          date: iso(shiftDays(-1)),
          read: false,
          audience: 'colaborador',
          employeeId: enrollment.employeeId,
          link: `/app/catalogo/${course.id}`,
        });
      }
    }

    if (
      enrollment.status === 'nao_iniciado' &&
      course.mandatory &&
      enrollment.employeeId
    ) {
      list.push({
        id: `ntf-mand-${enrollment.id}`,
        kind: 'obrigatorio',
        title: `Treinamento obrigatório atribuído: ${course.title}`,
        message: `Este treinamento é obrigatório para a sua função. Carga horária estimada de ${Math.round(course.durationMinutes / 60)}h.`,
        date: iso(shiftDays(-8)),
        read: true,
        audience: 'colaborador',
        employeeId: enrollment.employeeId,
        link: `/app/catalogo/${course.id}`,
      });
    }

    if (enrollment.status === 'concluido' && enrollment.completedAt) {
      const ageDays = (now - new Date(enrollment.completedAt).getTime()) / 86400000;
      if (ageDays < 25) {
        list.push({
          id: `ntf-cert-${enrollment.id}`,
          kind: 'certificado',
          title: `Certificado disponível: ${course.title}`,
          message: `Parabéns! Seu certificado foi emitido e já pode ser visualizado e impresso na área de certificados.`,
          date: enrollment.completedAt,
          read: ageDays > 10,
          audience: 'colaborador',
          employeeId: enrollment.employeeId,
          link: '/app/certificados',
        });
      }
    }
  });

  return list.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export interface SeedData {
  enrollments: Enrollment[];
  certificates: Certificate[];
  notifications: Notification[];
  activities: ActivityLog[];
}

export function generateSeedData(): SeedData {
  const enrollments = generateEnrollments();
  return {
    enrollments,
    certificates: generateCertificates(enrollments),
    notifications: generateNotifications(enrollments),
    activities: generateActivities(enrollments),
  };
}
