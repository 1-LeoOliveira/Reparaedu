import { Link, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  CourseCover,
  EmptyState,
  Icon,
  LinkButton,
  ProgressBar,
  RadialProgress,
  SectionTitle,
  StatCard,
} from '@/components/ui';
import { CourseCard, StatusBadge } from '@/components/shared';
import { useAuthStore } from '@/store/useAuthStore';
import { useDataStore } from '@/store/useDataStore';
import { useEmployeeLearning, usePathsProgress } from '@/hooks/useAnalytics';
import {
  daysBetween,
  firstName,
  formatDate,
  formatHours,
  formatMinutes,
  relativeTime,
} from '@/utils/format';

const activityIcon: Record<string, { icon: string; className: string }> = {
  conclusao: { icon: 'CheckCircle2', className: 'bg-emerald-50 text-emerald-600' },
  inicio: { icon: 'PlayCircle', className: 'bg-brand-50 text-brand-600' },
  avaliacao: { icon: 'ClipboardCheck', className: 'bg-violet-50 text-violet-600' },
  certificado: { icon: 'Award', className: 'bg-amber-50 text-amber-600' },
  acesso: { icon: 'Eye', className: 'bg-slate-100 text-slate-500' },
};

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function EmployeeDashboard() {
  const user = useAuthStore((s) => s.user);
  const departments = useDataStore((s) => s.departments);
  const announcements = useDataStore((s) => s.announcements);
  const startCourse = useDataStore((s) => s.startCourse);
  const navigate = useNavigate();

  const learning = useEmployeeLearning(user?.id);
  const paths = usePathsProgress(user?.id);

  if (!user) return null;
  const department = departments.find((d) => d.id === user.departmentId);

  const mandatoryPending = learning.items
    .filter((i) => i.course.mandatory && i.enrollment.status !== 'concluido')
    .sort(
      (a, b) =>
        new Date(a.enrollment.dueDate ?? 0).getTime() -
        new Date(b.enrollment.dueDate ?? 0).getTime(),
    );

  const inProgress = learning.items
    .filter((i) => i.enrollment.status === 'em_andamento' || i.enrollment.status === 'atrasado')
    .sort((a, b) => b.enrollment.progress - a.enrollment.progress);

  const relevantPaths = paths
    .filter(
      (p) => !p.path.departmentId || p.path.departmentId === user.departmentId,
    )
    .sort((a, b) => b.progress - a.progress);

  const continueItem = learning.continueItem;

  return (
    <div className="space-y-7">
      {/* ----------------------------- Saudação -------------------------- */}
      <section className="relative overflow-hidden rounded-2xl bg-navy-950 p-6 sm:p-7">
        <div className="absolute inset-0 grid-pattern opacity-60" />
        <div
          className="absolute -right-20 -top-24 h-72 w-72 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.4), transparent 70%)' }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar name={user.name} src={user.avatar} size="xl" ring className="ring-white/20" />
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold uppercase tracking-wide text-brand-300">
                {greeting()}, {firstName(user.name)}
              </p>
              <h1 className="mt-1 truncate text-[24px] font-extrabold tracking-tight text-white sm:text-[27px]">
                {user.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-navy-200">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="Briefcase" className="h-3.5 w-3.5 text-navy-400" />
                  {user.jobTitle}
                </span>
                {department && (
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: department.color }}
                    />
                    {department.name}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="Mail" className="h-3.5 w-3.5 text-navy-400" />
                  {user.email}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <RadialProgress
              value={learning.progress}
              size={96}
              stroke={8}
              sublabel="geral"
            />
            <div className="space-y-2 text-[12.5px]">
              <p className="flex items-center gap-2 text-navy-100">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <strong className="font-bold text-white">{learning.completed}</strong>
                concluídos
              </p>
              <p className="flex items-center gap-2 text-navy-100">
                <span className="h-2 w-2 rounded-full bg-brand-400" />
                <strong className="font-bold text-white">{learning.inProgress}</strong>
                em andamento
              </p>
              <p className="flex items-center gap-2 text-navy-100">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <strong className="font-bold text-white">{learning.late}</strong>
                em atraso
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------- Indicadores ------------------------- */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Treinamentos atribuídos"
          value={learning.total}
          icon="BookOpen"
          tone="navy"
          hint={`${learning.pending} pendente${learning.pending === 1 ? '' : 's'} de conclusão`}
        />
        <StatCard
          label="Conclusão geral"
          value={`${learning.progress}%`}
          icon="Target"
          tone="brand"
          hint={`${learning.completed} de ${learning.total} treinamentos concluídos`}
        />
        <StatCard
          label="Horas de capacitação"
          value={formatHours(learning.minutes)}
          icon="Clock"
          tone="success"
          hint="Somatório da carga horária concluída"
        />
        <StatCard
          label="Certificados"
          value={learning.certificates.length}
          icon="Award"
          tone="warning"
          hint="Disponíveis para visualização e impressão"
          onClick={() => navigate('/app/certificados')}
        />
      </section>

      {/* ------------------------ Continuar assistindo ------------------- */}
      {continueItem && (
        <section>
          <SectionTitle
            title="Continue de onde parou"
            description="Retome o último treinamento acessado"
            icon="PlayCircle"
          />
          <Card className="overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <CourseCover
                icon={continueItem.course.cover}
                from={continueItem.course.coverFrom}
                to={continueItem.course.coverTo}
                className="h-32 shrink-0 sm:h-auto sm:w-56"
              >
                <div className="absolute inset-0 grid place-items-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white/95 text-brand-700 shadow-lg transition hover:scale-105">
                    <Icon name="Play" className="ml-0.5 h-5 w-5" strokeWidth={2.4} />
                  </span>
                </div>
              </CourseCover>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-5">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <StatusBadge status={continueItem.enrollment.status} />
                    {continueItem.course.mandatory && (
                      <Badge tone="danger" icon="AlertCircle">
                        Obrigatório
                      </Badge>
                    )}
                    {continueItem.enrollment.dueDate && (
                      <span className="text-[12px] font-medium text-slate-500">
                        Prazo: {formatDate(continueItem.enrollment.dueDate)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-[17px] font-bold leading-snug tracking-tight text-navy-900">
                    {continueItem.course.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
                    {continueItem.course.summary}
                  </p>
                  <p className="mt-2.5 text-[12px] text-slate-400">
                    Último acesso {relativeTime(continueItem.enrollment.lastAccessAt)} ·{' '}
                    {continueItem.enrollment.lessonsProgress.filter((l) => l.completed).length} de{' '}
                    {continueItem.enrollment.lessonsProgress.length} aulas concluídas
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="min-w-[180px] flex-1">
                    <div className="mb-1.5 flex items-center justify-between text-[12px]">
                      <span className="font-semibold text-slate-600">Progresso</span>
                      <span className="font-bold tabular-nums text-navy-900">
                        {continueItem.enrollment.progress}%
                      </span>
                    </div>
                    <ProgressBar value={continueItem.enrollment.progress} size="lg" />
                  </div>
                  <Button
                    icon="Play"
                    onClick={() => {
                      startCourse(user.id, continueItem.course.id);
                      navigate(`/app/treinamento/${continueItem.course.id}/player`);
                    }}
                  >
                    Retomar treinamento
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* ----------------------- Em andamento ------------------------- */}
        <section className="xl:col-span-2">
          <SectionTitle
            title="Treinamentos em andamento"
            description="Cursos iniciados e ainda não concluídos"
            icon="BookOpen"
            action={
              <LinkButton to="/app/meus-treinamentos" variant="ghost" size="sm" iconRight="ArrowRight">
                Ver todos
              </LinkButton>
            }
          />
          {inProgress.length === 0 ? (
            <Card>
              <EmptyState
                icon="BookOpenCheck"
                title="Nenhum treinamento em andamento"
                description="Explore o catálogo e inicie um novo treinamento para evoluir na sua trilha de desenvolvimento."
                action={
                  <LinkButton to="/app/catalogo" icon="LibraryBig">
                    Explorar catálogo
                  </LinkButton>
                }
              />
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {inProgress.slice(0, 4).map(({ course, enrollment }) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  enrollment={enrollment}
                  to={`/app/catalogo/${course.id}`}
                />
              ))}
            </div>
          )}
        </section>

        {/* ----------------------- Próximos prazos ---------------------- */}
        <section className="space-y-6">
          <div>
            <SectionTitle
              title="Obrigatórios e prazos"
              description="Atenção aos vencimentos"
              icon="CalendarClock"
            />
            <Card>
              {mandatoryPending.length === 0 ? (
                <EmptyState
                  compact
                  icon="ShieldCheck"
                  title="Tudo em conformidade"
                  description="Você não possui treinamentos obrigatórios pendentes."
                />
              ) : (
                <ul className="divide-y divide-slate-100">
                  {mandatoryPending.slice(0, 5).map(({ course, enrollment }) => {
                    const days = enrollment.dueDate
                      ? daysBetween(new Date(), enrollment.dueDate)
                      : null;
                    const late = enrollment.status === 'atrasado';
                    return (
                      <li key={course.id}>
                        <Link
                          to={`/app/catalogo/${course.id}`}
                          className="flex items-start gap-3 px-4 py-3 transition hover:bg-slate-50"
                        >
                          <span
                            className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                              late ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                            }`}
                          >
                            <Icon
                              name={late ? 'AlertTriangle' : 'Clock'}
                              className="h-4 w-4"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-semibold text-navy-900">
                              {course.title}
                            </span>
                            <span className="mt-0.5 block text-[12px] text-slate-500">
                              {late
                                ? `Vencido há ${Math.abs(days ?? 0)} dia${Math.abs(days ?? 0) === 1 ? '' : 's'}`
                                : days !== null
                                  ? `Faltam ${days} dia${days === 1 ? '' : 's'} · ${formatDate(enrollment.dueDate)}`
                                  : 'Sem prazo definido'}
                            </span>
                            <span className="mt-1.5 block">
                              <ProgressBar
                                value={enrollment.progress}
                                size="sm"
                                tone={late ? 'danger' : 'warning'}
                              />
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          </div>

          {/* ------------------------ Trilhas ------------------------- */}
          <div>
            <SectionTitle
              title="Minhas trilhas"
              description="Jornadas de desenvolvimento"
              icon="Route"
              action={
                <LinkButton to="/app/trilhas" variant="ghost" size="sm" iconRight="ArrowRight">
                  Ver
                </LinkButton>
              }
            />
            <Card className="divide-y divide-slate-100">
              {relevantPaths.slice(0, 4).map((item) => (
                <Link
                  key={item.path.id}
                  to={`/app/trilhas/${item.path.id}`}
                  className="block px-4 py-3 transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${item.path.coverFrom}, ${item.path.coverTo})`,
                      }}
                    >
                      <Icon name={item.path.icon} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-navy-900">
                        {item.path.title}
                      </p>
                      <p className="text-[12px] text-slate-500">
                        {item.completed} de {item.courses.length} treinamentos ·{' '}
                        {formatMinutes(item.minutes)}
                      </p>
                    </div>
                    <span className="shrink-0 text-[12.5px] font-bold tabular-nums text-navy-800">
                      {item.progress}%
                    </span>
                  </div>
                  <ProgressBar
                    value={item.progress}
                    size="sm"
                    className="mt-2"
                    tone={item.progress === 100 ? 'success' : 'brand'}
                  />
                </Link>
              ))}
            </Card>
          </div>
        </section>
      </div>

      {/* ------------------- Atividades e comunicados ------------------- */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <SectionTitle
            title="Últimas atividades"
            description="Seu histórico recente de aprendizagem"
            icon="History"
          />
          <Card>
            {learning.activities.length === 0 ? (
              <EmptyState
                compact
                icon="History"
                title="Nenhuma atividade registrada"
                description="Ao iniciar um treinamento, seu histórico aparecerá aqui."
              />
            ) : (
              <ul className="divide-y divide-slate-100">
                {learning.activities.slice(0, 7).map((activity) => {
                  const style = activityIcon[activity.kind] ?? activityIcon.acesso;
                  return (
                    <li key={activity.id} className="flex items-start gap-3 px-4 py-3">
                      <span
                        className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${style.className}`}
                      >
                        <Icon name={style.icon} className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] leading-snug text-slate-600">
                          Você {activity.action}{' '}
                          <strong className="font-semibold text-navy-900">
                            {activity.target}
                          </strong>
                        </p>
                        <p className="mt-0.5 text-[11.5px] text-slate-400">
                          {relativeTime(activity.date)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </section>

        <section>
          <SectionTitle
            title="Comunicados da empresa"
            description="Avisos institucionais e novidades"
            icon="Megaphone"
          />
          <Card>
            <ul className="divide-y divide-slate-100">
              {announcements.slice(0, 4).map((announcement) => (
                <li key={announcement.id} className="px-4 py-3.5">
                  <div className="flex items-start gap-3">
                    <Avatar
                      name={announcement.author}
                      src={announcement.authorAvatar}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[13.5px] font-bold text-navy-900">
                          {announcement.title}
                        </p>
                        {announcement.pinned && (
                          <Badge tone="brand" icon="Pin">
                            Fixado
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-slate-500">
                        {announcement.content}
                      </p>
                      <p className="mt-1.5 text-[11.5px] text-slate-400">
                        {announcement.author} · {announcement.tag} ·{' '}
                        {relativeTime(announcement.date)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-2.5">
              <Link
                to="/app/notificacoes"
                className="flex items-center justify-center gap-1.5 text-[12.5px] font-semibold text-brand-700 transition hover:text-brand-800"
              >
                Ver todos os comunicados
                <Icon name="ArrowRight" className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
