import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardHeader,
  CourseCover,
  EmptyState,
  Icon,
  ProgressBar,
  RadialProgress,
} from '@/components/ui';
import { DepartmentChip, StatusBadge } from '@/components/shared';
import { useAuthStore } from '@/store/useAuthStore';
import { useDataStore } from '@/store/useDataStore';
import { usePathsProgress } from '@/hooks/useAnalytics';
import { cn, formatDate, formatMinutes } from '@/utils/format';

export default function EmployeePathDetail() {
  const { pathId = '' } = useParams();
  const user = useAuthStore((s) => s.user);
  const enrollments = useDataStore((s) => s.enrollments);
  const startCourse = useDataStore((s) => s.startCourse);
  const paths = usePathsProgress(user?.id);
  const navigate = useNavigate();

  const item = paths.find((p) => p.path.id === pathId);

  if (!item) {
    return (
      <Card>
        <EmptyState
          icon="FileQuestion"
          title="Trilha não encontrada"
          description="Esta jornada de desenvolvimento não está mais disponível."
          action={
            <Button icon="ArrowLeft" onClick={() => navigate('/app/trilhas')}>
              Voltar às trilhas
            </Button>
          }
        />
      </Card>
    );
  }

  const { path, courses } = item;
  const enrollmentOf = (courseId: string) =>
    enrollments.find((e) => e.employeeId === user?.id && e.courseId === courseId) ?? null;

  const nextCourse = courses.find((course) => {
    const enrollment = enrollmentOf(course.id);
    return !enrollment || enrollment.status !== 'concluido';
  });

  return (
    <div>
      <div className="mb-4">
        <Breadcrumbs
          items={[
            { label: 'Início', to: '/app' },
            { label: 'Trilhas', to: '/app/trilhas' },
            { label: path.title },
          ]}
        />
      </div>

      <CourseCover
        icon={path.icon}
        from={path.coverFrom}
        to={path.coverTo}
        className="mb-6 rounded-2xl p-6 sm:p-8"
        iconClassName="right-8 h-36 w-36"
      >
        <div className="relative max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            {path.mandatory && (
              <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-rose-700">
                Trilha obrigatória
              </span>
            )}
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
              {courses.length} treinamentos
            </span>
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
              {formatMinutes(item.minutes)}
            </span>
          </div>
          <h1 className="mt-4 text-[26px] font-extrabold leading-tight tracking-tight text-white sm:text-[31px]">
            {path.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-white/85">
            {path.description}
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-white/85">
            <Icon name="Users" className="h-4 w-4" />
            Público-alvo: {path.audience}
          </p>
        </div>
      </CourseCover>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ------------------------------- Etapas ----------------------- */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Etapas da trilha"
              subtitle="Siga a sequência recomendada para melhor aproveitamento"
              icon="ListOrdered"
            />
            <ol className="relative px-5 py-5">
              <span className="absolute bottom-8 left-[38px] top-9 w-px bg-slate-200" />
              {courses.map((course, index) => {
                const enrollment = enrollmentOf(course.id);
                const status = enrollment?.status ?? 'nao_iniciado';
                const done = status === 'concluido';
                const isNext = nextCourse?.id === course.id;

                return (
                  <li key={course.id} className="relative flex gap-4 pb-6 last:pb-0">
                    <span
                      className={cn(
                        'relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[13px] font-bold ring-4 ring-white',
                        done
                          ? 'bg-emerald-500 text-white'
                          : isNext
                            ? 'bg-brand-600 text-white'
                            : 'bg-slate-200 text-slate-600',
                      )}
                    >
                      {done ? (
                        <Icon name="Check" className="h-4 w-4" strokeWidth={3} />
                      ) : (
                        index + 1
                      )}
                    </span>

                    <div
                      className={cn(
                        'min-w-0 flex-1 rounded-xl border p-4 transition',
                        isNext
                          ? 'border-brand-300 bg-brand-50/40 shadow-sm'
                          : 'border-slate-200 bg-white',
                      )}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="mb-1.5 flex flex-wrap items-center gap-2">
                            <StatusBadge status={status} />
                            {course.mandatory && (
                              <Badge tone="danger" icon="AlertCircle">
                                Obrigatório
                              </Badge>
                            )}
                            {isNext && (
                              <Badge tone="brand" icon="ArrowRight">
                                Próxima etapa
                              </Badge>
                            )}
                          </div>
                          <Link
                            to={`/app/catalogo/${course.id}`}
                            className="text-[15px] font-bold leading-snug tracking-tight text-navy-900 transition hover:text-brand-700"
                          >
                            {course.title}
                          </Link>
                          <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-slate-500">
                            {course.summary}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-500">
                            <span className="inline-flex items-center gap-1.5">
                              <Icon name="Clock" className="h-3.5 w-3.5 text-slate-400" />
                              {formatMinutes(course.durationMinutes)}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Icon name="Layers" className="h-3.5 w-3.5 text-slate-400" />
                              {course.modules.length} módulos
                            </span>
                            <DepartmentChip departmentId={course.departmentId} />
                            {enrollment?.dueDate && status !== 'concluido' && (
                              <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700">
                                <Icon name="CalendarClock" className="h-3.5 w-3.5" />
                                {formatDate(enrollment.dueDate)}
                              </span>
                            )}
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant={done ? 'outline' : isNext ? 'primary' : 'subtle'}
                          icon={done ? 'RotateCcw' : 'Play'}
                          onClick={() => {
                            if (user) startCourse(user.id, course.id);
                            navigate(`/app/treinamento/${course.id}/player`);
                          }}
                        >
                          {done ? 'Revisar' : status === 'nao_iniciado' ? 'Iniciar' : 'Continuar'}
                        </Button>
                      </div>

                      {enrollment && status !== 'nao_iniciado' && (
                        <div className="mt-3">
                          <div className="mb-1 flex items-center justify-between text-[11.5px]">
                            <span className="font-medium text-slate-500">Progresso</span>
                            <span className="font-bold tabular-nums text-navy-800">
                              {enrollment.progress}%
                            </span>
                          </div>
                          <ProgressBar
                            value={enrollment.progress}
                            size="sm"
                            tone={done ? 'success' : status === 'atrasado' ? 'danger' : 'brand'}
                          />
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>
        </div>

        {/* ------------------------------ Resumo ------------------------ */}
        <div className="space-y-5">
          <Card>
            <div className="flex flex-col items-center border-b border-slate-100 px-5 py-6">
              <RadialProgress value={item.progress} sublabel="da trilha" />
              <p className="mt-4 text-center text-[13px] text-slate-500">
                <strong className="font-bold text-navy-900">{item.completed}</strong> de{' '}
                <strong className="font-bold text-navy-900">{courses.length}</strong>{' '}
                treinamentos concluídos
              </p>
            </div>
            <dl className="divide-y divide-slate-100">
              {[
                { label: 'Carga horária total', value: formatMinutes(item.minutes) },
                {
                  label: 'Obrigatoriedade',
                  value: path.mandatory ? 'Obrigatória' : 'Opcional',
                },
                { label: 'Prazo sugerido', value: `${path.deadlineDays} dias` },
                { label: 'Treinamentos pendentes', value: item.pending },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-3 px-5 py-2.5"
                >
                  <dt className="text-[12.5px] text-slate-500">{row.label}</dt>
                  <dd className="text-[12.5px] font-semibold text-navy-900">{row.value}</dd>
                </div>
              ))}
            </dl>
            {nextCourse && (
              <div className="p-5">
                <Button
                  className="w-full justify-center"
                  icon="Play"
                  onClick={() => {
                    if (user) startCourse(user.id, nextCourse.id);
                    navigate(`/app/treinamento/${nextCourse.id}/player`);
                  }}
                >
                  Continuar a trilha
                </Button>
                <p className="mt-2 text-center text-[11.5px] text-slate-400">
                  Próximo: {nextCourse.title}
                </p>
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Como funciona" icon="HelpCircle" />
            <ul className="space-y-3 px-5 py-5">
              {[
                {
                  icon: 'ListOrdered',
                  text: 'Os treinamentos seguem uma ordem recomendada, do mais introdutório ao mais específico.',
                },
                {
                  icon: 'CheckCircle2',
                  text: 'Cada etapa é concluída ao finalizar todas as aulas e ser aprovado na avaliação.',
                },
                {
                  icon: 'Award',
                  text: 'Cada treinamento concluído gera um certificado individual.',
                },
                {
                  icon: 'TrendingUp',
                  text: 'O progresso da trilha é acompanhado pela sua liderança e pela área de RH.',
                },
              ].map((help) => (
                <li key={help.text} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700">
                    <Icon name={help.icon} className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-[12.5px] leading-relaxed text-slate-600">{help.text}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
