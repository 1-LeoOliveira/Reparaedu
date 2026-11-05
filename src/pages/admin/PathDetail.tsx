import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardHeader,
  EmptyState,
  Icon,
  ProgressBar,
  StatCard,
  TableWrap,
  Td,
  Th,
  Tr,
} from '@/components/ui';
import { SearchInput } from '@/components/ui/form';
import { EmployeeCell, ProgressCell } from '@/components/shared';
import { useDataStore } from '@/store/useDataStore';
import { usePathAudience } from '@/hooks/useAnalytics';
import { toast } from '@/store/useToastStore';
import { downloadCsv, formatMinutes } from '@/utils/format';

export default function AdminPathDetail() {
  const { pathId = '' } = useParams();
  const courses = useDataStore((s) => s.courses);
  const departments = useDataStore((s) => s.departments);
  const enrollments = useDataStore((s) => s.enrollments);
  const { path, rows } = usePathAudience(pathId);
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');

  if (!path) {
    return (
      <Card>
        <EmptyState
          icon="FileQuestion"
          title="Trilha não encontrada"
          description="Esta jornada de desenvolvimento não existe mais."
          action={
            <Button icon="ArrowLeft" onClick={() => navigate('/admin/trilhas')}>
              Voltar às trilhas
            </Button>
          }
        />
      </Card>
    );
  }

  const pathCourses = path.courseIds
    .map((id) => courses.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const totalMinutes = pathCourses.reduce((sum, c) => sum + c.durationMinutes, 0);
  const completedAll = rows.filter((row) => row.progress === 100).length;
  const notStarted = rows.filter((row) => row.progress === 0).length;
  const averageProgress = rows.length
    ? Math.round(rows.reduce((sum, row) => sum + row.progress, 0) / rows.length)
    : 0;

  const filteredRows = rows.filter((row) =>
    search.trim()
      ? row.employee.name.toLowerCase().includes(search.trim().toLowerCase())
      : true,
  );

  const exportCsv = () => {
    const header = ['Colaborador', 'Cargo', 'Treinamentos concluídos', 'Total', 'Progresso (%)'];
    const body = rows.map((row) => [
      row.employee.name,
      row.employee.jobTitle,
      row.completed,
      path.courseIds.length,
      row.progress,
    ]);
    downloadCsv(
      `trilha-${path.title.toLowerCase().replace(/\s+/g, '-')}.csv`,
      [header, ...body],
    );
    toast('Exportação concluída', `${rows.length} colaboradores exportados.`);
  };

  return (
    <div>
      <div className="mb-4">
        <Breadcrumbs
          items={[
            { label: 'Painel de gestão', to: '/admin' },
            { label: 'Trilhas', to: '/admin/trilhas' },
            { label: path.title },
          ]}
        />
      </div>

      <div
        className="relative mb-6 overflow-hidden rounded-2xl p-6 sm:p-7"
        style={{
          backgroundImage: `linear-gradient(135deg, ${path.coverFrom}, ${path.coverTo})`,
        }}
      >
        <Icon
          name={path.icon}
          className="absolute right-8 top-1/2 h-32 w-32 -translate-y-1/2 text-white/15"
          strokeWidth={1.3}
        />
        <div className="relative max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            {path.mandatory && (
              <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-rose-700">
                Obrigatória
              </span>
            )}
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
              {pathCourses.length} treinamentos
            </span>
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
              {formatMinutes(totalMinutes)}
            </span>
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
              {path.departmentId
                ? departments.find((d) => d.id === path.departmentId)?.name
                : 'Toda a empresa'}
            </span>
          </div>
          <h1 className="mt-4 text-[25px] font-extrabold leading-tight tracking-tight text-white sm:text-[29px]">
            {path.title}
          </h1>
          <p className="mt-2.5 max-w-2xl text-[13.5px] leading-relaxed text-white/85">
            {path.description}
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-white/85">
            <Icon name="Users" className="h-4 w-4" />
            {path.audience} · prazo de {path.deadlineDays} dias
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Colaboradores vinculados"
          value={rows.length}
          icon="Users"
          tone="navy"
        />
        <StatCard
          label="Progresso médio"
          value={`${averageProgress}%`}
          icon="TrendingUp"
          tone="brand"
        />
        <StatCard
          label="Concluíram a trilha"
          value={completedAll}
          icon="CheckCircle2"
          tone="success"
          hint={`${rows.length ? Math.round((completedAll / rows.length) * 100) : 0}% do público-alvo`}
        />
        <StatCard
          label="Ainda não iniciaram"
          value={notStarted}
          icon="Circle"
          tone="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ------------------------ Sequência da trilha ------------------ */}
        <Card>
          <CardHeader
            title="Sequência de treinamentos"
            subtitle="Ordem definida para a jornada"
            icon="ListOrdered"
          />
          <ol className="divide-y divide-slate-100">
            {pathCourses.map((course, index) => {
              const list = enrollments.filter(
                (e) =>
                  e.courseId === course.id &&
                  rows.some((row) => row.employee.id === e.employeeId),
              );
              const done = list.filter((e) => e.status === 'concluido').length;
              const rate = list.length ? Math.round((done / list.length) * 100) : 0;

              return (
                <li key={course.id} className="px-5 py-3.5">
                  <div className="flex items-start gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-navy-800 text-[12px] font-bold text-white">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/admin/treinamentos/${course.id}`}
                        className="block truncate text-[13px] font-semibold text-navy-900 transition hover:text-brand-700"
                      >
                        {course.title}
                      </Link>
                      <p className="text-[11.5px] text-slate-400">
                        {formatMinutes(course.durationMinutes)} · {course.modules.length} módulos
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <ProgressBar value={rate} size="sm" className="flex-1" />
                        <span className="w-9 text-right text-[11.5px] font-bold tabular-nums text-navy-800">
                          {rate}%
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>

        {/* --------------------- Acompanhamento do público ---------------- */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Acompanhamento dos colaboradores"
            subtitle="Evolução individual dentro da trilha"
            icon="Users"
            action={
              <div className="flex items-center gap-2">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Buscar colaborador…"
                  className="w-44"
                />
                <Button variant="outline" size="sm" icon="Download" onClick={exportCsv}>
                  CSV
                </Button>
              </div>
            }
          />
          <TableWrap>
            <thead>
              <tr>
                <Th>Colaborador</Th>
                <Th align="center">Etapas concluídas</Th>
                <Th>Progresso</Th>
                <Th align="right">Situação</Th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <Tr key={row.employee.id}>
                  <Td>
                    <EmployeeCell
                      employee={row.employee}
                      to={`/admin/colaboradores/${row.employee.id}`}
                    />
                  </Td>
                  <Td align="center">
                    <span className="font-semibold text-navy-900">
                      {row.completed}/{path.courseIds.length}
                    </span>
                  </Td>
                  <Td>
                    <ProgressCell value={row.progress} />
                  </Td>
                  <Td align="right">
                    <Badge
                      tone={
                        row.progress === 100
                          ? 'success'
                          : row.progress === 0
                            ? 'neutral'
                            : 'brand'
                      }
                      icon={
                        row.progress === 100
                          ? 'CheckCircle2'
                          : row.progress === 0
                            ? 'Circle'
                            : 'PlayCircle'
                      }
                    >
                      {row.progress === 100
                        ? 'Concluída'
                        : row.progress === 0
                          ? 'Não iniciada'
                          : 'Em andamento'}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableWrap>
          {filteredRows.length === 0 && (
            <EmptyState
              compact
              icon="UserX"
              title="Nenhum colaborador encontrado"
              description="Ajuste a busca para localizar o colaborador desejado."
            />
          )}
        </Card>
      </div>
    </div>
  );
}
