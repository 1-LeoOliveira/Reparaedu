import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Course, Employee, Enrollment, EnrollmentStatus, LearningPath } from '@/types';
import {
  Avatar,
  Badge,
  type BadgeTone,
  Card,
  CourseCover,
  Icon,
  ProgressBar,
} from '@/components/ui';
import { useDataStore } from '@/store/useDataStore';
import {
  cn,
  enrollmentStatusLabel,
  formatDate,
  formatMinutes,
  levelLabel,
} from '@/utils/format';

// ---------------------------------------------------------------------------
// Badges de status
// ---------------------------------------------------------------------------

const statusTone: Record<EnrollmentStatus, BadgeTone> = {
  concluido: 'success',
  em_andamento: 'brand',
  atrasado: 'danger',
  nao_iniciado: 'neutral',
};

const statusIcon: Record<EnrollmentStatus, string> = {
  concluido: 'CheckCircle2',
  em_andamento: 'PlayCircle',
  atrasado: 'AlertTriangle',
  nao_iniciado: 'Circle',
};

export function StatusBadge({ status }: { status: EnrollmentStatus }) {
  return (
    <Badge tone={statusTone[status]} icon={statusIcon[status]}>
      {enrollmentStatusLabel[status]}
    </Badge>
  );
}

export function LevelBadge({ level }: { level: Course['level'] }) {
  const tones: Record<Course['level'], BadgeTone> = {
    basico: 'info',
    intermediario: 'warning',
    avancado: 'purple',
  };
  return <Badge tone={tones[level]}>{levelLabel[level]}</Badge>;
}

export function CourseStatusBadge({ status }: { status: Course['status'] }) {
  const map: Record<Course['status'], { tone: BadgeTone; label: string; icon: string }> = {
    publicado: { tone: 'success', label: 'Publicado', icon: 'CheckCircle2' },
    rascunho: { tone: 'warning', label: 'Rascunho', icon: 'FileEdit' },
    arquivado: { tone: 'neutral', label: 'Arquivado', icon: 'Archive' },
  };
  const meta = map[status];
  return (
    <Badge tone={meta.tone} icon={meta.icon}>
      {meta.label}
    </Badge>
  );
}

export function DepartmentChip({
  departmentId,
  className,
}: {
  departmentId: string | null;
  className?: string;
}) {
  const departments = useDataStore((s) => s.departments);
  const department = departments.find((d) => d.id === departmentId);
  if (!department) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-500',
          className,
        )}
      >
        <span className="h-2 w-2 rounded-full bg-slate-300" />
        Todos os setores
      </span>
    );
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-600',
        className,
      )}
    >
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ background: department.color }}
      />
      {department.name}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Célula de colaborador (tabelas e listas)
// ---------------------------------------------------------------------------

export function EmployeeCell({
  employee,
  to,
  subtitle,
}: {
  employee: Employee;
  to?: string;
  subtitle?: string;
}) {
  const content = (
    <span className="flex items-center gap-3">
      <Avatar name={employee.name} src={employee.avatar} size="sm" />
      <span className="min-w-0">
        <span className="block truncate text-[13.5px] font-semibold text-navy-900">
          {employee.name}
        </span>
        <span className="block truncate text-[12px] text-slate-500">
          {subtitle ?? employee.jobTitle}
        </span>
      </span>
    </span>
  );

  if (to) {
    return (
      <Link to={to} className="group inline-flex min-w-0 items-center transition">
        <span className="min-w-0 group-hover:[&_span.block:first-child]:text-brand-700">
          {content}
        </span>
      </Link>
    );
  }
  return content;
}

// ---------------------------------------------------------------------------
// Cartão de treinamento
// ---------------------------------------------------------------------------

export function CourseCard({
  course,
  enrollment,
  to,
  footer,
}: {
  course: Course;
  enrollment?: Enrollment | null;
  to: string;
  footer?: ReactNode;
}) {
  const lessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <Card hover className="group flex h-full flex-col overflow-hidden">
      <Link to={to} className="block">
        <CourseCover
          icon={course.cover}
          from={course.coverFrom}
          to={course.coverTo}
          className="h-[104px]"
        >
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <div className="flex flex-wrap gap-1.5">
              {course.mandatory && (
                <span className="inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-rose-700">
                  <Icon name="AlertCircle" className="h-3 w-3" />
                  Obrigatório
                </span>
              )}
              {course.status === 'rascunho' && (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-400 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-amber-950">
                  Rascunho
                </span>
              )}
            </div>
            {enrollment?.status === 'concluido' && (
              <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-white ring-2 ring-white/40">
                <Icon name="Check" className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/45 to-transparent px-3 pb-2.5 pt-6">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/90">
              <Icon name="Clock" className="h-3 w-3" />
              {formatMinutes(course.durationMinutes)}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/90">
              <Icon name="Layers" className="h-3 w-3" />
              {course.modules.length} módulos
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/90">
              <Icon name="PlayCircle" className="h-3 w-3" />
              {lessons} aulas
            </span>
          </div>
        </CourseCover>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <DepartmentChip departmentId={course.departmentId} />
          <LevelBadge level={course.level} />
        </div>

        <Link to={to}>
          <h3 className="line-clamp-2 text-[14.5px] font-bold leading-snug tracking-tight text-navy-900 transition group-hover:text-brand-700">
            {course.title}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-slate-500">
          {course.summary}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <Avatar name={course.instructor} src={course.instructorAvatar} size="xs" />
          <span className="min-w-0 truncate text-[12px] font-medium text-slate-600">
            {course.instructor}
          </span>
        </div>

        <div className="mt-auto pt-4">
          {enrollment && enrollment.status !== 'nao_iniciado' ? (
            <div>
              <div className="mb-1.5 flex items-center justify-between text-[11.5px]">
                <StatusBadge status={enrollment.status} />
                <span className="font-bold tabular-nums text-navy-800">
                  {enrollment.progress}%
                </span>
              </div>
              <ProgressBar
                value={enrollment.progress}
                tone={
                  enrollment.status === 'concluido'
                    ? 'success'
                    : enrollment.status === 'atrasado'
                      ? 'danger'
                      : 'brand'
                }
              />
            </div>
          ) : (
            <div className="flex items-center justify-between text-[12px]">
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-500">
                <Icon name="Tag" className="h-3.5 w-3.5 text-slate-400" />
                {course.category}
              </span>
              {enrollment?.dueDate && (
                <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                  <Icon name="CalendarClock" className="h-3.5 w-3.5" />
                  {formatDate(enrollment.dueDate)}
                </span>
              )}
            </div>
          )}
          {footer}
        </div>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Cartão de trilha
// ---------------------------------------------------------------------------

export function PathCard({
  path,
  to,
  courseCount,
  completed,
  progress,
  minutes,
}: {
  path: LearningPath;
  to: string;
  courseCount: number;
  completed: number;
  progress: number;
  minutes: number;
}) {
  return (
    <Card hover className="group flex h-full flex-col overflow-hidden">
      <Link to={to}>
        <CourseCover
          icon={path.icon}
          from={path.coverFrom}
          to={path.coverTo}
          className="h-[88px]"
        >
          <div className="absolute inset-0 flex items-end justify-between p-3.5">
            <div className="flex gap-1.5">
              {path.mandatory && (
                <span className="rounded-md bg-white/95 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-rose-700">
                  Obrigatória
                </span>
              )}
              <span className="rounded-md bg-black/25 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-white backdrop-blur">
                {courseCount} treinamentos
              </span>
            </div>
          </div>
        </CourseCover>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <DepartmentChip departmentId={path.departmentId} className="mb-2" />
        <Link to={to}>
          <h3 className="line-clamp-2 text-[14.5px] font-bold leading-snug tracking-tight text-navy-900 transition group-hover:text-brand-700">
            {path.title}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-slate-500">
          {path.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="Clock" className="h-3.5 w-3.5 text-slate-400" />
            {formatMinutes(minutes)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="Users" className="h-3.5 w-3.5 text-slate-400" />
            {path.audience}
          </span>
        </div>

        <div className="mt-auto pt-4">
          <div className="mb-1.5 flex items-center justify-between text-[12px]">
            <span className="font-medium text-slate-500">
              {completed} de {courseCount} concluídos
            </span>
            <span className="font-bold tabular-nums text-navy-800">{progress}%</span>
          </div>
          <ProgressBar value={progress} tone={progress === 100 ? 'success' : 'brand'} />
        </div>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Barra de progresso com rótulo (tabelas)
// ---------------------------------------------------------------------------

export function ProgressCell({ value }: { value: number }) {
  return (
    <div className="flex min-w-[130px] items-center gap-2.5">
      <ProgressBar
        value={value}
        size="sm"
        tone={value === 100 ? 'success' : value >= 50 ? 'brand' : value > 0 ? 'warning' : 'navy'}
        className="flex-1"
      />
      <span className="w-9 shrink-0 text-right text-[12.5px] font-bold tabular-nums text-navy-800">
        {value}%
      </span>
    </div>
  );
}
