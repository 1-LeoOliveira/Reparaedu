import React from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardHeader,
  EmptyState,
  Icon,
  ProgressBar,
} from '@/components/ui';
import { useAuthStore } from '@/store/useAuthStore';
import { useDataStore } from '@/store/useDataStore';
import { useCourseProgress } from '@/hooks/useAnalytics';
import { toast } from '@/store/useToastStore';
import { cn, formatMinutes } from '@/utils/format';
import { downloadDemoMaterial } from './CourseDetail';

export default function CoursePlayer() {
  const { courseId = '' } = useParams();
  const [params, setParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const courses = useDataStore((s) => s.courses);
  const toggleLesson = useDataStore((s) => s.toggleLesson);
  const startCourse = useDataStore((s) => s.startCourse);
  const navigate = useNavigate();

  const course = courses.find((c) => c.id === courseId);
  const enrollment = useCourseProgress(user?.id, courseId);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const flatLessons = React.useMemo(
    () =>
      course
        ? course.modules.flatMap((module, moduleIndex) =>
            module.lessons.map((lesson, lessonIndex) => ({
              ...lesson,
              moduleId: module.id,
              moduleTitle: module.title,
              moduleIndex,
              lessonIndex,
            })),
          )
        : [],
    [course],
  );

  React.useEffect(() => {
    if (user && course) startCourse(user.id, course.id);
  }, [user?.id, course?.id]);

  const requested = params.get('aula');
  const firstPending =
    flatLessons.find(
      (lesson) =>
        !enrollment?.lessonsProgress.find((l) => l.lessonId === lesson.id)?.completed,
    ) ?? flatLessons[0];

  const currentId = requested ?? firstPending?.id ?? '';
  const current = flatLessons.find((lesson) => lesson.id === currentId) ?? flatLessons[0];
  const currentIndex = flatLessons.findIndex((lesson) => lesson.id === current?.id);

  const [expanded, setExpanded] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (current) setExpanded((prev) => Array.from(new Set([...prev, current.moduleId])));
  }, [current?.moduleId]);

  if (!course || !current) {
    return (
      <Card>
        <EmptyState
          icon="FileQuestion"
          title="Conteúdo indisponível"
          description="Não foi possível carregar as aulas deste treinamento."
          action={
            <Button icon="ArrowLeft" onClick={() => navigate('/app/catalogo')}>
              Voltar ao catálogo
            </Button>
          }
        />
      </Card>
    );
  }

  const isDone = (lessonId: string) =>
    enrollment?.lessonsProgress.find((l) => l.lessonId === lessonId)?.completed ?? false;

  const completedCount = enrollment?.lessonsProgress.filter((l) => l.completed).length ?? 0;
  const totalLessons = flatLessons.length;
  const progress = enrollment?.progress ?? 0;
  const currentDone = isDone(current.id);
  const approved = enrollment?.attempts.some((a) => a.passed) ?? false;

  const selectLesson = (lessonId: string) => {
    setParams({ aula: lessonId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goTo = (offset: number) => {
    const next = flatLessons[currentIndex + offset];
    if (next) selectLesson(next.id);
  };

  const markAndAdvance = () => {
    if (!user) return;
    if (!currentDone) {
      toggleLesson(user.id, course.id, current.id);
      toast('Aula concluída', current.title);
    }
    const next = flatLessons[currentIndex + 1];
    if (next) {
      selectLesson(next.id);
    } else if (course.assessment && !approved) {
      toast(
        'Conteúdo finalizado',
        'Você já pode realizar a avaliação final do treinamento.',
        'info',
      );
      navigate(`/app/treinamento/${course.id}/avaliacao`);
    } else {
      toast('Treinamento concluído', 'Todas as aulas foram finalizadas.');
      navigate(`/app/catalogo/${course.id}`);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Breadcrumbs
          items={[
            { label: 'Início', to: '/app' },
            { label: 'Catálogo', to: '/app/catalogo' },
            { label: course.title, to: `/app/catalogo/${course.id}` },
            { label: 'Sala de aula' },
          ]}
        />
        <Link
          to={`/app/catalogo/${course.id}`}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-500 transition hover:text-brand-700"
        >
          <Icon name="ArrowLeft" className="h-3.5 w-3.5" />
          Voltar à página do treinamento
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* ------------------------------- Player ----------------------- */}
        <div className="space-y-5">
          <Card className="overflow-hidden">
            {current.type === 'video' ? (
              <div className="relative aspect-video w-full bg-navy-950">
                <video
                  ref={videoRef}
                  key={current.id}
                  src={current.videoUrl}
                  controls
                  controlsList="nodownload"
                  className="h-full w-full"
                  poster=""
                >
                  Seu navegador não suporta a reprodução de vídeo.
                </video>
                <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/55 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
                  Conteúdo demonstrativo
                </div>
              </div>
            ) : (
              <div
                className="relative flex aspect-video w-full flex-col items-center justify-center gap-3 px-8 text-center"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${course.coverFrom}, ${course.coverTo})`,
                }}
              >
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-white/15 text-white backdrop-blur">
                  <Icon name="FileText" className="h-6 w-6" />
                </span>
                <p className="text-[18px] font-bold text-white">{current.title}</p>
                <p className="max-w-lg text-[13px] leading-relaxed text-white/80">
                  Material de leitura do módulo {current.moduleIndex + 1}. Na versão
                  definitiva, o conteúdo completo em texto, imagens e anexos será exibido
                  nesta área.
                </p>
              </div>
            )}

            <div className="border-t border-slate-100 px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11.5px] font-bold uppercase tracking-wide text-brand-700">
                    Módulo {current.moduleIndex + 1} · {current.moduleTitle}
                  </p>
                  <h1 className="mt-1 text-[19px] font-extrabold tracking-tight text-navy-900">
                    {current.title}
                  </h1>
                  <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-slate-500">
                    {current.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge tone="neutral" icon="Clock">
                      {current.duration} min
                    </Badge>
                    <Badge tone={current.type === 'video' ? 'brand' : 'info'} icon={current.type === 'video' ? 'Play' : 'FileText'}>
                      {current.type === 'video' ? 'Videoaula' : 'Leitura'}
                    </Badge>
                    {currentDone && (
                      <Badge tone="success" icon="CheckCircle2">
                        Aula concluída
                      </Badge>
                    )}
                    <span className="text-[12px] text-slate-400">
                      Aula {currentIndex + 1} de {totalLessons}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon="ChevronLeft"
                    disabled={currentIndex === 0}
                    onClick={() => goTo(-1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant={currentDone ? 'outline' : 'subtle'}
                    size="sm"
                    icon={currentDone ? 'RotateCcw' : 'Check'}
                    onClick={() => {
                      if (!user) return;
                      toggleLesson(user.id, course.id, current.id);
                      toast(
                        currentDone ? 'Aula reaberta' : 'Aula marcada como concluída',
                        current.title,
                        currentDone ? 'info' : 'success',
                      );
                    }}
                  >
                    {currentDone ? 'Desmarcar' : 'Concluir aula'}
                  </Button>
                  <Button size="sm" iconRight="ChevronRight" onClick={markAndAdvance}>
                    {currentIndex === totalLessons - 1 ? 'Finalizar' : 'Próxima aula'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* --------------------------- Materiais ---------------------- */}
          <Card>
            <CardHeader
              title="Materiais da aula"
              subtitle="Apoio para acompanhar o conteúdo"
              icon="Paperclip"
            />
            <ul className="divide-y divide-slate-100">
              {course.materials.map((material) => (
                <li key={material.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-600">
                    <Icon name="FileText" className="h-4 w-4" />
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
                    variant="ghost"
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

        {/* ----------------------------- Conteúdo ----------------------- */}
        <aside className="space-y-5">
          <Card className="overflow-hidden lg:sticky lg:top-20">
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-bold tracking-tight text-navy-900">
                  Conteúdo do treinamento
                </p>
                <span className="text-[12.5px] font-bold tabular-nums text-brand-700">
                  {progress}%
                </span>
              </div>
              <ProgressBar value={progress} className="mt-2.5" />
              <p className="mt-2 text-[12px] text-slate-500">
                {completedCount} de {totalLessons} aulas concluídas ·{' '}
                {formatMinutes(course.durationMinutes)}
              </p>
            </div>

            <div className="scrollbar-thin max-h-[560px] divide-y divide-slate-100 overflow-y-auto">
              {course.modules.map((module, moduleIndex) => {
                const open = expanded.includes(module.id);
                const done = module.lessons.filter((l) => isDone(l.id)).length;
                return (
                  <div key={module.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((prev) =>
                          prev.includes(module.id)
                            ? prev.filter((id) => id !== module.id)
                            : [...prev, module.id],
                        )
                      }
                      className="flex w-full items-center gap-2.5 px-4 py-3 text-left transition hover:bg-slate-50"
                    >
                      <span
                        className={cn(
                          'grid h-6 w-6 shrink-0 place-items-center rounded text-[11px] font-bold',
                          done === module.lessons.length
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600',
                        )}
                      >
                        {done === module.lessons.length ? (
                          <Icon name="Check" className="h-3 w-3" strokeWidth={3.5} />
                        ) : (
                          moduleIndex + 1
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12.5px] font-bold text-navy-900">
                          {module.title}
                        </span>
                        <span className="block text-[11px] text-slate-400">
                          {done}/{module.lessons.length} aulas
                        </span>
                      </span>
                      <Icon
                        name={open ? 'ChevronUp' : 'ChevronDown'}
                        className="h-3.5 w-3.5 shrink-0 text-slate-400"
                      />
                    </button>

                    {open && (
                      <ul className="pb-1">
                        {module.lessons.map((lesson, lessonIndex) => {
                          const active = lesson.id === current.id;
                          const done2 = isDone(lesson.id);
                          return (
                            <li key={lesson.id}>
                              <button
                                type="button"
                                onClick={() => selectLesson(lesson.id)}
                                className={cn(
                                  'flex w-full items-center gap-2.5 border-l-2 py-2 pl-4 pr-3 text-left transition',
                                  active
                                    ? 'border-brand-600 bg-brand-50/60'
                                    : 'border-transparent hover:bg-slate-50',
                                )}
                              >
                                <span
                                  className={cn(
                                    'grid h-5 w-5 shrink-0 place-items-center rounded-full border',
                                    done2
                                      ? 'border-emerald-500 bg-emerald-500 text-white'
                                      : active
                                        ? 'border-brand-600 text-brand-600'
                                        : 'border-slate-300 text-slate-300',
                                  )}
                                >
                                  <Icon
                                    name={done2 ? 'Check' : active ? 'Play' : 'Circle'}
                                    className="h-2.5 w-2.5"
                                    strokeWidth={3}
                                  />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span
                                    className={cn(
                                      'block truncate text-[12.5px]',
                                      active
                                        ? 'font-bold text-brand-800'
                                        : done2
                                          ? 'font-medium text-slate-400'
                                          : 'font-medium text-slate-600',
                                    )}
                                  >
                                    {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                                  </span>
                                  <span className="block text-[11px] text-slate-400">
                                    {lesson.duration} min
                                  </span>
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

            {course.assessment && (
              <div className="border-t border-slate-100 bg-slate-50/70 p-4">
                <Button
                  className="w-full justify-center"
                  variant={completedCount === totalLessons ? 'secondary' : 'outline'}
                  icon="ClipboardCheck"
                  disabled={completedCount !== totalLessons && !approved}
                  onClick={() => navigate(`/app/treinamento/${course.id}/avaliacao`)}
                >
                  {approved ? 'Revisar avaliação' : 'Avaliação final'}
                </Button>
                {completedCount !== totalLessons && !approved && (
                  <p className="mt-2 text-center text-[11.5px] text-slate-400">
                    Conclua todas as aulas para liberar
                  </p>
                )}
              </div>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
