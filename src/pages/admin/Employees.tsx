import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Icon,
  Modal,
  PageHeader,
  StatCard,
  TableWrap,
  Td,
  Th,
  Tr,
} from '@/components/ui';
import { Field, Input, SearchInput, Select } from '@/components/ui/form';
import { EmployeeCell, ProgressCell } from '@/components/shared';
import { useDataStore } from '@/store/useDataStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { toast } from '@/store/useToastStore';
import { downloadCsv, employeeStatusLabel, formatDate, formatHours } from '@/utils/format';
import type { Employee, EmployeeStatus } from '@/types';

const statusTone: Record<EmployeeStatus, 'success' | 'info' | 'warning' | 'neutral'> = {
  ativo: 'success',
  ferias: 'info',
  afastado: 'warning',
  inativo: 'neutral',
};

const emptyForm = {
  name: '',
  email: '',
  jobTitle: '',
  departmentId: '',
  admissionDate: new Date().toISOString().slice(0, 10),
  status: 'ativo' as EmployeeStatus,
  phone: '',
  registration: '',
  avatar: '',
};

export default function Employees() {
  const departments = useDataStore((s) => s.departments);
  const addEmployee = useDataStore((s) => s.addEmployee);
  const updateEmployee = useDataStore((s) => s.updateEmployee);
  const removeEmployee = useDataStore((s) => s.removeEmployee);
  const analytics = useAnalytics();
  const navigate = useNavigate();

  const [search, setSearch] = React.useState('');
  const [department, setDepartment] = React.useState('all');
  const [status, setStatus] = React.useState('all');
  const [sort, setSort] = React.useState('progress');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Employee | null>(null);
  const [form, setForm] = React.useState(emptyForm);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [confirm, setConfirm] = React.useState<Employee | null>(null);

  const rows = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    return analytics.ranking
      .filter((row) => {
        if (term && !`${row.employee.name} ${row.employee.email} ${row.employee.jobTitle}`.toLowerCase().includes(term)) {
          return false;
        }
        if (department !== 'all' && row.employee.departmentId !== department) return false;
        if (status !== 'all' && row.employee.status !== status) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === 'name') return a.employee.name.localeCompare(b.employee.name);
        if (sort === 'late') return b.atrasado - a.atrasado;
        if (sort === 'admission')
          return (
            new Date(b.employee.admissionDate).getTime() -
            new Date(a.employee.admissionDate).getTime()
          );
        return b.progress - a.progress;
      });
  }, [analytics.ranking, search, department, status, sort]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, departmentId: departments[0]?.id ?? '' });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (employee: Employee) => {
    setEditing(employee);
    setForm({
      name: employee.name,
      email: employee.email,
      jobTitle: employee.jobTitle,
      departmentId: employee.departmentId,
      admissionDate: employee.admissionDate.slice(0, 10),
      status: employee.status,
      phone: employee.phone,
      registration: employee.registration,
      avatar: employee.avatar,
    });
    setErrors({});
    setModalOpen(true);
  };

  const save = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = 'Informe o nome completo.';
    if (!form.email.trim()) nextErrors.email = 'Informe o e-mail corporativo.';
    if (!form.jobTitle.trim()) nextErrors.jobTitle = 'Informe o cargo.';
    if (!form.departmentId) nextErrors.departmentId = 'Selecione o departamento.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      ...form,
      avatar:
        form.avatar ||
        `https://i.pravatar.cc/160?u=${encodeURIComponent(form.email || form.name)}`,
      registration:
        form.registration || `MAT-${Math.floor(Math.random() * 89999 + 10000)}`,
    };

    if (editing) {
      updateEmployee(editing.id, payload);
      toast('Colaborador atualizado', form.name);
    } else {
      addEmployee(payload);
      toast(
        'Colaborador cadastrado',
        'Os treinamentos obrigatórios do setor foram atribuídos automaticamente.',
      );
    }
    setModalOpen(false);
  };

  const exportCsv = () => {
    const header = [
      'Nome',
      'E-mail',
      'Cargo',
      'Departamento',
      'Situação',
      'Admissão',
      'Treinamentos',
      'Concluídos',
      'Atrasados',
      'Progresso (%)',
      'Horas',
      'Certificados',
    ];
    const body = rows.map((row) => [
      row.employee.name,
      row.employee.email,
      row.employee.jobTitle,
      departments.find((d) => d.id === row.employee.departmentId)?.name ?? '',
      employeeStatusLabel[row.employee.status],
      formatDate(row.employee.admissionDate),
      row.total,
      row.concluido,
      row.atrasado,
      row.progress,
      Math.round(row.minutes / 60),
      row.certificates,
    ]);
    downloadCsv('colaboradores-universidade-corporativa.csv', [header, ...body]);
    toast('Exportação concluída', `${rows.length} registros exportados em CSV.`);
  };

  return (
    <div>
      <PageHeader
        title="Colaboradores"
        description="Cadastro de colaboradores, com acompanhamento individual de progresso, pendências e certificados."
        breadcrumbs={[{ label: 'Painel de gestão', to: '/admin' }, { label: 'Colaboradores' }]}
        actions={
          <>
            <Button variant="outline" icon="Download" onClick={exportCsv}>
              Exportar CSV
            </Button>
            <Button icon="UserPlus" onClick={openCreate}>
              Novo colaborador
            </Button>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total de colaboradores"
          value={analytics.employeeCount}
          icon="Users"
          tone="navy"
          hint={`${departments.length} departamentos`}
        />
        <StatCard
          label="Progresso médio"
          value={`${
            analytics.ranking.length
              ? Math.round(
                  analytics.ranking.reduce((sum, row) => sum + row.progress, 0) /
                    analytics.ranking.length,
                )
              : 0
          }%`}
          icon="Target"
          tone="brand"
          hint="Média de evolução nos treinamentos"
        />
        <StatCard
          label="Com pendências em atraso"
          value={analytics.lateEmployees}
          icon="AlertTriangle"
          tone="danger"
          hint="Requerem acompanhamento da liderança"
        />
        <StatCard
          label="Certificados emitidos"
          value={analytics.certificateCount}
          icon="Award"
          tone="success"
          hint="Total na base de colaboradores"
        />
      </div>

      <Card className="mb-5 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nome, e-mail ou cargo…"
            className="min-w-[230px] flex-1"
          />
          <Select
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            className="w-auto min-w-[172px]"
          >
            <option value="all">Todos os departamentos</option>
            {departments.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          <Select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-auto min-w-[150px]"
          >
            <option value="all">Todas as situações</option>
            <option value="ativo">Ativo</option>
            <option value="ferias">Férias</option>
            <option value="afastado">Afastado</option>
            <option value="inativo">Inativo</option>
          </Select>
          <Select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="w-auto min-w-[172px]"
          >
            <option value="progress">Maior progresso</option>
            <option value="late">Mais atrasos</option>
            <option value="name">Nome (A-Z)</option>
            <option value="admission">Admissão recente</option>
          </Select>
        </div>
      </Card>

      <Card>
        {rows.length === 0 ? (
          <EmptyState
            icon="UserX"
            title="Nenhum colaborador encontrado"
            description="Ajuste os filtros ou cadastre um novo colaborador na plataforma."
            action={
              <Button icon="UserPlus" onClick={openCreate}>
                Cadastrar colaborador
              </Button>
            }
          />
        ) : (
          <TableWrap minWidth={920}>
            <thead>
              <tr>
                <Th>Colaborador</Th>
                <Th>Departamento</Th>
                <Th>Situação</Th>
                <Th align="center">Admissão</Th>
                <Th align="center">Treinamentos</Th>
                <Th>Conclusão</Th>
                <Th align="center">Horas</Th>
                <Th align="right">Ações</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const dept = departments.find((d) => d.id === row.employee.departmentId);
                return (
                  <Tr key={row.employee.id}>
                    <Td>
                      <EmployeeCell
                        employee={row.employee}
                        to={`/admin/colaboradores/${row.employee.id}`}
                        subtitle={row.employee.email}
                      />
                    </Td>
                    <Td>
                      {dept ? (
                        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-slate-600">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ background: dept.color }}
                          />
                          {dept.name}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </Td>
                    <Td>
                      <Badge tone={statusTone[row.employee.status]}>
                        {employeeStatusLabel[row.employee.status]}
                      </Badge>
                    </Td>
                    <Td align="center">
                      <span className="text-[12.5px] text-slate-600">
                        {formatDate(row.employee.admissionDate)}
                      </span>
                    </Td>
                    <Td align="center">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="font-semibold text-navy-900">
                          {row.concluido}/{row.total}
                        </span>
                        {row.atrasado > 0 && (
                          <span
                            className="inline-flex items-center gap-0.5 rounded bg-rose-50 px-1.5 py-0.5 text-[10.5px] font-bold text-rose-700"
                            title={`${row.atrasado} treinamentos em atraso`}
                          >
                            <Icon name="AlertTriangle" className="h-2.5 w-2.5" />
                            {row.atrasado}
                          </span>
                        )}
                      </span>
                    </Td>
                    <Td>
                      <ProgressCell value={row.progress} />
                    </Td>
                    <Td align="center">
                      <span className="text-[12.5px] font-medium text-slate-600">
                        {formatHours(row.minutes)}
                      </span>
                    </Td>
                    <Td align="right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/colaboradores/${row.employee.id}`)}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-brand-50 hover:text-brand-700"
                          title="Ver histórico"
                        >
                          <Icon name="Eye" className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(row.employee)}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-navy-800"
                          title="Editar colaborador"
                        >
                          <Icon name="Pencil" className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirm(row.employee)}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                          title="Excluir colaborador"
                        >
                          <Icon name="Trash2" className="h-4 w-4" />
                        </button>
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </TableWrap>
        )}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <p className="text-[12.5px] text-slate-500">
            Exibindo <strong className="font-semibold text-navy-900">{rows.length}</strong> de{' '}
            {analytics.employeeCount} colaboradores
          </p>
        </div>
      </Card>

      {/* ------------------------------ Modal ---------------------------- */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar colaborador' : 'Novo colaborador'}
        description={
          editing
            ? 'Atualize os dados cadastrais do colaborador.'
            : 'Ao cadastrar, os treinamentos obrigatórios do setor são atribuídos automaticamente.'
        }
        icon="UserPlus"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button icon="Check" onClick={save}>
              {editing ? 'Salvar alterações' : 'Cadastrar colaborador'}
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome completo" required error={errors.name} className="sm:col-span-2">
            <Input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Ex.: Maria Aparecida Silva"
            />
          </Field>
          <Field label="E-mail corporativo" required error={errors.email}>
            <Input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="nome.sobrenome@reparaedu.com.br"
            />
          </Field>
          <Field label="Telefone">
            <Input
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              placeholder="(11) 90000-0000"
            />
          </Field>
          <Field label="Cargo" required error={errors.jobTitle}>
            <Input
              value={form.jobTitle}
              onChange={(event) => setForm({ ...form, jobTitle: event.target.value })}
              placeholder="Ex.: Auxiliar de Limpeza"
            />
          </Field>
          <Field label="Departamento" required error={errors.departmentId}>
            <Select
              value={form.departmentId}
              onChange={(event) => setForm({ ...form, departmentId: event.target.value })}
            >
              <option value="">Selecione…</option>
              {departments.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Data de admissão">
            <Input
              type="date"
              value={form.admissionDate}
              onChange={(event) => setForm({ ...form, admissionDate: event.target.value })}
            />
          </Field>
          <Field label="Situação">
            <Select
              value={form.status}
              onChange={(event) =>
                setForm({ ...form, status: event.target.value as EmployeeStatus })
              }
            >
              <option value="ativo">Ativo</option>
              <option value="ferias">Férias</option>
              <option value="afastado">Afastado</option>
              <option value="inativo">Inativo</option>
            </Select>
          </Field>
          <Field label="Matrícula" hint="Deixe em branco para gerar automaticamente">
            <Input
              value={form.registration}
              onChange={(event) => setForm({ ...form, registration: event.target.value })}
              placeholder="MAT-00000"
            />
          </Field>
          <Field
            label="URL da fotografia"
            hint="Opcional — será gerado um avatar caso não informado"
            className="sm:col-span-2"
          >
            <Input
              value={form.avatar}
              onChange={(event) => setForm({ ...form, avatar: event.target.value })}
              placeholder="https://…"
            />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm) {
            removeEmployee(confirm.id);
            toast('Colaborador removido', confirm.name, 'info');
          }
        }}
        title="Excluir colaborador"
        message={`Tem certeza que deseja excluir "${confirm?.name}"? Todo o histórico de treinamentos e certificados será removido do protótipo.`}
        confirmLabel="Excluir colaborador"
      />
    </div>
  );
}
