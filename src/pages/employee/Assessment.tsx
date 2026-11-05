import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardHeader,
  EmptyState,
  Icon,
  ProgressBar,
  RadialProgress,
} from '@/components/ui';
import { useAuthStore } from '@/store/useAuthStore';
import { useDataStore } from '@/store/useDataStore';
import { useCourseProgress } from '@/hooks/useAnalytics';
import { toast } from '@/store/useToastStore';
import { cn, formatDateTime } from '@/utils/format';

type Phase = 'intro' | 'running' | 'result';

export default function AssessmentPage() {
  const { courseId = '' } = useParams();
  const user = useAuthStore((s) => s.user);
  const courses = useDataStore((s) => s.courses);
  const submitAssessment = useDataStore((s) => s.submitAssessment);
  const navigate = useNavigate();

  const course = courses.find((c) => c.id === courseId);
  const enrollment = useCourseProgress(user?.id, courseId);

  const [phase, setPhase] = React.useState<Phase>('intro');
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [result, setResult] = React.useState<{ score: number; passed: boolean } | null>(null);

  if (!course || !course.assessment) {
    return (
      <Card>
        <EmptyState
          icon="ClipboardX"
          title="Avaliação não disponível"
          description="Este treinamento não possui avaliação final cadastrada."
          action={
            <Button icon="ArrowLeft" onClick={() => navigate(`/app/catalogo/${courseId}`)}>
              Voltar ao treinamento
            </Button>
          }
        />
      </Card>
    );
  }

  const assessment = course.assessment;
  const questions = assessment.questions;
  const current = questions[index];
  const attempts = enrollment?.attempts ?? [];
  const attemptsUsed = attempts.length;
  const remaining = Math.max(0, assessment.attemptsAllowed - attemptsUsed);
  const approved = attempts.some((a) => a.passed);
  const answeredCount = Object.keys(answers).length;

  const start = () => {
    setAnswers({});
    setIndex(0);
    setResult(null);
    setPhase('running');
  };

  const finish = () => {
    if (!user) return;
    const outcome = submitAssessment(user.id, course.id, answers);
    setResult(outcome);
    setPhase('result');
    toast(
      outcome.passed ? 'Avaliação aprovada!' : 'Nota mínima não alcançada',
      outcome.passed
        ? `Você obteve ${outcome.score}% de aproveitamento. Certificado emitido.`
        : `Você obteve ${outcome.score}%. A nota mínima é ${assessment.minimumScore}%.`,
      outcome.passed ? 'success' : 'error',
    );
  };

  const breadcrumbs = (
    <Breadcrumbs
      items={[
        { label: 'Início', to: '/app' },
        { label: 'Catálogo', to: '/app/catalogo' },
        { label: course.title, to: `/app/catalogo/${course.id}` },
        { label: 'Avaliação final' },
      ]}
    />
  );

  // ------------------------------- Introdução ---------------------------
  if (phase === 'intro') {
    return (
      <div>
        <div className="mb-4">{breadcrumbs}</div>
        <div className="mx-auto max-w-3xl">
          <Card className="overflow-hidden">
            <div
              className="relative px-6 py-8 text-center"
              style={{
                backgroundImage: `linear-gradient(135deg, ${course.coverFrom}, ${course.coverTo})`,
              }}
            >
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-white/15 text-white backdrop-blur">
                <Icon name="ClipboardCheck" className="h-7 w-7" />
              </span>
              <h1 className="mt-4 text-[24px] font-extrabold tracking-tight text-white">
                Avaliação final
              </h1>
              <p className="mt-1 text-[14px] font-medium text-white/85">{course.title}</p>
            </div>

            <div className="px-6 py-6">
              <div className="grid gap-3 sm:grid-cols-4">
                {[
                  { label: 'Questões', value: questions.length, icon: 'ListChecks' },
                  {
                    label: 'Nota mínima',
                    value: `${assessment.minimumScore}%`,
                    icon: 'Target',
                  },
                  {
                    label: 'Tentativas',
                    value: `${attemptsUsed}/${assessment.attemptsAllowed}`,
                    icon: 'RotateCcw',
                  },
                  {
                    label: 'Tipo',
                    value: 'Múltipla escolha',
                    icon: 'CircleDot',
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5 text-center"
                  >
                    <Icon
                      name={item.icon}
                      className="mx-auto h-4 w-4 text-brand-600"
                    />
                    <p className="mt-2 text-[16px] font-extrabold text-navy-900">
                      {item.value}
                    </p>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg border border-brand-200 bg-brand-50/60 p-4">
                <h3 className="flex items-center gap-2 text-[13px] font-bold text-navy-900">
                  <Icon name="Info" className="h-4 w-4 text-brand-700" />
                  Orientações
                </h3>
                <ul className="mt-2.5 space-y-1.5 text-[12.5px] leading-relaxed text-slate-600">
                  <li className="flex gap-2">
                    <span className="text-brand-600">•</span>
                    Cada questão possui apenas uma alternativa correta.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-600">•</span>
                    É possível navegar entre as questões antes de finalizar.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-600">•</span>
                    Ao atingir a nota mínima, o certificado é emitido automaticamente.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-600">•</span>
                    São permitidas até {assessment.attemptsAllowed} tentativas.
                  </li>
                </ul>
              </div>

              {attempts.length > 0 && (
                <div className="mt-5">
                  <h3 className="mb-2 text-[12.5px] font-bold uppercase tracking-wide text-slate-500">
                    Tentativas anteriores
                  </h3>
                  <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                    {attempts.map((attempt, position) => (
                      <li
                        key={attempt.id}
                        className="flex items-center justify-between gap-3 px-4 py-2.5"
                      >
                        <span className="text-[12.5px] text-slate-600">
                          Tentativa {position + 1} · {formatDateTime(attempt.date)}
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="text-[12.5px] font-bold tabular-nums text-navy-900">
                            {attempt.score}%
                          </span>
                          <Badge tone={attempt.passed ? 'success' : 'danger'}>
                            {attempt.passed ? 'Aprovado' : 'Reprovado'}
                          </Badge>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <Button
                  variant="outline"
                  icon="ArrowLeft"
                  onClick={() => navigate(`/app/catalogo/${course.id}`)}
                >
                  Voltar ao treinamento
                </Button>
                {approved ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="success" icon="CheckCircle2">
                      Treinamento já aprovado
                    </Badge>
                    <Button variant="secondary" icon="RotateCcw" onClick={start}>
                      Refazer para revisão
                    </Button>
                  </div>
                ) : remaining === 0 ? (
                  <Badge tone="danger" icon="AlertTriangle">
                    Tentativas esgotadas — procure o RH
                  </Badge>
                ) : (
                  <Button size="lg" icon="Play" onClick={start}>
                    Iniciar avaliação ({remaining}{' '}
                    {remaining === 1 ? 'tentativa' : 'tentativas'} restantes)
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // --------------------------------- Resultado --------------------------
  if (phase === 'result' && result) {
    const correctCount = questions.filter(
      (q) => answers[q.id] === q.correctOptionId,
    ).length;

    return (
      <div>
        <div className="mb-4">{breadcrumbs}</div>
        <div className="mx-auto max-w-3xl space-y-5">
          <Card className="overflow-hidden">
            <div
              className={cn(
                'px-6 py-8 text-center',
                result.passed ? 'bg-emerald-600' : 'bg-rose-600',
              )}
            >
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/20 text-white">
                <Icon
                  name={result.passed ? 'PartyPopper' : 'AlertTriangle'}
                  className="h-8 w-8"
                />
              </span>
              <h1 className="mt-4 text-[25px] font-extrabold tracking-tight text-white">
                {result.passed ? 'Parabéns, você foi aprovado!' : 'Nota mínima não alcançada'}
              </h1>
              <p className="mt-1.5 text-[14px] text-white/85">
                {result.passed
                  ? 'Seu certificado foi emitido e já está disponível na área de certificados.'
                  : `A nota mínima para aprovação é de ${assessment.minimumScore}%. Revise o conteúdo e tente novamente.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-10 px-6 py-7">
              <RadialProgress
                value={result.score}
                size={128}
                label={`${result.score}%`}
                sublabel="aproveitamento"
              />
              <div className="space-y-3">
                {[
                  {
                    label: 'Respostas corretas',
                    value: `${correctCount} de ${questions.length}`,
                    icon: 'CheckCircle2',
                    tone: 'text-emerald-600',
                  },
                  {
                    label: 'Respostas incorretas',
                    value: `${questions.length - correctCount}`,
                    icon: 'XCircle',
                    tone: 'text-rose-600',
                  },
                  {
                    label: 'Nota mínima exigida',
                    value: `${assessment.minimumScore}%`,
                    icon: 'Target',
                    tone: 'text-brand-600',
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <Icon name={item.icon} className={cn('h-4 w-4', item.tone)} />
                    <span className="text-[13px] text-slate-500">{item.label}</span>
                    <span className="ml-auto text-[13px] font-bold text-navy-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <Button
                variant="outline"
                icon="BookOpen"
                onClick={() => navigate(`/app/catalogo/${course.id}`)}
              >
                Voltar ao treinamento
              </Button>
              {result.passed ? (
                <Button icon="Award" onClick={() => navigate('/app/certificados')}>
                  Ver meu certificado
                </Button>
              ) : (
                remaining > 0 && (
                  <Button icon="RotateCcw" onClick={start}>
                    Nova tentativa
                  </Button>
                )
              )}
            </div>
          </Card>

          {/* --------------------------- Gabarito --------------------- */}
          <Card>
            <CardHeader
              title="Revisão das respostas"
              subtitle="Confira o gabarito comentado de cada questão"
              icon="ListChecks"
            />
            <ul className="divide-y divide-slate-100">
              {questions.map((question, position) => {
                const given = answers[question.id];
                const correct = given === question.correctOptionId;
                return (
                  <li key={question.id} className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white',
                          correct ? 'bg-emerald-500' : 'bg-rose-500',
                        )}
                      >
                        <Icon
                          name={correct ? 'Check' : 'X'}
                          className="h-3.5 w-3.5"
                          strokeWidth={3}
                        />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] font-semibold leading-snug text-navy-900">
                          {position + 1}. {question.statement}
                        </p>
                        <div className="mt-2 space-y-1.5">
                          {question.options.map((option) => {
                            const isCorrect = option.id === question.correctOptionId;
                            const isGiven = option.id === given;
                            return (
                              <p
                                key={option.id}
                                className={cn(
                                  'flex items-start gap-2 rounded-md px-2.5 py-1.5 text-[12.5px] leading-snug',
                                  isCorrect && 'bg-emerald-50 font-semibold text-emerald-800',
                                  isGiven && !isCorrect && 'bg-rose-50 text-rose-800 line-through',
                                  !isCorrect && !isGiven && 'text-slate-500',
                                )}
                              >
                                <Icon
                                  name={
                                    isCorrect
                                      ? 'CheckCircle2'
                                      : isGiven
                                        ? 'XCircle'
                                        : 'Circle'
                                  }
                                  className="mt-px h-3.5 w-3.5 shrink-0"
                                />
                                {option.text}
                              </p>
                            );
                          })}
                        </div>
                        <p className="mt-2.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] leading-relaxed text-slate-600">
                          <strong className="font-bold text-navy-900">Comentário: </strong>
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    );
  }

  // ---------------------------------- Prova -----------------------------
  const progressPercent = Math.round(((index + 1) / questions.length) * 100);

  return (
    <div>
      <div className="mb-4">{breadcrumbs}</div>
      <div className="mx-auto max-w-3xl">
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11.5px] font-bold uppercase tracking-wide text-brand-700">
                  Avaliação final
                </p>
                <p className="truncate text-[14.5px] font-bold text-navy-900">
                  {course.title}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[12.5px] font-bold tabular-nums text-navy-900">
                  Questão {index + 1} de {questions.length}
                </p>
                <p className="text-[11.5px] text-slate-400">
                  {answeredCount} respondida{answeredCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>
            <ProgressBar value={progressPercent} className="mt-3" />
          </div>

          <div className="px-5 py-6 sm:px-7">
            <p className="text-[15.5px] font-semibold leading-relaxed text-navy-900">
              {current.statement}
            </p>

            <div className="mt-5 space-y-2.5">
              {current.options.map((option, optionIndex) => {
                const selected = answers[current.id] === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [current.id]: option.id }))
                    }
                    className={cn(
                      'flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-150',
                      selected
                        ? 'border-brand-500 bg-brand-50/70 ring-2 ring-brand-500/20'
                        : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50',
                    )}
                  >
                    <span
                      className={cn(
                        'grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 text-[11.5px] font-bold transition',
                        selected
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-slate-300 text-slate-500',
                      )}
                    >
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <span
                      className={cn(
                        'text-[13.5px] leading-relaxed',
                        selected ? 'font-semibold text-navy-900' : 'text-slate-600',
                      )}
                    >
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4">
            <div className="flex items-center gap-1.5">
              {questions.map((question, position) => (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setIndex(position)}
                  className={cn(
                    'h-2 w-6 rounded-full transition-all',
                    position === index
                      ? 'bg-brand-600'
                      : answers[question.id]
                        ? 'bg-brand-300'
                        : 'bg-slate-200',
                  )}
                  title={`Questão ${position + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                icon="ChevronLeft"
                disabled={index === 0}
                onClick={() => setIndex((value) => value - 1)}
              >
                Anterior
              </Button>
              {index < questions.length - 1 ? (
                <Button
                  iconRight="ChevronRight"
                  disabled={!answers[current.id]}
                  onClick={() => setIndex((value) => value + 1)}
                >
                  Próxima
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  icon="Send"
                  disabled={answeredCount < questions.length}
                  onClick={finish}
                >
                  Finalizar avaliação
                </Button>
              )}
            </div>
          </div>
        </Card>

        {answeredCount < questions.length && index === questions.length - 1 && (
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[12.5px] font-medium text-amber-700">
            <Icon name="AlertCircle" className="h-3.5 w-3.5" />
            Responda todas as questões para finalizar a avaliação.
          </p>
        )}
      </div>
    </div>
  );
}
