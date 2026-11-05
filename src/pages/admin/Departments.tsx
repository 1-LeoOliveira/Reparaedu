import React from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  CardHeader,
  ConfirmDialog,
  Icon,
  Modal,
  PageHeader,
  ProgressBar,
  StatCard,
} from '@/components/ui';
import { Field, Input, Select, Textarea } from '@/components/ui/form';
import { useDataStore } from '@/store/useDataStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { toast } from '@/store/useToastStore';
import { formatDate, formatHours } from '@/utils/format';
import type { Department } from '@/types';

const colorOptions = [
  { value: '#2563eb', label: 'Azul institucional' },
  { value: '#0d9488', label: 'Verde-petróleo' },
  { value: '#ea580c', label: 'Laranja' },
  { value: '#7c3aed', label: 'Violeta' },
  { value: '#0891b2', label: 'Ciano' },
  { value: '#be123c', label: 'Vinho' },
];

const iconOptions = [
  'Wrench',
  'SprayCan',
  'Briefcase',
  'Building2',
  'Truck',
  'ShieldCheck',
  'Factory',
  'Utensils',
  'Stethoscope',
  'Laptop',
];

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  manager: '',
  color: colorOptions[0].value,
  icon: iconOptions[0],
};

export default function Departments() {
  const departments = useDataStore((s) => s.departments);
  const addDepartment = useDataStore((s) => s.addDepartment);
  const updateDepartment = useDataStore((s) => s.updateDepartment);
  const removeDepartment = useDataStore((s) => s.removeDepartment);
  const analytics = useAnalytics();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Department | null>(null);
  const [form, setForm] = React.useState(emptyForm);
  const [confirm, setConfirm] = React.useState<Department | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (department: Department) => {
    setEditing(department);
    setForm({
      name: department.name,
      slug: department.slug,
      description: department.description,
      manager: department.manager,
      color: department.color,
      icon: department.icon,
    });
    setErrors({});
    setModalOpen(true);
  };

  const save = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = 'Informe o nome do departamento.';
    if (!form.manager.trim()) nextErrors.manager = 'Informe o responsável pela área.';
    if (!form.description.trim()) nextErrors.description = 'Descreva a atuação do setor.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const slug =
      form.slug.trim() ||
      form.name
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');

    if (editing) {
      updateDepartment(editing.id, { ...form, slug });
      toast('Departamento atualizado', form.name);
    } else {
      addDepartment({ ...form, slug });
      toast('Departamento cadastrado', `${form.name} foi adicionado à estrutura.`);
    }
    setModalOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Departamentos"
        description="Estrutura organizacional da empresa, com indicadores de capacitação de cada setor."
        breadcrumbs={[{ label: 'Painel de gestão', to: '/admin' }, { label: 'Departamentos' }]}
        actions={
          <Button icon="Plus" onClick={openCreate}>
            Novo departamento
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Departamentos"
          value={departments.length}
          icon="Building2"
          tone="navy"
        />
        <StatCard
          label="Colaboradores"
          value={analytics.employeeCount}
          icon="Users"
          tone="brand"
        />
        <StatCard
          label="Taxa média de conclusão"
          value={`${
            analytics.byDepartment.length
              ? Math.round(
                  analytics.byDepartment.reduce((sum, item) => sum + item.rate, 0) /
                    analytics.byDepartment.length,
                )
              : 0
          }%`}
          icon="Target"
          tone="success"
        />
        <StatCard
          label="Treinamentos atrasados"
          value={analytics.byStatus.atrasado}
          icon="AlertTriangle"
          tone="danger"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {analytics.byDepartment.map((item) => (
          <Card key={item.department.id} hover className="overflow-hidden">
            <div
              className="relative h-20 px-5"
              style={{
                backgroundImage: `linear-gradient(135deg, ${item.department.color}, ${item.department.color}cc)`,
              }}
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 30%, #fff 1px, transparent 1.2px)',
                  backgroundSize: '20px 20px',
                }}
              />
              <div className="relative flex h-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/20 text-white backdrop-blur">
                    <Icon name={item.department.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-extrabold tracking-tight text-white">
                      {item.department.name}
                    </h3>
                    <p className="text-[11.5px] font-medium text-white/80">
                      {item.employees} colaboradores · {item.courses} treinamentos
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(item.department)}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-white/15 text-white transition hover:bg-white/25"
                    title="Editar departamento"
                  >
                    <Icon name="Pencil" className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirm(item.department)}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-white/15 text-white transition hover:bg-rose-500"
                    title="Excluir departamento"
                  >
                    <Icon name="Trash2" className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5">
              <p className="line-clamp-3 text-[12.5px] leading-relaxed text-slate-500">
                {item.department.description}
              </p>

              <div className="mt-4 flex items-center gap-2.5 rounded-lg bg-slate-50 p-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200">
                  <Icon name="UserCog" className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">
                    Responsável
                  </p>
                  <p className="truncate text-[12.5px] font-semibold text-navy-900">
                    {item.department.manager}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-[12px]">
                  <span className="font-semibold text-slate-600">Taxa de conclusão</span>
                  <span className="font-bold tabular-nums text-navy-900">{item.rate}%</span>
                </div>
                <ProgressBar
                  value={item.rate}
                  size="lg"
                  tone={item.rate >= 70 ? 'success' : item.rate >= 40 ? 'brand' : 'warning'}
                />
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-2.5">
                {[
                  { label: 'Concluídos', value: item.concluido, tone: 'text-emerald-700' },
                  { label: 'Em andamento', value: item.em_andamento, tone: 'text-brand-700' },
                  { label: 'Não iniciados', value: item.nao_iniciado, tone: 'text-slate-600' },
                  { label: 'Atrasados', value: item.atrasado, tone: 'text-rose-600' },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="rounded-lg border border-slate-200 px-3 py-2"
                  >
                    <p className={`text-[16px] font-extrabold tabular-nums ${row.tone}`}>
                      {row.value}
                    </p>
                    <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">
                      {row.label}
                    </p>
                  </div>
                ))}
              </dl>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
                <span className="text-[11.5px] text-slate-400">
                  {formatHours(item.minutes)} de capacitação
                </span>
                <Link
                  to={`/admin/departamentos/${item.department.id}`}
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-700 transition hover:text-brand-800"
                >
                  Ver detalhes
                  <Icon name="ArrowRight" className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ------------------------------ Modal ---------------------------- */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar departamento' : 'Novo departamento'}
        description="Os departamentos organizam colaboradores, treinamentos e indicadores."
        icon="Building2"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button icon="Check" onClick={save}>
              {editing ? 'Salvar alterações' : 'Cadastrar departamento'}
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome do departamento" required error={errors.name}>
            <Input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Ex.: Logística"
            />
          </Field>
          <Field label="Responsável pela área" required error={errors.manager}>
            <Input
              value={form.manager}
              onChange={(event) => setForm({ ...form, manager: event.target.value })}
              placeholder="Nome do gestor"
            />
          </Field>
          <Field label="Descrição" required error={errors.description} className="sm:col-span-2">
            <Textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Atribuições e responsabilidades da equipe…"
            />
          </Field>
          <Field label="Cor de identificação" hint="Usada em gráficos e etiquetas">
            <Select
              value={form.color}
              onChange={(event) => setForm({ ...form, color: event.target.value })}
            >
              {colorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Ícone">
            <Select
              value={form.icon}
              onChange={(event) => setForm({ ...form, icon: event.target.value })}
            >
              {iconOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <p className="mb-2 text-[12.5px] font-semibold text-slate-700">Pré-visualização</p>
            <div
              className="flex items-center gap-3 rounded-xl p-4"
              style={{
                backgroundImage: `linear-gradient(135deg, ${form.color}, ${form.color}cc)`,
              }}
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 text-white">
                <Icon name={form.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-extrabold text-white">
                  {form.name || 'Nome do departamento'}
                </p>
                <p className="truncate text-[11.5px] text-white/80">
                  {form.manager || 'Responsável'}
                </p>
              </div>
            </div>
          </div>
          {editing && (
            <div className="sm:col-span-2">
              <Badge tone="neutral" icon="CalendarDays">
                Criado em {formatDate(editing.createdAt)}
              </Badge>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm) {
            removeDepartment(confirm.id);
            toast('Departamento excluído', confirm.name, 'info');
          }
        }}
        title="Excluir departamento"
        message={`Tem certeza que deseja excluir "${confirm?.name}"? Os colaboradores vinculados permanecerão cadastrados, mas ficarão sem departamento.`}
        confirmLabel="Excluir departamento"
      />
    </div>
  );
}
