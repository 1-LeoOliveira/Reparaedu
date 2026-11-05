import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardHeader,
  ConfirmDialog,
  EmptyState,
  Icon,
  PageHeader,
  Tabs,
} from '@/components/ui';
import { Field, Input, Select, Textarea, Toggle } from '@/components/ui/form';
import { useDataStore } from '@/store/useDataStore';
import { toast } from '@/store/useToastStore';
import { DEMO_VIDEOS } from '@/data/courseBuilder';
import { cn, formatMinutes } from '@/utils/format';
import type {
  Assessment,
  Course,
  CourseLevel,
  CourseStatus,
  Lesson,
  Material,
  Module,
  QuizQuestion,
} from '@/types';

const gradientPresets = [
  { from: '#1d3155', to: '#2563eb', label: 'Azul institucional' },
  { from: '#13213a', to: '#0d9488', label: 'Verde-petróleo' },
  { from: '#0b1526', to: '#f59e0b', label: 'Âmbar' },
  { from: '#1d3155', to: '#7c3aed', label: 'Violeta' },
  { from: '#13213a', to: '#ea580c', label: 'Laranja' },
  { from: '#0f766e', to: '#2dd4bf', label: 'Turquesa' },
];

const iconPresets = [
  'GraduationCap',
  'HardHat',
  'Wrench',
  'Zap',
  'SprayCan',
  'FlaskConical',
  'ShieldCheck',
  'Scale',
  'Lock',
  'Table2',
  'MessagesSquare',
  'Handshake',
  'Building2',
  'Cog',
  'Users',
];

const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;

function emptyCourse(departmentId: string, category: string): Course {
  return {
    id: uid('crs'),
    title: '',
    slug: '',
    description: '',
    summary: '',
    departmentId,
    category,
    instructor: '',
    instructorRole: '',
    instructorAvatar: 'https://i.pravatar.cc/120?img=36',
    durationMinutes: 0,
    level: 'basico',
    status: 'rascunho',
    mandatory: false,
    deadlineDays: 30,
    cover: 'GraduationCap',
    coverFrom: gradientPresets[0].from,
    coverTo: gradientPresets[0].to,
    objectives: [''],
    syllabus: [''],
    modules: [
      {
        id: uid('mod'),
        title: 'Módulo 1',
        description: '',
        lessons: [
          {
            id: uid('les'),
            title: 'Aula de abertura',
            type: 'video',
            duration: 15,
            description: '',
            videoUrl: DEMO_VIDEOS[0],
          },
        ],
      },
    ],
    materials: [],
    assessment: {
      id: uid('av'),
      title: 'Avaliação final',
      minimumScore: 70,
      attemptsAllowed: 3,
      questions: [],
    },
    rating: 0,
    enrolledCount: 0,
    createdAt: new Date().toISOString(),
    publishedAt: null,
  };
}

export default function CourseEditor() {
  const { courseId } = useParams();
  const courses = useDataStore((s) => s.courses);
  const departments = useDataStore((s) => s.departments);
  const settings = useDataStore((s) => s.settings);
  const addCourse = useDataStore((s) => s.addCourse);
  const updateCourse = useDataStore((s) => s.updateCourse);
  const removeCourse = useDataStore((s) => s.removeCourse);
  const navigate = useNavigate();

  const existing = courseId ? courses.find((c) => c.id === courseId) : undefined;
  const isNew = !existing;

  const [draft, setDraft] = React.useState<Course>(
    () =>
      existing ??
      emptyCourse(departments[0]?.id ?? 'dep-adm', settings.categories[0] ?? 'Geral'),
  );
  const [tab, setTab] = React.useState('informacoes');
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  React.useEffect(() => {
    if (existing) setDraft(existing);
  }, [existing?.id]);

  if (courseId && !existing) {
    return (
      <Card>
        <EmptyState
          icon="FileQuestion"
          title="Treinamento não encontrado"
          description="Este conteúdo não existe mais no catálogo."
          action={
            <Button icon="ArrowLeft" onClick={() => navigate('/admin/treinamentos')}>
              Voltar à listagem
            </Button>
          }
        />
      </Card>
    );
  }

  const totalLessons = draft.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalMinutes = draft.modules.reduce(
    (sum, m) => sum + m.lessons.reduce((acc, l) => acc + l.duration, 0),
    0,
  );

  const set = <K extends keyof Course>(key: K, value: Course[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  // ------------------------------- Módulos ------------------------------
  const addModule = () =>
    setDraft((current) => ({
      ...current,
      modules: [
        ...current.modules,
        {
          id: uid('mod'),
          title: `Módulo ${current.modules.length + 1}`,
          description: '',
          lessons: [],
        },
      ],
    }));

  const updateModule = (moduleId: string, data: Partial<Module>) =>
    setDraft((current) => ({
      ...current,
      modules: current.modules.map((m) => (m.id === moduleId ? { ...m, ...data } : m)),
    }));

  const removeModule = (moduleId: string) =>
    setDraft((current) => ({
      ...current,
      modules: current.modules.filter((m) => m.id !== moduleId),
    }));

  const moveModule = (index: number, offset: number) =>
    setDraft((current) => {
      const next = [...current.modules];
      const target = index + offset;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...current, modules: next };
    });

  const addLesson = (moduleId: string) =>
    setDraft((current) => ({
      ...current,
      modules: current.modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: [
                ...m.lessons,
                {
                  id: uid('les'),
                  title: `Nova aula ${m.lessons.length + 1}`,
                  type: 'video',
                  duration: 12,
                  description: '',
                  videoUrl: DEMO_VIDEOS[m.lessons.length % DEMO_VIDEOS.length],
                },
              ],
            }
          : m,
      ),
    }));

  const updateLesson = (moduleId: string, lessonId: string, data: Partial<Lesson>) =>
    setDraft((current) => ({
      ...current,
      modules: current.modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...data } : l)),
            }
          : m,
      ),
    }));

  const removeLesson = (moduleId: string, lessonId: string) =>
    setDraft((current) => ({
      ...current,
      modules: current.modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
          : m,
      ),
    }));

  // ------------------------------ Materiais -----------------------------
  const addMaterial = () =>
    setDraft((current) => ({
      ...current,
      materials: [
        ...current.materials,
        {
          id: uid('mat'),
          name: 'Novo material.pdf',
          type: 'pdf',
          size: '1,0 MB',
        } as Material,
      ],
    }));

  const updateMaterial = (materialId: string, data: Partial<Material>) =>
    setDraft((current) => ({
      ...current,
      materials: current.materials.map((m) =>
        m.id === materialId ? { ...m, ...data } : m,
      ),
    }));

  const removeMaterial = (materialId: string) =>
    setDraft((current) => ({
      ...current,
      materials: current.materials.filter((m) => m.id !== materialId),
    }));

  // ------------------------------ Avaliação -----------------------------
  const assessment: Assessment =
    draft.assessment ?? {
      id: uid('av'),
      title: 'Avaliação final',
      minimumScore: settings.minimumScore,
      attemptsAllowed: 3,
      questions: [],
    };

  const setAssessment = (data: Partial<Assessment>) =>
    setDraft((current) => ({
      ...current,
      assessment: { ...assessment, ...data },
    }));

  const addQuestion = () => {
    const id = uid('q');
    const question: QuizQuestion = {
      id,
      statement: 'Nova questão',
      options: [
        { id: `${id}-o1`, text: 'Alternativa A' },
        { id: `${id}-o2`, text: 'Alternativa B' },
        { id: `${id}-o3`, text: 'Alternativa C' },
        { id: `${id}-o4`, text: 'Alternativa D' },
      ],
      correctOptionId: `${id}-o1`,
      explanation: '',
    };
    setAssessment({ questions: [...assessment.questions, question] });
  };

  const updateQuestion = (questionId: string, data: Partial<QuizQuestion>) =>
    setAssessment({
      questions: assessment.questions.map((q) =>
        q.id === questionId ? { ...q, ...data } : q,
      ),
    });

  const removeQuestion = (questionId: string) =>
    setAssessment({
      questions: assessment.questions.filter((q) => q.id !== questionId),
    });

  // -------------------------------- Salvar ------------------------------
  const validate = () => {
    const next: Record<string, string> = {};
    if (!draft.title.trim()) next.title = 'Informe o nome do treinamento.';
    if (!draft.summary.trim()) next.summary = 'Informe um resumo curto.';
    if (!draft.description.trim()) next.description = 'Informe a descrição completa.';
    if (!draft.instructor.trim()) next.instructor = 'Informe o instrutor responsável.';
    if (totalLessons === 0) next.modules = 'Cadastre ao menos uma aula.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const persist = (status: CourseStatus) => {
    if (!validate()) {
      setTab('informacoes');
      toast('Revise o formulário', 'Há campos obrigatórios não preenchidos.', 'error');
      return;
    }

    const payload: Course = {
      ...draft,
      status,
      durationMinutes: totalMinutes,
      slug:
        draft.slug ||
        draft.title
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-'),
      objectives: draft.objectives.filter((item) => item.trim()),
      syllabus: draft.syllabus.filter((item) => item.trim()),
      assessment:
        assessment.questions.length > 0 ? { ...assessment } : null,
      publishedAt:
        status === 'publicado'
          ? draft.publishedAt ?? new Date().toISOString()
          : null,
    };

    if (isNew) {
      addCourse(payload);
      toast(
        status === 'publicado' ? 'Treinamento publicado' : 'Rascunho salvo',
        payload.title,
      );
      navigate('/admin/treinamentos');
    } else {
      updateCourse(draft.id, payload);
      toast(
        status === 'publicado' ? 'Treinamento publicado' : 'Alterações salvas',
        payload.title,
      );
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Breadcrumbs
          items={[
            { label: 'Painel de gestão', to: '/admin' },
            { label: 'Treinamentos', to: '/admin/treinamentos' },
            { label: isNew ? 'Novo treinamento' : draft.title || 'Editar treinamento' },
          ]}
        />
      </div>

      <PageHeader
        title={isNew ? 'Novo treinamento' : 'Editar treinamento'}
        description="Cadastre o conteúdo, estruture módulos e aulas, anexe materiais e configure a avaliação final."
        actions={
          <>
            {!isNew && (
              <Button
                variant="outline"
                icon="Trash2"
                onClick={() => setConfirmDelete(true)}
              >
                Excluir
              </Button>
            )}
            <Button variant="outline" icon="Save" onClick={() => persist('rascunho')}>
              Salvar rascunho
            </Button>
            <Button icon="Send" onClick={() => persist('publicado')}>
              Publicar treinamento
            </Button>
          </>
        }
      />

      {/* ------------------------- Resumo da estrutura -------------------- */}
      <Card className="mb-5 overflow-hidden">
        <div
          className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
          style={{
            backgroundImage: `linear-gradient(135deg, ${draft.coverFrom}, ${draft.coverTo})`,
          }}
        >
          <div className="flex min-w-0 items-center gap-3.5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/20 text-white backdrop-blur">
              <Icon name={draft.cover} className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[17px] font-extrabold tracking-tight text-white">
                {draft.title || 'Nome do treinamento'}
              </p>
              <p className="truncate text-[12.5px] text-white/85">
                {draft.summary || 'Resumo curto do conteúdo'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-white/20 px-2 py-1 text-[11.5px] font-bold text-white backdrop-blur">
              {draft.modules.length} módulos
            </span>
            <span className="rounded-md bg-white/20 px-2 py-1 text-[11.5px] font-bold text-white backdrop-blur">
              {totalLessons} aulas
            </span>
            <span className="rounded-md bg-white/20 px-2 py-1 text-[11.5px] font-bold text-white backdrop-blur">
              {formatMinutes(totalMinutes)}
            </span>
            <span className="rounded-md bg-white px-2 py-1 text-[11.5px] font-bold text-navy-900">
              {assessment.questions.length} questões
            </span>
          </div>
        </div>
      </Card>

      <Tabs
        className="mb-5"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'informacoes', label: 'Informações gerais', icon: 'Info' },
          {
            id: 'conteudo',
            label: 'Módulos e aulas',
            icon: 'ListTree',
            count: totalLessons,
          },
          {
            id: 'materiais',
            label: 'Materiais',
            icon: 'Paperclip',
            count: draft.materials.length,
          },
          {
            id: 'avaliacao',
            label: 'Avaliação',
            icon: 'ClipboardCheck',
            count: assessment.questions.length,
          },
          { id: 'publicacao', label: 'Publicação', icon: 'Send' },
        ]}
      />

      {/* --------------------------- Informações ------------------------- */}
      {tab === 'informacoes' && (
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader title="Dados do treinamento" icon="Info" />
            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
              <Field
                label="Nome do treinamento"
                required
                error={errors.title}
                className="sm:col-span-2"
              >
                <Input
                  value={draft.title}
                  onChange={(event) => set('title', event.target.value)}
                  placeholder="Ex.: Segurança no Trabalho"
                />
              </Field>
              <Field
                label="Resumo curto"
                required
                error={errors.summary}
                hint="Aparece nos cartões do catálogo"
                className="sm:col-span-2"
              >
                <Input
                  value={draft.summary}
                  onChange={(event) => set('summary', event.target.value)}
                  placeholder="Uma frase que explica o conteúdo"
                />
              </Field>
              <Field
                label="Descrição completa"
                required
                error={errors.description}
                className="sm:col-span-2"
              >
                <Textarea
                  rows={5}
                  value={draft.description}
                  onChange={(event) => set('description', event.target.value)}
                  placeholder="Detalhe o conteúdo, o público-alvo e a aplicação prática do treinamento…"
                />
              </Field>
              <Field label="Departamento" required>
                <Select
                  value={draft.departmentId}
                  onChange={(event) => set('departmentId', event.target.value)}
                >
                  {departments.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Categoria">
                <Select
                  value={draft.category}
                  onChange={(event) => set('category', event.target.value)}
                >
                  {settings.categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Instrutor responsável" required error={errors.instructor}>
                <Input
                  value={draft.instructor}
                  onChange={(event) => set('instructor', event.target.value)}
                  placeholder="Nome do instrutor"
                />
              </Field>
              <Field label="Cargo do instrutor">
                <Input
                  value={draft.instructorRole}
                  onChange={(event) => set('instructorRole', event.target.value)}
                  placeholder="Ex.: Engenheiro de Segurança do Trabalho"
                />
              </Field>
              <Field label="Nível de dificuldade">
                <Select
                  value={draft.level}
                  onChange={(event) => set('level', event.target.value as CourseLevel)}
                >
                  <option value="basico">Básico</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </Select>
              </Field>
              <Field
                label="Carga horária"
                hint="Calculada automaticamente pela soma das aulas"
              >
                <Input value={formatMinutes(totalMinutes)} disabled />
              </Field>
            </div>
          </Card>

          <div className="space-y-5">
            <Card>
              <CardHeader title="Capa do treinamento" icon="Image" />
              <div className="px-5 py-5">
                <div
                  className="relative mb-4 flex h-28 items-center overflow-hidden rounded-xl px-4"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${draft.coverFrom}, ${draft.coverTo})`,
                  }}
                >
                  <Icon
                    name={draft.cover}
                    className="absolute right-4 h-16 w-16 text-white/25"
                    strokeWidth={1.4}
                  />
                  <p className="relative max-w-[60%] text-[14px] font-bold leading-snug text-white">
                    {draft.title || 'Nome do treinamento'}
                  </p>
                </div>

                <p className="mb-2 text-[12.5px] font-semibold text-slate-700">
                  Paleta da capa
                </p>
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {gradientPresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        set('coverFrom', preset.from);
                        set('coverTo', preset.to);
                      }}
                      title={preset.label}
                      className={cn(
                        'h-10 rounded-lg ring-2 ring-offset-2 transition',
                        draft.coverFrom === preset.from && draft.coverTo === preset.to
                          ? 'ring-brand-600'
                          : 'ring-transparent hover:ring-slate-300',
                      )}
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${preset.from}, ${preset.to})`,
                      }}
                    />
                  ))}
                </div>

                <Field label="Ícone da capa">
                  <Select
                    value={draft.cover}
                    onChange={(event) => set('cover', event.target.value)}
                  >
                    {iconPresets.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            </Card>

            <Card>
              <CardHeader title="Objetivos de aprendizagem" icon="Target" />
              <div className="space-y-2 px-5 py-5">
                {draft.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={objective}
                      onChange={(event) => {
                        const next = [...draft.objectives];
                        next[index] = event.target.value;
                        set('objectives', next);
                      }}
                      placeholder={`Objetivo ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        set(
                          'objectives',
                          draft.objectives.filter((_, i) => i !== index),
                        )
                      }
                      className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Icon name="X" className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <Button
                  variant="subtle"
                  size="sm"
                  icon="Plus"
                  onClick={() => set('objectives', [...draft.objectives, ''])}
                >
                  Adicionar objetivo
                </Button>
              </div>
            </Card>

            <Card>
              <CardHeader title="Conteúdo programático" icon="ListOrdered" />
              <div className="space-y-2 px-5 py-5">
                {draft.syllabus.map((topic, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={topic}
                      onChange={(event) => {
                        const next = [...draft.syllabus];
                        next[index] = event.target.value;
                        set('syllabus', next);
                      }}
                      placeholder={`Tópico ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        set(
                          'syllabus',
                          draft.syllabus.filter((_, i) => i !== index),
                        )
                      }
                      className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Icon name="X" className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <Button
                  variant="subtle"
                  size="sm"
                  icon="Plus"
                  onClick={() => set('syllabus', [...draft.syllabus, ''])}
                >
                  Adicionar tópico
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ----------------------------- Conteúdo -------------------------- */}
      {tab === 'conteudo' && (
        <div className="space-y-4">
          {errors.modules && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-medium text-rose-700">
              <Icon name="AlertCircle" className="h-4 w-4" />
              {errors.modules}
            </div>
          )}

          {draft.modules.map((module, moduleIndex) => (
            <Card key={module.id}>
              <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-3.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy-800 text-[12.5px] font-bold text-white">
                  {moduleIndex + 1}
                </span>
                <Input
                  value={module.title}
                  onChange={(event) => updateModule(module.id, { title: event.target.value })}
                  placeholder="Título do módulo"
                  className="min-w-[200px] max-w-sm flex-1"
                />
                <span className="text-[12px] text-slate-400">
                  {module.lessons.length} aulas ·{' '}
                  {formatMinutes(module.lessons.reduce((sum, l) => sum + l.duration, 0))}
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveModule(moduleIndex, -1)}
                    disabled={moduleIndex === 0}
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-navy-800 disabled:opacity-30"
                    title="Mover para cima"
                  >
                    <Icon name="ChevronUp" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveModule(moduleIndex, 1)}
                    disabled={moduleIndex === draft.modules.length - 1}
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-navy-800 disabled:opacity-30"
                    title="Mover para baixo"
                  >
                    <Icon name="ChevronDown" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeModule(module.id)}
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    title="Excluir módulo"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="px-5 py-4">
                <Field label="Descrição do módulo" className="mb-4">
                  <Input
                    value={module.description}
                    onChange={(event) =>
                      updateModule(module.id, { description: event.target.value })
                    }
                    placeholder="O que será abordado neste módulo"
                  />
                </Field>

                <div className="space-y-2">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id}
                      className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/60 p-2.5"
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded bg-white text-[11px] font-bold text-slate-500 ring-1 ring-slate-200">
                        {moduleIndex + 1}.{lessonIndex + 1}
                      </span>
                      <Input
                        value={lesson.title}
                        onChange={(event) =>
                          updateLesson(module.id, lesson.id, { title: event.target.value })
                        }
                        placeholder="Título da aula"
                        className="min-w-[180px] flex-1 bg-white"
                      />
                      <Select
                        value={lesson.type}
                        onChange={(event) =>
                          updateLesson(module.id, lesson.id, {
                            type: event.target.value as Lesson['type'],
                          })
                        }
                        className="w-auto min-w-[128px] bg-white"
                      >
                        <option value="video">Videoaula</option>
                        <option value="leitura">Leitura</option>
                        <option value="quiz">Atividade</option>
                      </Select>
                      <div className="flex items-center gap-1.5">
                        <Input
                          type="number"
                          min={1}
                          value={lesson.duration}
                          onChange={(event) =>
                            updateLesson(module.id, lesson.id, {
                              duration: Number(event.target.value) || 0,
                            })
                          }
                          className="w-20 bg-white"
                        />
                        <span className="text-[12px] text-slate-500">min</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLesson(module.id, lesson.id)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        title="Excluir aula"
                      >
                        <Icon name="Trash2" className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}

                  <Button
                    variant="subtle"
                    size="sm"
                    icon="Plus"
                    onClick={() => addLesson(module.id)}
                  >
                    Adicionar aula
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          <Button variant="outline" icon="FolderPlus" onClick={addModule}>
            Adicionar módulo
          </Button>
        </div>
      )}

      {/* ----------------------------- Materiais ------------------------- */}
      {tab === 'materiais' && (
        <Card>
          <CardHeader
            title="Materiais complementares"
            subtitle="Documentos disponibilizados para download pelos colaboradores"
            icon="Paperclip"
            action={
              <Button variant="outline" size="sm" icon="Plus" onClick={addMaterial}>
                Anexar material
              </Button>
            }
          />
          {draft.materials.length === 0 ? (
            <EmptyState
              compact
              icon="Paperclip"
              title="Nenhum material anexado"
              description="Anexe apostilas, checklists e apresentações de apoio ao conteúdo."
              action={
                <Button icon="Plus" onClick={addMaterial}>
                  Anexar material
                </Button>
              }
            />
          ) : (
            <div className="space-y-2 px-5 py-5">
              {draft.materials.map((material) => (
                <div
                  key={material.id}
                  className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 p-2.5"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-600">
                    <Icon name="FileText" className="h-4 w-4" />
                  </span>
                  <Input
                    value={material.name}
                    onChange={(event) =>
                      updateMaterial(material.id, { name: event.target.value })
                    }
                    className="min-w-[200px] flex-1"
                    placeholder="Nome do arquivo"
                  />
                  <Select
                    value={material.type}
                    onChange={(event) =>
                      updateMaterial(material.id, {
                        type: event.target.value as Material['type'],
                      })
                    }
                    className="w-auto min-w-[112px]"
                  >
                    <option value="pdf">PDF</option>
                    <option value="xlsx">XLSX</option>
                    <option value="docx">DOCX</option>
                    <option value="link">Link</option>
                  </Select>
                  <Input
                    value={material.size}
                    onChange={(event) =>
                      updateMaterial(material.id, { size: event.target.value })
                    }
                    className="w-28"
                    placeholder="Tamanho"
                  />
                  <button
                    type="button"
                    onClick={() => removeMaterial(material.id)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ----------------------------- Avaliação ------------------------- */}
      {tab === 'avaliacao' && (
        <div className="space-y-5">
          <Card>
            <CardHeader title="Configuração da avaliação" icon="Settings2" />
            <div className="grid gap-4 px-5 py-5 sm:grid-cols-3">
              <Field label="Título da avaliação">
                <Input
                  value={assessment.title}
                  onChange={(event) => setAssessment({ title: event.target.value })}
                />
              </Field>
              <Field label="Nota mínima para aprovação (%)">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={assessment.minimumScore}
                  onChange={(event) =>
                    setAssessment({ minimumScore: Number(event.target.value) || 0 })
                  }
                />
              </Field>
              <Field label="Tentativas permitidas">
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={assessment.attemptsAllowed}
                  onChange={(event) =>
                    setAssessment({ attemptsAllowed: Number(event.target.value) || 1 })
                  }
                />
              </Field>
            </div>
          </Card>

          {assessment.questions.length === 0 ? (
            <Card>
              <EmptyState
                icon="ClipboardList"
                title="Nenhuma questão cadastrada"
                description="Sem questões, o treinamento é concluído apenas com a finalização das aulas."
                action={
                  <Button icon="Plus" onClick={addQuestion}>
                    Adicionar primeira questão
                  </Button>
                }
              />
            </Card>
          ) : (
            <>
              {assessment.questions.map((question, questionIndex) => (
                <Card key={question.id}>
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
                    <p className="text-[13px] font-bold text-navy-900">
                      Questão {questionIndex + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Icon name="Trash2" className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-3 px-5 py-4">
                    <Field label="Enunciado">
                      <Textarea
                        rows={2}
                        value={question.statement}
                        onChange={(event) =>
                          updateQuestion(question.id, { statement: event.target.value })
                        }
                      />
                    </Field>

                    <div>
                      <p className="mb-2 text-[12.5px] font-semibold text-slate-700">
                        Alternativas{' '}
                        <span className="font-normal text-slate-400">
                          (marque a correta)
                        </span>
                      </p>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={option.id} className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuestion(question.id, { correctOptionId: option.id })
                              }
                              className={cn(
                                'grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 text-[11px] font-bold transition',
                                question.correctOptionId === option.id
                                  ? 'border-emerald-500 bg-emerald-500 text-white'
                                  : 'border-slate-300 text-slate-500 hover:border-emerald-400',
                              )}
                              title="Marcar como alternativa correta"
                            >
                              {question.correctOptionId === option.id ? (
                                <Icon name="Check" className="h-3 w-3" strokeWidth={3.5} />
                              ) : (
                                String.fromCharCode(65 + optionIndex)
                              )}
                            </button>
                            <Input
                              value={option.text}
                              onChange={(event) =>
                                updateQuestion(question.id, {
                                  options: question.options.map((o) =>
                                    o.id === option.id
                                      ? { ...o, text: event.target.value }
                                      : o,
                                  ),
                                })
                              }
                              placeholder={`Alternativa ${String.fromCharCode(65 + optionIndex)}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Field label="Comentário do gabarito" hint="Exibido na revisão da prova">
                      <Textarea
                        rows={2}
                        value={question.explanation}
                        onChange={(event) =>
                          updateQuestion(question.id, { explanation: event.target.value })
                        }
                        placeholder="Explique por que a alternativa está correta…"
                      />
                    </Field>
                  </div>
                </Card>
              ))}
              <Button variant="outline" icon="Plus" onClick={addQuestion}>
                Adicionar questão
              </Button>
            </>
          )}
        </div>
      )}

      {/* ---------------------------- Publicação ------------------------- */}
      {tab === 'publicacao' && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader title="Regras de obrigatoriedade" icon="ShieldAlert" />
            <div className="divide-y divide-slate-100 px-5">
              <Toggle
                checked={draft.mandatory}
                onChange={(value) => set('mandatory', value)}
                label="Treinamento obrigatório"
                description="Será atribuído automaticamente aos colaboradores do departamento, com prazo de conclusão."
              />
            </div>
            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
              <Field
                label="Prazo de conclusão (dias)"
                hint="Contado a partir da atribuição"
              >
                <Input
                  type="number"
                  min={0}
                  value={draft.deadlineDays ?? 0}
                  onChange={(event) =>
                    set('deadlineDays', Number(event.target.value) || null)
                  }
                />
              </Field>
              <Field label="Situação atual">
                <Select
                  value={draft.status}
                  onChange={(event) => set('status', event.target.value as CourseStatus)}
                >
                  <option value="rascunho">Rascunho</option>
                  <option value="publicado">Publicado</option>
                  <option value="arquivado">Arquivado</option>
                </Select>
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Resumo antes de publicar" icon="ClipboardCheck" />
            <ul className="divide-y divide-slate-100">
              {[
                { label: 'Nome definido', ok: Boolean(draft.title.trim()) },
                { label: 'Resumo e descrição', ok: Boolean(draft.summary && draft.description) },
                { label: 'Instrutor informado', ok: Boolean(draft.instructor.trim()) },
                { label: 'Pelo menos uma aula', ok: totalLessons > 0 },
                {
                  label: 'Objetivos de aprendizagem',
                  ok: draft.objectives.filter((o) => o.trim()).length > 0,
                },
                {
                  label: 'Avaliação configurada',
                  ok: assessment.questions.length > 0,
                },
                { label: 'Materiais anexados', ok: draft.materials.length > 0 },
              ].map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-3 px-5 py-3"
                >
                  <span className="text-[13px] text-slate-600">{item.label}</span>
                  <Badge tone={item.ok ? 'success' : 'warning'} icon={item.ok ? 'Check' : 'Minus'}>
                    {item.ok ? 'Pronto' : 'Pendente'}
                  </Badge>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4">
              <Button variant="outline" icon="Save" onClick={() => persist('rascunho')}>
                Salvar como rascunho
              </Button>
              <Button icon="Send" onClick={() => persist('publicado')}>
                Publicar agora
              </Button>
            </div>
          </Card>
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          removeCourse(draft.id);
          toast('Treinamento excluído', draft.title, 'info');
          navigate('/admin/treinamentos');
        }}
        title="Excluir treinamento"
        message={`Tem certeza que deseja excluir "${draft.title}"? Matrículas, certificados e vínculos com trilhas também serão removidos.`}
        confirmLabel="Excluir treinamento"
      />
    </div>
  );
}
