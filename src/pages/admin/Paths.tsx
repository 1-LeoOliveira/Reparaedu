import React from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Icon,
  Modal,
  PageHeader,
  ProgressBar,
  StatCard,
} from '@/components/ui';
import { Field, Input, Select, Textarea, Toggle } from '@/components/ui/form';
import { useDataStore } from '@/store/useDataStore';
import { usePathsProgress } from '@/hooks/useAnalytics';
import { toast } from '@/store/useToastStore';
import { cn, formatMinutes } from '@/utils/format';
import type { LearningPath } from '@/types';

const gradients = [
  { from: '#1d3155', to: '#7c3aed' },
  { from: '#0b1526', to: '#f59e0b' },
  { from: '#13213a', to: '#22c55e' },
  { from: '#0f766e', to: '#2dd4bf' },
  { from: '#13213a', to: '#1d4ed8' },
  { from: '#13213a', to: '#ea580c' },
];

const icons = ['Rocket', 'HardHat', 'Briefcase', 'SprayCan', 'Wrench', 'Route', 'Target', 'Users'];

const emptyForm = {
  title: '',
  description: '',
  departmentId: '',
  audience: '',
  mandatory: false,
  deadlineDays: 60,
  courseIds: [] as string[],
  icon: icons[0],
  coverFrom: gradients[0].from,
  coverTo: gradients[0].to,
};

export default function AdminPaths() {
  const courses = useDataStore((s) => s.courses);
  const departments = useDataStore((s) => s.departments);
  const employees = useDataStore((s) => s.employees);
  const addPath = useDataStore((s) => s.addPath);
  const updatePath = useDataStore((s) => s.updatePath);
  const removePath = useDataStore((s) => s.removePath);
  const paths = usePathsProgress();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<LearningPath | null>(null);
  const [form, setForm] = React.useState(emptyForm);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [confirm, setConfirm] = React.useState<LearningPath | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (path: LearningPath) => {
    setEditing(path);
    setForm({
      title: path.title,
      description: path.description,
      departmentId: path.departmentId ?? '',
      audience: path.audience,
      mandatory: path.mandatory,
      deadlineDays: path.deadlineDays,
      courseIds: [...path.courseIds],
      icon: path.icon,
      coverFrom: path.coverFrom,
      coverTo: path.coverTo,
    });
    setErrors({});
    setModalOpen(true);
  };

  const save = () => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = 'Informe o nome da trilha.';
    if (!form.description.trim()) next.description = 'Descreva o objetivo da trilha.';
    if (form.courseIds.length === 0) next.courseIds = 'Vincule ao menos um treinamento.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const payload = {
      title: form.title,
      description: form.description,
      departmentId: form.departmentId || null,
      audience: form.audience || 'Todos os colaboradores',
      mandatory: form.mandatory,
      deadlineDays: form.deadlineDays,
      courseIds: form.courseIds,
      cover: form.icon,
      coverFrom: form.coverFrom,
      coverTo: form.coverTo,
      icon: form.icon,
    };

    if (editing) {
      updatePath(editing.id, payload);
      toast('Trilha atualizada', form.title);
    } else {
      addPath(payload);
      toast('Trilha criada', `${form.title} está disponível aos colaboradores.`);
    }
    setModalOpen(false);
  };

  const toggleCourse = (courseId: string) =>
    setForm((current) => ({
      ...current,
      courseIds: current.courseIds.includes(courseId)
        ? current.courseIds.filter((id) => id !== courseId)
        : [...current.courseIds, courseId],
    }));

  const moveCourse = (index: number, offset: number) =>
    setForm((current) => {
      const next = [...current.courseIds];
      const target = index + offset;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...current, courseIds: next };
    });

  const audienceSize = (path: LearningPath) =>
    path.departmentId
      ? employees.filter((e) => e.departmentId === path.departmentId).length
      : employees.length;

  return (
    <div>
      <PageHeader
        title="Trilhas de aprendizagem"
        description="Jornadas que agrupam treinamentos em uma sequência estruturada de desenvolvimento por público-alvo."
        breadcrumbs={[{ label: 'Painel de gestão', to: '/admin' }, { label: 'Trilhas' }]}
        actions={
          <Button icon="Plus" onClick={openCreate}>
            Nova trilha
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Trilhas cadastradas" value={paths.length} icon="Route" tone="navy" />
        <StatCard
          label="Trilhas obrigatórias"
          value={paths.filter((p) => p.path.mandatory).length}
          icon="ShieldAlert"
          tone="danger"
        />
        <StatCard
          label="Treinamentos vinculados"
          value={paths.reduce((sum, p) => sum + p.courses.length, 0)}
          icon="GraduationCap"
          tone="brand"
        />
        <StatCard
          label="Carga horária total"
          value={formatMinutes(paths.reduce((sum, p) => sum + p.minutes, 0))}
          icon="Clock"
          tone="success"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {paths.map((item) => (
          <Card key={item.path.id} hover className="overflow-hidden">
            <div
              className="relative flex h-24 items-center px-5"
              style={{
                backgroundImage: `linear-gradient(135deg, ${item.path.coverFrom}, ${item.path.coverTo})`,
              }}
            >
              <Icon
                name={item.path.icon}
                className="absolute right-5 h-16 w-16 text-white/20"
                strokeWidth={1.4}
              />
              <div className="relative flex min-w-0 items-center gap-3.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/20 text-white backdrop-blur">
                  <Icon name={item.path.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-[16px] font-extrabold tracking-tight text-white">
                      {item.path.title}
                    </h3>
                    {item.path.mandatory && (
                      <span className="shrink-0 rounded bg-white px-1.5 py-0.5 text-[10px] font-bold uppercase text-rose-700">
                        Obrigatória
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[11.5px] text-white/85">
                    {item.courses.length} treinamentos · {formatMinutes(item.minutes)} ·{' '}
                    {audienceSize(item.path)} colaboradores
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <p className="line-clamp-2 text-[12.5px] leading-relaxed text-slate-500">
                {item.path.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge tone="navy" icon="Users">
                  {item.path.departmentId
                    ? departments.find((d) => d.id === item.path.departmentId)?.name
                    : 'Toda a empresa'}
                </Badge>
                <Badge tone="neutral" icon="CalendarClock">
                  {item.path.deadlineDays} dias
                </Badge>
              </div>

              <ol className="mt-4 space-y-1.5">
                {item.courses.slice(0, 4).map((course, index) => (
                  <li key={course.id} className="flex items-center gap-2.5">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-slate-100 text-[10.5px] font-bold text-slate-500">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[12.5px] text-slate-600">
                      {course.title}
                    </span>
                    <span className="shrink-0 text-[11.5px] text-slate-400">
                      {formatMinutes(course.durationMinutes)}
                    </span>
                  </li>
                ))}
                {item.courses.length > 4 && (
                  <li className="pl-7 text-[11.5px] font-medium text-slate-400">
                    + {item.courses.length - 4} treinamentos
                  </li>
                )}
              </ol>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <Link
                  to={`/admin/trilhas/${item.path.id}`}
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-700 transition hover:text-brand-800"
                >
                  Acompanhar colaboradores
                  <Icon name="ArrowRight" className="h-3.5 w-3.5" />
                </Link>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(item.path)}
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-navy-800"
                    title="Editar trilha"
                  >
                    <Icon name="Pencil" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirm(item.path)}
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    title="Excluir trilha"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ------------------------------- Modal --------------------------- */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar trilha' : 'Nova trilha de aprendizagem'}
        description="Defina o público-alvo, a sequência dos treinamentos e as regras de obrigatoriedade."
        icon="Route"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button icon="Check" onClick={save}>
              {editing ? 'Salvar alterações' : 'Criar trilha'}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome da trilha" required error={errors.title} className="sm:col-span-2">
              <Input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Ex.: Trilha de Integração de Novos Colaboradores"
              />
            </Field>
            <Field
              label="Descrição"
              required
              error={errors.description}
              className="sm:col-span-2"
            >
              <Textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Objetivo da jornada e resultado esperado…"
              />
            </Field>
            <Field label="Departamento" hint="Deixe em branco para aplicar a toda a empresa">
              <Select
                value={form.departmentId}
                onChange={(event) => setForm({ ...form, departmentId: event.target.value })}
              >
                <option value="">Toda a empresa</option>
                {departments.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Público-alvo">
              <Input
                value={form.audience}
                onChange={(event) => setForm({ ...form, audience: event.target.value })}
                placeholder="Ex.: Equipes operacionais"
              />
            </Field>
            <Field label="Prazo sugerido (dias)">
              <Input
                type="number"
                min={1}
                value={form.deadlineDays}
                onChange={(event) =>
                  setForm({ ...form, deadlineDays: Number(event.target.value) || 30 })
                }
              />
            </Field>
            <Field label="Ícone">
              <Select
                value={form.icon}
                onChange={(event) => setForm({ ...form, icon: event.target.value })}
              >
                {icons.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div>
            <p className="mb-2 text-[12.5px] font-semibold text-slate-700">Identidade visual</p>
            <div className="grid grid-cols-6 gap-2">
              {gradients.map((gradient) => (
                <button
                  key={`${gradient.from}${gradient.to}`}
                  type="button"
                  onClick={() =>
                    setForm({ ...form, coverFrom: gradient.from, coverTo: gradient.to })
                  }
                  className={cn(
                    'h-9 rounded-lg ring-2 ring-offset-2 transition',
                    form.coverFrom === gradient.from && form.coverTo === gradient.to
                      ? 'ring-brand-600'
                      : 'ring-transparent hover:ring-slate-300',
                  )}
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200">
            <Toggle
              checked={form.mandatory}
              onChange={(value) => setForm({ ...form, mandatory: value })}
              label="Trilha obrigatória"
              description="Os colaboradores do público-alvo serão cobrados dentro do prazo definido."
            />
          </div>

          {/* ---------------------- Sequência de treinamentos ----------- */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[12.5px] font-semibold text-slate-700">
                Treinamentos da trilha{' '}
                <span className="font-normal text-slate-400">
                  ({form.courseIds.length} selecionados)
                </span>
              </p>
              {errors.courseIds && (
                <span className="text-[11.5px] font-medium text-rose-600">
                  {errors.courseIds}
                </span>
              )}
            </div>

            {form.courseIds.length > 0 && (
              <ol className="mb-3 space-y-1.5 rounded-xl border border-brand-200 bg-brand-50/40 p-3">
                {form.courseIds.map((courseId, index) => {
                  const course = courses.find((c) => c.id === courseId);
                  if (!course) return null;
                  return (
                    <li key={courseId} className="flex items-center gap-2">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-brand-600 text-[11px] font-bold text-white">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-navy-900">
                        {course.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => moveCourse(index, -1)}
                        disabled={index === 0}
                        className="rounded p-1 text-slate-400 transition hover:bg-white hover:text-navy-800 disabled:opacity-30"
                      >
                        <Icon name="ChevronUp" className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCourse(index, 1)}
                        disabled={index === form.courseIds.length - 1}
                        className="rounded p-1 text-slate-400 transition hover:bg-white hover:text-navy-800 disabled:opacity-30"
                      >
                        <Icon name="ChevronDown" className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCourse(courseId)}
                        className="rounded p-1 text-slate-400 transition hover:bg-white hover:text-rose-600"
                      >
                        <Icon name="X" className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}

            <div className="scrollbar-thin max-h-60 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
              {courses
                .filter((c) => c.status === 'publicado')
                .map((course) => {
                  const selected = form.courseIds.includes(course.id);
                  return (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => toggleCourse(course.id)}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition',
                        selected ? 'bg-brand-50' : 'hover:bg-slate-50',
                      )}
                    >
                      <span
                        className={cn(
                          'grid h-5 w-5 shrink-0 place-items-center rounded border-2 transition',
                          selected
                            ? 'border-brand-600 bg-brand-600 text-white'
                            : 'border-slate-300 text-transparent',
                        )}
                      >
                        <Icon name="Check" className="h-3 w-3" strokeWidth={3.5} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12.5px] font-semibold text-navy-900">
                          {course.title}
                        </span>
                        <span className="block text-[11px] text-slate-400">
                          {departments.find((d) => d.id === course.departmentId)?.name} ·{' '}
                          {formatMinutes(course.durationMinutes)}
                        </span>
                      </span>
                      {course.mandatory && <Badge tone="danger">Obrig.</Badge>}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm) {
            removePath(confirm.id);
            toast('Trilha excluída', confirm.title, 'info');
          }
        }}
        title="Excluir trilha"
        message={`Tem certeza que deseja excluir "${confirm?.title}"? Os treinamentos permanecem no catálogo, apenas o agrupamento será removido.`}
        confirmLabel="Excluir trilha"
      />
    </div>
  );
}
