import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
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
import { LevelBadge, StatusBadge } from '@/components/shared';
import { useAuthStore } from '@/store/useAuthStore';
import { useDataStore } from '@/store/useDataStore';
import { useCourseProgress } from '@/hooks/useAnalytics';
import { toast } from '@/store/useToastStore';
import {
  cn,
  formatDate,
  formatMinutes,
  levelLabel,
  relativeTime,
} from '@/utils/format';

const materialIcon: Record<string, string> = {
  pdf: 'FileText',
  xlsx: 'FileSpreadsheet',
  docx: 'FileType',
  link: 'Link',
};

export function downloadDemoMaterial(name: string) {
  const content = [
    'UNIVERSIDADE CORPORATIVA — MATERIAL DEMONSTRATIVO',
    '================================================',
    '',
    `Arquivo: ${name}`,
    `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
    '',
    'Este arquivo é um material de demonstração do protótipo da plataforma.',
    'Na implantação definitiva, este download entregaria o material real',
    'anexado ao treinamento pela equipe responsável pelo conteúdo.',
  ].join('\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${name.replace(/\.[a-z]+$/i, '')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function CourseDetail() {
  const { courseId = '' } = useParams();
  const user = useAuthStore((s) => s.user);
  const courses = useDataStore((s) => s.courses);
  const departments = useDataStore((s) => s.departments);
  const startCourse = useDataStore((s) => s.startCourse);
  const toggleLesson = useDataStore((s) => s.toggleLesson);
  const navigate = useNavigate();

  const course = courses.find((c) => c.id === courseId);
  const enrollment = useCourseProgress(user?.id, courseId);
  const [openModules, setOpenModules] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (course) setOpenModules([course.modules[0]?.id].filter(Boolean) as string[]);
  }, [course?.id]);

  if (!course) {
    return (
      <Card>
        <EmptyState
          icon="FileQuestion"
          title="Treinamento não encontrado"
          description="O conteúdo que você tentou acessar não está mais disponível no catálogo."
          action={
            <Button icon="ArrowLeft" onClick={() => navigate('/app/catalogo')}>
              Voltar ao catálogo
            </Button>
          }
        />
      </Card>
    );
  }

  const department = departments.find((d) => d.id === course.departmentId);
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons =
    enrollment?.lessonsProgress.filter((l) => l.completed).length ?? 0;
  const progress = enrollment?.progress ?? 0;
  const approved = enrollment?.attempts.some((a) => a.passed) ?? false;
  const allLessonsDone = completedLessons === totalLessons && totalLessons > 0;

  const isLessonDone = (lessonId: string) =>
    enrollment?.lessonsProgress.find((l) => l.lessonId === lessonId)?.completed ?? false;

  const handleStart = () => {
    if (!user) return;
    startCourse(user.id, course.id);
    navigate(`/app/treinamento/${course.id}/player`);
  };

  const toggleModule = (moduleId: string) =>
    setOpenModules((current) =>
      current.includes(moduleId)
        ? current.filter((id) => id !== moduleId)
        : [...current, moduleId],
    );

  return (
    <div>
      <div className="mb-4">
        <Breadcrumbs
          items={[
            { label: 'Início', to: '/app' },
            { label: 'Catálogo', to: '/app/catalogo' },
            { label: course.title },
          ]}
        />
      </div>

      {/* --------------------------------- Capa -------------------------- */}
      <CourseCover
        icon={course.cover}
        from={course.coverFrom}
        to={course.coverTo}
        className="mb-6 rounded-2xl p-6 sm:p-8"
        iconClassName="right-8 hidden h-36 w-36 sm:block"
      >
        <div className="relative max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            {course.mandatory && (
              <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-rose-700">
                <Icon name="AlertCircle" className="h-3 w-3" />
                Obrigatório
              </span>
            )}
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
              {course.category}
            </span>
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
              {levelLabel[course.level]}
            </span>
            {department && (
              <span className="rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
                {department.name}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-[26px] font-extrabold leading-tight tracking-tight text-white sm:text-[32px]">
            {course.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-white/85">
            {course.summary}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px] font-medium text-white/85">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Clock" className="h-4 w-4" />
              {formatMinutes(course.durationMinutes)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Layers" className="h-4 w-4" />
              {course.modules.length} módulos
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="PlayCircle" className="h-4 w-4" />
              {totalLessons} aulas
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Users" className="h-4 w-4" />
              {course.enrolledCount} inscritos
            </span>
            {course.rating > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Icon name="Star" className="h-4 w-4" />
                {course.rating.toFixed(1).replace('.', ',')}
              </span>
            )}
          </div>
        </div>
      </CourseCover>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ----------------------------- Conteúdo ----------------------- */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Sobre o treinamento" icon="Info" />
            <div className="px-5 py-5">
              <p className="text-[13.5px] leading-relaxed text-slate-600">
                {course.description}
              </p>

              <h4 className="mt-6 text-[13px] font-bold uppercase tracking-wide text-navy-900">
                Objetivos de aprendizagem
              </h4>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {course.objectives.map((objective) => (
                  <li key={objective} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                      <Icon name="Check" className="h-2.5 w-2.5" strokeWidth={3.2} />
                    </span>
                    <span className="text-[13px] leading-snug text-slate-600">
                      {objective}
                    </span>
                  </li>
                ))}
              </ul>

              <h4 className="mt-6 text-[13px] font-bold uppercase tracking-wide text-navy-900">
                Conteúdo programático
              </h4>
              <ul className="mt-3 space-y-1.5">
                {course.syllabus.map((topic, index) => (
                  <li key={topic} className="flex items-start gap-2.5">
                    <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded bg-slate-100 text-[10.5px] font-bold text-slate-500">
                      {index + 1}
                    </span>
                    <span className="text-[13px] leading-snug text-slate-600">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* ------------------------ Módulos e aulas ------------------- */}
          <Card>
            <CardHeader
              title="Módulos e aulas"
              subtitle={`${course.modules.length} módulos · ${totalLessons} aulas · ${formatMinutes(course.durationMinutes)}`}
              icon="ListTree"
              action={
                <button
                  type="button"
                  onClick={() =>
                    setOpenModules((current) =>
                      current.length === course.modules.length
                        ? []
                        : course.modules.map((m) => m.id),
                    )
                  }
                  className="text-[12.5px] font-semibold text-brand-700 transition hover:text-brand-800"
                >
                  {openModules.length === course.modules.length
                    ? 'Recolher todos'
                    : 'Expandir todos'}
                </button>
              }
            />
            <div className="divide-y divide-slate-100">
              {course.modules.map((module, moduleIndex) => {
                const open = openModules.includes(module.id);
                const moduleMinutes = module.lessons.reduce((sum, l) => sum + l.duration, 0);
                const moduleDone = module.lessons.filter((l) => isLessonDone(l.id)).length;

                return (
                  <div key={module.id}>
                    <button
                      type="button"
                      onClick={() => toggleModule(module.id)}
                      className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-slate-50"
                    >
                      <span
                        className={cn(
                          'grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[12px] font-bold',
                          moduleDone === module.lessons.length
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-navy-50 text-navy-700',
                        )}
                      >
                        {moduleDone === module.lessons.length ? (
                          <Icon name="Check" className="h-4 w-4" strokeWidth={3} />
                        ) : (
                          moduleIndex + 1
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-bold text-navy-900">
                          {module.title}
                        </span>
                        <span className="block truncate text-[12px] text-slate-500">
                          {module.lessons.length} aulas · {formatMinutes(moduleMinutes)}
                          {enrollment && ` · ${moduleDone}/${module.lessons.length} concluídas`}
                        </span>
                      </span>
                      <Icon
                        name={open ? 'ChevronUp' : 'ChevronDown'}
                        className="h-4 w-4 shrink-0 text-slate-400"
                      />
                    </button>

                    {open && (
                      <ul className="animate-fade-in space-y-0.5 bg-slate-50/60 px-5 pb-4 pt-1">
                        <li className="mb-1 px-1 text-[12px] leading-relaxed text-slate-500">
                          {module.description}
                        </li>
                        {module.lessons.map((lesson, lessonIndex) => {
                          const done = isLessonDone(lesson.id);
                          return (
                            <li
                              key={lesson.id}
                              className="flex items-center gap-3 rounded-lg bg-white px-3 py-2.5 ring-1 ring-slate-100"
                            >
                              <button
                                type="button"
                                disabled={!enrollment}
                                onClick={() => {
                                  if (!user) return;
                                  toggleLesson(user.id, course.id, lesson.id);
                                  toast(
                                    done ? 'Aula reaberta' : 'Aula concluída',
                                    lesson.title,
                                    done ? 'info' : 'success',
                                  );
                                }}
                                className={cn(
                                  'grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition',
                                  done
                                    ? 'border-emerald-500 bg-emerald-500 text-white'
                                    : 'border-slate-300 text-transparent hover:border-brand-500',
                                  !enrollment && 'cursor-not-allowed opacity-50',
                                )}
                                title={
                                  enrollment
                                    ? done
                                      ? 'Marcar como não concluída'
                                      : 'Marcar aula como concluída'
                                    : 'Inicie o treinamento para registrar progresso'
                                }
                              >
                                <Icon name="Check" className="h-3 w-3" strokeWidth={3.5} />
                              </button>

                              <span className="grid h-7 w-7 shrink-0 place-items-center rounded bg-slate-100 text-slate-500">
                                <Icon
                                  name={
                                    lesson.type === 'video'
                                      ? 'Play'
                                      : lesson.type === 'quiz'
                                        ? 'ClipboardList'
                                        : 'FileText'
                                  }
                                  className="h-3.5 w-3.5"
                                />
                              </span>

                              <span className="min-w-0 flex-1">
                                <span
                                  className={cn(
                                    'block truncate text-[13px] font-semibold',
                                    done ? 'text-slate-400 line-through' : 'text-navy-900',
                                  )}
                                >
                                  {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                                </span>
                                <span className="block text-[11.5px] text-slate-400">
                                  {lesson.type === 'video'
                                    ? 'Videoaula'
                                    : lesson.type === 'quiz'
                                      ? 'Atividade'
                                      : 'Leitura'}{' '}
                                  · {lesson.duration} min
                                </span>
                              </span>

                              <Link
                                to={`/app/treinamento/${course.id}/player?aula=${lesson.id}`}
                                onClick={() => user && startCourse(user.id, course.id)}
                                className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-brand-50 hover:text-brand-700"
                                title="Assistir aula"
                              >
                                <Icon name="PlayCircle" className="h-4 w-4" />
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* -------------------------- Materiais ----------------------- */}
          <Card>
            <CardHeader
              title="Materiais complementares"
              subtitle="Documentos de apoio disponíveis para download"
              icon="Paperclip"
            />
            <ul className="divide-y divide-slate-100">
              {course.materials.map((material) => (
                <li
                  key={material.id}
                  className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-600">
                    <Icon name={materialIcon[material.type] ?? 'FileText'} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-navy-900">
                      {material.name}
                    </span>
                    <span className="block text-[11.5px] uppercase text-slate-400">
                      {material.type} · {material.size}
                    </span>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    icon="Download"
                    onClick={() => {
                      downloadDemoMaterial(material.name);
                      toast('Download iniciado', material.name);
                    }}
                  >
                    Baixar
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* ------------------------------ Lateral ----------------------- */}
        <div className="space-y-5">
          <Card className="overflow-hidden">
            <div className="flex flex-col items-center border-b border-slate-100 px-5 py-6">
              <RadialProgress value={progress} sublabel="concluído" />
              <div className="mt-4 w-full space-y-3">
                {enrollment ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] text-slate-500">Situação</span>
                      <StatusBadge status={enrollment.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] text-slate-500">Aulas concluídas</span>
                      <span className="text-[12.5px] font-bold tabular-nums text-navy-900">
                        {completedLessons} / {totalLessons}
                      </span>
                    </div>
                    {enrollment.dueDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-[12.5px] text-slate-500">Prazo</span>
                        <span
                          className={cn(
                            'text-[12.5px] font-bold',
                            enrollment.status === 'atrasado'
                              ? 'text-rose-600'
                              : 'text-navy-900',
                          )}
                        >
                          {formatDate(enrollment.dueDate)}
                        </span>
                      </div>
                    )}
                    {enrollment.lastAccessAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-[12.5px] text-slate-500">Último acesso</span>
                        <span className="text-[12.5px] font-medium text-slate-600">
                          {relativeTime(enrollment.lastAccessAt)}
                        </span>
                      </div>
                    )}
                    {enrollment.score !== null && (
                      <div className="flex items-center justify-between">
                        <span className="text-[12.5px] text-slate-500">Nota final</span>
                        <Badge tone="success" icon="Award">
                          {enrollment.score}%
                        </Badge>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-center text-[12.5px] leading-relaxed text-slate-500">
                    Você ainda não iniciou este treinamento. Clique abaixo para começar e
                    registrar seu progresso.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2.5 p-5">
              <Button
                className="w-full justify-center"
                size="lg"
                icon={enrollment?.status === 'concluido' ? 'RotateCcw' : 'Play'}
                onClick={handleStart}
              >
                {!enrollment
                  ? 'Iniciar treinamento'
                  : enrollment.status === 'concluido'
                    ? 'Revisar conteúdo'
                    : 'Continuar treinamento'}
              </Button>

              {course.assessment && (
                <Button
                  variant={allLessonsDone && !approved ? 'secondary' : 'outline'}
                  className="w-full justify-center"
                  icon="ClipboardCheck"
                  disabled={!allLessonsDone && !approved}
                  onClick={() => navigate(`/app/treinamento/${course.id}/avaliacao`)}
                >
                  {approved ? 'Revisar avaliação' : 'Realizar avaliação final'}
                </Button>
              )}

              {course.assessment && !allLessonsDone && !approved && (
                <p className="flex items-start gap-1.5 text-[11.5px] leading-relaxed text-slate-400">
                  <Icon name="Info" className="mt-px h-3.5 w-3.5 shrink-0" />
                  Conclua todas as aulas para liberar a avaliação final. Nota mínima de{' '}
                  {course.assessment.minimumScore}%.
                </p>
              )}

              {enrollment?.status === 'concluido' && (
                <Link
                  to="/app/certificados"
                  className="flex items-center justify-center gap-1.5 pt-1 text-[12.5px] font-semibold text-brand-700 transition hover:text-brand-800"
                >
                  <Icon name="Award" className="h-4 w-4" />
                  Ver certificado emitido
                </Link>
              )}
            </div>
          </Card>

          {/* ------------------------- Instrutor ------------------------ */}
          <Card>
            <CardHeader title="Instrutor responsável" icon="UserCheck" />
            <div className="flex items-center gap-3.5 px-5 py-5">
              <Avatar name={course.instructor} src={course.instructorAvatar} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-[14px] font-bold text-navy-900">
                  {course.instructor}
                </p>
                <p className="text-[12.5px] leading-snug text-slate-500">
                  {course.instructorRole}
                </p>
              </div>
            </div>
          </Card>

          {/* --------------------------- Ficha ------------------------- */}
          <Card>
            <CardHeader title="Informações do treinamento" icon="ClipboardList" />
            <dl className="divide-y divide-slate-100">
              {[
                { label: 'Carga horária', value: formatMinutes(course.durationMinutes) },
                { label: 'Nível', value: <LevelBadge level={course.level} /> },
                { label: 'Categoria', value: course.category },
                { label: 'Departamento', value: department?.name ?? '—' },
                {
                  label: 'Obrigatoriedade',
                  value: course.mandatory ? (
                    <Badge tone="danger">Obrigatório</Badge>
                  ) : (
                    <Badge tone="neutral">Opcional</Badge>
                  ),
                },
                {
                  label: 'Prazo de conclusão',
                  value: course.deadlineDays ? `${course.deadlineDays} dias` : 'Sem prazo',
                },
                {
                  label: 'Avaliação',
                  value: course.assessment
                    ? `${course.assessment.questions.length} questões · mínimo ${course.assessment.minimumScore}%`
                    : 'Sem avaliação',
                },
                { label: 'Publicado em', value: formatDate(course.publishedAt) },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-4 px-5 py-2.5"
                >
                  <dt className="text-[12.5px] text-slate-500">{row.label}</dt>
                  <dd className="text-right text-[12.5px] font-semibold text-navy-900">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
