import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ActivityLog,
  Announcement,
  Certificate,
  Course,
  Department,
  Employee,
  Enrollment,
  LearningPath,
  Notification,
  Settings,
} from '@/types';
import { departments as seedDepartments } from '@/data/departments';
import { employees as seedEmployees } from '@/data/employees';
import { courses as seedCourses } from '@/data/courses';
import { learningPaths as seedPaths } from '@/data/learningPaths';
import { announcements as seedAnnouncements, defaultSettings } from '@/data/announcements';
import { assignedCourseIdsFor, generateSeedData } from '@/data/seed';

const DATA_VERSION = 4;

interface DataState {
  version: number;
  departments: Department[];
  employees: Employee[];
  courses: Course[];
  paths: LearningPath[];
  enrollments: Enrollment[];
  certificates: Certificate[];
  notifications: Notification[];
  announcements: Announcement[];
  activities: ActivityLog[];
  settings: Settings;

  // Departamentos
  addDepartment: (data: Omit<Department, 'id' | 'createdAt'>) => void;
  updateDepartment: (id: string, data: Partial<Department>) => void;
  removeDepartment: (id: string) => void;

  // Colaboradores
  addEmployee: (data: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;

  // Treinamentos
  addCourse: (course: Course) => void;
  updateCourse: (id: string, data: Partial<Course>) => void;
  removeCourse: (id: string) => void;
  setCourseStatus: (id: string, status: Course['status']) => void;

  // Trilhas
  addPath: (data: Omit<LearningPath, 'id'>) => void;
  updatePath: (id: string, data: Partial<LearningPath>) => void;
  removePath: (id: string) => void;

  // Aprendizagem
  startCourse: (employeeId: string, courseId: string) => void;
  toggleLesson: (employeeId: string, courseId: string, lessonId: string) => void;
  submitAssessment: (
    employeeId: string,
    courseId: string,
    answers: Record<string, string>,
  ) => { score: number; passed: boolean };

  // Notificações e comunicados
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (employeeId?: string) => void;
  removeNotification: (id: string) => void;
  pushNotification: (data: Omit<Notification, 'id'>) => void;
  addAnnouncement: (data: Omit<Announcement, 'id' | 'date'>) => void;
  removeAnnouncement: (id: string) => void;

  updateSettings: (data: Partial<Settings>) => void;
  resetDemoData: () => void;
}

function nextId(prefix: string, existing: Array<{ id: string }>) {
  let n = existing.length + 1;
  let candidate = `${prefix}-${String(n).padStart(2, '0')}`;
  while (existing.some((item) => item.id === candidate)) {
    n += 1;
    candidate = `${prefix}-${String(n).padStart(2, '0')}`;
  }
  return candidate;
}

function freshState() {
  const seed = generateSeedData();
  return {
    version: DATA_VERSION,
    departments: seedDepartments,
    employees: seedEmployees,
    courses: seedCourses,
    paths: seedPaths,
    announcements: seedAnnouncements,
    settings: defaultSettings,
    ...seed,
  };
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      ...freshState(),

      // ------------------------------- Departamentos ----------------------
      addDepartment: (data) =>
        set((state) => ({
          departments: [
            ...state.departments,
            {
              ...data,
              id: nextId('dep', state.departments),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateDepartment: (id, data) =>
        set((state) => ({
          departments: state.departments.map((d) =>
            d.id === id ? { ...d, ...data } : d,
          ),
        })),

      removeDepartment: (id) =>
        set((state) => ({
          departments: state.departments.filter((d) => d.id !== id),
        })),

      // ------------------------------- Colaboradores ----------------------
      addEmployee: (data) =>
        set((state) => {
          const id = nextId('emp', state.employees);
          const assigned = assignedCourseIdsFor(data.departmentId);
          const newEnrollments: Enrollment[] = assigned.map((courseId, index) => {
            const course = state.courses.find((c) => c.id === courseId);
            const due = course?.deadlineDays
              ? new Date(Date.now() + course.deadlineDays * 86400000).toISOString()
              : null;
            return {
              id: `enr-${id}-${index + 1}`,
              employeeId: id,
              courseId,
              status: 'nao_iniciado',
              progress: 0,
              startedAt: null,
              completedAt: null,
              dueDate: due,
              lastAccessAt: null,
              lessonsProgress:
                course?.modules.flatMap((m) =>
                  m.lessons.map((l) => ({
                    lessonId: l.id,
                    completed: false,
                    completedAt: null,
                  })),
                ) ?? [],
              attempts: [],
              score: null,
            };
          });

          return {
            employees: [...state.employees, { ...data, id }],
            enrollments: [...state.enrollments, ...newEnrollments],
          };
        }),

      updateEmployee: (id, data) =>
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === id ? { ...e, ...data } : e,
          ),
        })),

      removeEmployee: (id) =>
        set((state) => ({
          employees: state.employees.filter((e) => e.id !== id),
          enrollments: state.enrollments.filter((e) => e.employeeId !== id),
          certificates: state.certificates.filter((c) => c.employeeId !== id),
        })),

      // -------------------------------- Treinamentos ----------------------
      addCourse: (course) =>
        set((state) => ({ courses: [...state.courses, course] })),

      updateCourse: (id, data) =>
        set((state) => ({
          courses: state.courses.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),

      removeCourse: (id) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.id !== id),
          enrollments: state.enrollments.filter((e) => e.courseId !== id),
          certificates: state.certificates.filter((c) => c.courseId !== id),
          paths: state.paths.map((p) => ({
            ...p,
            courseIds: p.courseIds.filter((cid) => cid !== id),
          })),
        })),

      setCourseStatus: (id, status) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status,
                  publishedAt:
                    status === 'publicado'
                      ? c.publishedAt ?? new Date().toISOString()
                      : null,
                }
              : c,
          ),
        })),

      // ----------------------------------- Trilhas ------------------------
      addPath: (data) =>
        set((state) => ({
          paths: [...state.paths, { ...data, id: nextId('trl', state.paths) }],
        })),

      updatePath: (id, data) =>
        set((state) => ({
          paths: state.paths.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),

      removePath: (id) =>
        set((state) => ({ paths: state.paths.filter((p) => p.id !== id) })),

      // ------------------------------- Aprendizagem -----------------------
      startCourse: (employeeId, courseId) =>
        set((state) => {
          const course = state.courses.find((c) => c.id === courseId);
          if (!course) return state;
          const existing = state.enrollments.find(
            (e) => e.employeeId === employeeId && e.courseId === courseId,
          );
          const now = new Date().toISOString();

          if (existing) {
            if (existing.status === 'concluido') return state;
            return {
              enrollments: state.enrollments.map((e) =>
                e.id === existing.id
                  ? {
                      ...e,
                      status: e.status === 'atrasado' ? 'atrasado' : 'em_andamento',
                      startedAt: e.startedAt ?? now,
                      lastAccessAt: now,
                    }
                  : e,
              ),
            };
          }

          const enrollment: Enrollment = {
            id: `enr-${employeeId}-${courseId}-${Date.now()}`,
            employeeId,
            courseId,
            status: 'em_andamento',
            progress: 0,
            startedAt: now,
            completedAt: null,
            dueDate: course.deadlineDays
              ? new Date(Date.now() + course.deadlineDays * 86400000).toISOString()
              : null,
            lastAccessAt: now,
            lessonsProgress: course.modules.flatMap((m) =>
              m.lessons.map((l) => ({
                lessonId: l.id,
                completed: false,
                completedAt: null,
              })),
            ),
            attempts: [],
            score: null,
          };

          return {
            enrollments: [...state.enrollments, enrollment],
            activities: [
              {
                id: `act-${Date.now()}`,
                employeeId,
                action: 'iniciou o treinamento',
                target: course.title,
                date: now,
                kind: 'inicio' as const,
              },
              ...state.activities,
            ],
          };
        }),

      toggleLesson: (employeeId, courseId, lessonId) =>
        set((state) => {
          const course = state.courses.find((c) => c.id === courseId);
          if (!course) return state;
          const now = new Date().toISOString();
          const totalLessons = course.modules.reduce(
            (sum, m) => sum + m.lessons.length,
            0,
          );

          let touched = false;
          const enrollments = state.enrollments.map((enrollment) => {
            if (
              enrollment.employeeId !== employeeId ||
              enrollment.courseId !== courseId
            ) {
              return enrollment;
            }
            touched = true;
            const lessonsProgress = enrollment.lessonsProgress.map((lp) =>
              lp.lessonId === lessonId
                ? {
                    ...lp,
                    completed: !lp.completed,
                    completedAt: !lp.completed ? now : null,
                  }
                : lp,
            );
            const completed = lessonsProgress.filter((lp) => lp.completed).length;
            const progress = totalLessons
              ? Math.round((completed / totalLessons) * 100)
              : 0;

            const allDone = completed === totalLessons;
            const requiresAssessment = Boolean(course.assessment);
            const alreadyApproved = enrollment.attempts.some((a) => a.passed);

            let status = enrollment.status;
            if (allDone && (!requiresAssessment || alreadyApproved)) {
              status = 'concluido';
            } else if (completed === 0) {
              status = enrollment.status === 'atrasado' ? 'atrasado' : 'nao_iniciado';
            } else {
              status = enrollment.status === 'atrasado' ? 'atrasado' : 'em_andamento';
            }

            return {
              ...enrollment,
              lessonsProgress,
              progress,
              status,
              startedAt: enrollment.startedAt ?? now,
              lastAccessAt: now,
              completedAt: status === 'concluido' ? enrollment.completedAt ?? now : null,
            };
          });

          if (!touched) return state;
          return { enrollments };
        }),

      submitAssessment: (employeeId, courseId, answers) => {
        const state = get();
        const course = state.courses.find((c) => c.id === courseId);
        if (!course || !course.assessment) return { score: 0, passed: false };

        const questions = course.assessment.questions;
        const correct = questions.filter(
          (q) => answers[q.id] === q.correctOptionId,
        ).length;
        const score = Math.round((correct / questions.length) * 100);
        const passed = score >= course.assessment.minimumScore;
        const now = new Date().toISOString();

        set((current) => {
          const enrollments = current.enrollments.map((enrollment) => {
            if (
              enrollment.employeeId !== employeeId ||
              enrollment.courseId !== courseId
            ) {
              return enrollment;
            }
            const attempt = {
              id: `att-${Date.now()}`,
              score,
              passed,
              date: now,
              answers,
            };
            const lessonsProgress = passed
              ? enrollment.lessonsProgress.map((lp) => ({
                  ...lp,
                  completed: true,
                  completedAt: lp.completedAt ?? now,
                }))
              : enrollment.lessonsProgress;

            return {
              ...enrollment,
              attempts: [...enrollment.attempts, attempt],
              score: passed ? score : enrollment.score,
              status: passed ? ('concluido' as const) : enrollment.status,
              progress: passed ? 100 : enrollment.progress,
              completedAt: passed ? now : enrollment.completedAt,
              lastAccessAt: now,
              lessonsProgress,
            };
          });

          const hasCertificate = current.certificates.some(
            (c) => c.employeeId === employeeId && c.courseId === courseId,
          );

          const certificates =
            passed && !hasCertificate
              ? [
                  ...current.certificates,
                  {
                    id: `cert-${Date.now()}`,
                    code: `UC-${new Date().getFullYear()}-${Math.floor(
                      Math.random() * 899999 + 100000,
                    )}`,
                    employeeId,
                    courseId,
                    issuedAt: now,
                    hours: Math.max(1, Math.round(course.durationMinutes / 60)),
                    score,
                  },
                ]
              : current.certificates;

          const activities: ActivityLog[] = [
            {
              id: `act-av-${Date.now()}`,
              employeeId,
              action: passed
                ? `foi aprovado na avaliação com ${score}%`
                : `não alcançou a nota mínima na avaliação (${score}%)`,
              target: course.title,
              date: now,
              kind: 'avaliacao',
            },
            ...(passed
              ? [
                  {
                    id: `act-cc-${Date.now()}`,
                    employeeId,
                    action: 'concluiu o treinamento',
                    target: course.title,
                    date: now,
                    kind: 'conclusao' as const,
                  },
                ]
              : []),
            ...current.activities,
          ];

          const notifications =
            passed && !hasCertificate
              ? [
                  {
                    id: `ntf-${Date.now()}`,
                    kind: 'certificado' as const,
                    title: `Certificado disponível: ${course.title}`,
                    message:
                      'Parabéns! Seu certificado foi emitido e já pode ser visualizado e impresso.',
                    date: now,
                    read: false,
                    audience: 'colaborador' as const,
                    employeeId,
                    link: '/app/certificados',
                  },
                  ...current.notifications,
                ]
              : current.notifications;

          return { enrollments, certificates, activities, notifications };
        });

        return { score, passed };
      },

      // ------------------------- Notificações / comunicados ---------------
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),

      markAllNotificationsRead: (employeeId) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            !employeeId || !n.employeeId || n.employeeId === employeeId
              ? { ...n, read: true }
              : n,
          ),
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      pushNotification: (data) =>
        set((state) => ({
          notifications: [
            { ...data, id: `ntf-${Date.now()}` },
            ...state.notifications,
          ],
        })),

      addAnnouncement: (data) =>
        set((state) => {
          const announcement: Announcement = {
            ...data,
            id: nextId('com', state.announcements),
            date: new Date().toISOString(),
          };
          return {
            announcements: [announcement, ...state.announcements],
            notifications: [
              {
                id: `ntf-com-${Date.now()}`,
                kind: 'comunicado' as const,
                title: announcement.title,
                message: `${announcement.content.slice(0, 120)}…`,
                date: announcement.date,
                read: false,
                audience: 'todos' as const,
                link: '/app/notificacoes',
              },
              ...state.notifications,
            ],
          };
        }),

      removeAnnouncement: (id) =>
        set((state) => ({
          announcements: state.announcements.filter((a) => a.id !== id),
        })),

      updateSettings: (data) =>
        set((state) => ({ settings: { ...state.settings, ...data } })),

      resetDemoData: () => set(freshState()),
    }),
    {
      name: 'uc-data',
      version: DATA_VERSION,
      migrate: () => freshState() as unknown as DataState,
    },
  ),
);
