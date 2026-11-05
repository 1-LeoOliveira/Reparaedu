import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Icon,
  PageHeader,
  ProgressBar,
  StatCard,
  TableWrap,
  Tabs,
  Td,
  Th,
  Tr,
} from '@/components/ui';
import { SearchInput, Select } from '@/components/ui/form';
import { CourseStatusBadge, LevelBadge } from '@/components/shared';
import { useDataStore } from '@/store/useDataStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { toast } from '@/store/useToastStore';
import { downloadCsv, formatDate, formatMinutes } from '@/utils/format';
import type { Course } from '@/types';

export default function AdminCourses() {
  const courses = useDataStore((s) => s.courses);
  const departments = useDataStore((s) => s.departments);
  const removeCourse = useDataStore((s) => s.removeCourse);
  const setCourseStatus = useDataStore((s) => s.setCourseStatus);
  const analytics = useAnalytics();
  const navigate = useNavigate();

  const [tab, setTab] = React.useState('todos');
  const [search, setSearch] = React.useState('');
  const [department, setDepartment] = React.useState('all');
  const [view, setView] = React.useState<'tabela' | 'cards'>('tabela');
  const [confirm, setConfirm] = React.useState<Course | null>(null);

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    return courses
      .filter((course) => {
        if (term && !`${course.title} ${course.instructor} ${course.category}`.toLowerCase().includes(term)) {
          return false;
        }
        if (department !== 'all' && course.departmentId !== department) return false;
        if (tab === 'publicados' && course.status !== 'publicado') return false;
        if (tab === 'rascunhos' && course.status !== 'rascunho') return false;
        if (tab === 'obrigatorios' && !course.mandatory) return false;
        return true;
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [courses, search, department, tab]);

  const statsOf = (courseId: string) =>
    analytics.courseStats.find((item) => item.course.id === courseId);

  const exportCsv = () => {
    const header = [
      'Treinamento',
      'Departamento',
      'Categoria',
      'Instrutor',
      'Nível',
      'Carga horária (min)',
      'Módulos',
      'Aulas',
      'Obrigatório',
      'Situação',
      'Inscritos',
      'Concluídos',
      'Taxa de conclusão (%)',
    ];
    const body = filtered.map((course) => {
      const stats = statsOf(course.id);
      return [
        course.title,
        departments.find((d) => d.id === course.departmentId)?.name ?? '',
        course.category,
        course.instructor,
        course.level,
        course.durationMinutes,
        course.modules.length,
        course.modules.reduce((sum, m) => sum + m.lessons.length, 0),
        course.mandatory ? 'Sim' : 'Não',
        course.status,
        stats?.enrolled ?? 0,
        stats?.concluido ?? 0,
        stats?.rate ?? 0,
      ];
    });
    downloadCsv('treinamentos-universidade-corporativa.csv', [header, ...body]);
    toast('Exportação concluída', `${filtered.length} treinamentos exportados.`);
  };

  const totalMinutes = courses
    .filter((c) => c.status === 'publicado')
    .reduce((sum, c) => sum + c.durationMinutes, 0);

  return (
    <div>
      <PageHeader
        title="Treinamentos"
        description="Gestão completa do catálogo: conteúdo, módulos, aulas, materiais, avaliações e publicação."
        breadcrumbs={[{ label: 'Painel de gestão', to: '/admin' }, { label: 'Treinamentos' }]}
        actions={
          <>
            <Button variant="outline" icon="Download" onClick={exportCsv}>
              Exportar CSV
            </Button>
            <Button icon="Plus" onClick={() => navigate('/admin/treinamentos/novo')}>
              Novo treinamento
            </Button>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Treinamentos publicados"
          value={analytics.courseCount}
          icon="GraduationCap"
          tone="brand"
          hint={`${analytics.draftCount} em rascunho`}
        />
        <StatCard
          label="Carga horária do catálogo"
          value={formatMinutes(totalMinutes)}
          icon="Clock"
          tone="navy"
          hint="Somatório dos conteúdos publicados"
        />
        <StatCard
          label="Obrigatórios"
          value={courses.filter((c) => c.mandatory).length}
          icon="ShieldAlert"
          tone="danger"
          hint="Com prazo de conclusão definido"
        />
        <StatCard
          label="Taxa de aprovação"
          value={`${analytics.approvalRate}%`}
          icon="ClipboardCheck"
          tone="success"
          hint="Aprovações nas avaliações finais"
        />
      </div>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <Tabs
          value={tab}
          onChange={setTab}
          className="flex-1"
          tabs={[
            { id: 'todos', label: 'Todos', icon: 'LayoutGrid', count: courses.length },
            {
              id: 'publicados',
              label: 'Publicados',
              icon: 'CheckCircle2',
              count: courses.filter((c) => c.status === 'publicado').length,
            },
            {
              id: 'rascunhos',
              label: 'Rascunhos',
              icon: 'FileEdit',
              count: courses.filter((c) => c.status === 'rascunho').length,
            },
            {
              id: 'obrigatorios',
              label: 'Obrigatórios',
              icon: 'ShieldAlert',
              count: courses.filter((c) => c.mandatory).length,
            },
          ]}
        />
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar treinamento…"
            className="w-full sm:w-60"
          />
          <Select
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            className="w-auto min-w-[168px]"
          >
            <option value="all">Todos os departamentos</option>
            {departments.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          <div className="flex overflow-hidden rounded-lg border border-slate-300">
            {([
              { id: 'tabela', icon: 'List' },
              { id: 'cards', icon: 'LayoutGrid' },
            ] as const).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setView(option.id)}
                className={`grid h-10 w-10 place-items-center transition ${
                  view === option.id
                    ? 'bg-navy-800 text-white'
                    : 'bg-white text-slate-500 hover:bg-slate-50'
                }`}
                title={option.id === 'tabela' ? 'Visualizar em tabela' : 'Visualizar em cartões'}
              >
                <Icon name={option.icon} className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon="SearchX"
            title="Nenhum treinamento encontrado"
            description="Ajuste os filtros ou cadastre um novo conteúdo no catálogo."
            action={
              <Button icon="Plus" onClick={() => navigate('/admin/treinamentos/novo')}>
                Novo treinamento
              </Button>
            }
          />
        </Card>
      ) : view === 'tabela' ? (
        <Card>
          <TableWrap>
            <thead>
              <tr>
                <Th>Treinamento</Th>
                <Th>Departamento</Th>
                <Th>Situação</Th>
                <Th align="center">Carga</Th>
                <Th align="center">Módulos</Th>
                <Th align="center">Inscritos</Th>
                <Th>Conclusão</Th>
                <Th align="right">Ações</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((course) => {
                const stats = statsOf(course.id);
                const dept = departments.find((d) => d.id === course.departmentId);
                return (
                  <Tr key={course.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <span
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white"
                          style={{
                            backgroundImage: `linear-gradient(135deg, ${course.coverFrom}, ${course.coverTo})`,
                          }}
                        >
                          <Icon name={course.cover} className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <Link
                            to={`/admin/treinamentos/${course.id}`}
                            className="flex items-center gap-2"
                          >
                            <span className="block max-w-[260px] truncate text-[13.5px] font-semibold text-navy-900 transition hover:text-brand-700">
                              {course.title}
                            </span>
                            {course.mandatory && <Badge tone="danger">Obrig.</Badge>}
                          </Link>
                          <span className="flex items-center gap-1.5 text-[11.5px] text-slate-400">
                            <Avatar
                              name={course.instructor}
                              src={course.instructorAvatar}
                              size="xs"
                              className="h-4 w-4 text-[8px]"
                            />
                            {course.instructor} · {course.category}
                          </span>
                        </div>
                      </div>
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
                        '—'
                      )}
                    </Td>
                    <Td>
                      <div className="flex flex-col items-start gap-1">
                        <CourseStatusBadge status={course.status} />
                        <LevelBadge level={course.level} />
                      </div>
                    </Td>
                    <Td align="center">
                      <span className="text-[12.5px] font-medium text-slate-600">
                        {formatMinutes(course.durationMinutes)}
                      </span>
                    </Td>
                    <Td align="center">
                      <span className="text-[12.5px] text-slate-600">
                        {course.modules.length} / {course.modules.reduce((s, m) => s + m.lessons.length, 0)}
                      </span>
                    </Td>
                    <Td align="center">{stats?.enrolled ?? 0}</Td>
                    <Td>
                      <div className="flex min-w-[120px] items-center gap-2">
                        <ProgressBar value={stats?.rate ?? 0} size="sm" className="flex-1" />
                        <span className="w-9 text-right text-[12px] font-bold tabular-nums text-navy-800">
                          {stats?.rate ?? 0}%
                        </span>
                      </div>
                    </Td>
                    <Td align="right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/treinamentos/${course.id}`)}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-navy-800"
                          title="Editar treinamento"
                        >
                          <Icon name="Pencil" className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCourseStatus(
                              course.id,
                              course.status === 'publicado' ? 'rascunho' : 'publicado',
                            );
                            toast(
                              course.status === 'publicado'
                                ? 'Treinamento despublicado'
                                : 'Treinamento publicado',
                              course.title,
                            );
                          }}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-brand-50 hover:text-brand-700"
                          title={
                            course.status === 'publicado'
                              ? 'Transformar em rascunho'
                              : 'Publicar treinamento'
                          }
                        >
                          <Icon
                            name={course.status === 'publicado' ? 'EyeOff' : 'Send'}
                            className="h-4 w-4"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirm(course)}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                          title="Excluir treinamento"
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
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((course) => {
            const stats = statsOf(course.id);
            return (
              <Card key={course.id} hover className="flex flex-col overflow-hidden">
                <div
                  className="relative h-24"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${course.coverFrom}, ${course.coverTo})`,
                  }}
                >
                  <Icon
                    name={course.cover}
                    className="absolute right-4 top-1/2 h-14 w-14 -translate-y-1/2 text-white/25"
                    strokeWidth={1.4}
                  />
                  <div className="absolute left-3 top-3 flex gap-1.5">
                    <CourseStatusBadge status={course.status} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <Link
                    to={`/admin/treinamentos/${course.id}`}
                    className="line-clamp-2 text-[14px] font-bold leading-snug text-navy-900 transition hover:text-brand-700"
                  >
                    {course.title}
                  </Link>
                  <p className="mt-1 text-[12px] text-slate-500">
                    {course.instructor} · {formatMinutes(course.durationMinutes)}
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: 'Inscritos', value: stats?.enrolled ?? 0 },
                      { label: 'Concluídos', value: stats?.concluido ?? 0 },
                      { label: 'Taxa', value: `${stats?.rate ?? 0}%` },
                    ].map((item) => (
                      <div key={item.label} className="rounded-lg bg-slate-50 py-2">
                        <p className="text-[14px] font-extrabold text-navy-900">{item.value}</p>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      icon="Pencil"
                      className="flex-1 justify-center"
                      onClick={() => navigate(`/admin/treinamentos/${course.id}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="subtle"
                      size="sm"
                      icon={course.status === 'publicado' ? 'EyeOff' : 'Send'}
                      onClick={() => {
                        setCourseStatus(
                          course.id,
                          course.status === 'publicado' ? 'rascunho' : 'publicado',
                        );
                        toast('Situação atualizada', course.title);
                      }}
                    >
                      {course.status === 'publicado' ? 'Ocultar' : 'Publicar'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-[12.5px] text-slate-500">
          Exibindo <strong className="font-semibold text-navy-900">{filtered.length}</strong> de{' '}
          {courses.length} treinamentos
        </p>
        <p className="text-[12.5px] text-slate-400">
          Última atualização do catálogo: {formatDate(new Date().toISOString())}
        </p>
      </div>

      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm) {
            removeCourse(confirm.id);
            toast('Treinamento excluído', confirm.title, 'info');
          }
        }}
        title="Excluir treinamento"
        message={`Tem certeza que deseja excluir "${confirm?.title}"? As matrículas, certificados e vínculos com trilhas também serão removidos.`}
        confirmLabel="Excluir treinamento"
      />
    </div>
  );
}
