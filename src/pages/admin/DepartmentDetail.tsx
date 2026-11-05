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
  StatCard,
  TableWrap,
  Tabs,
  Td,
  Th,
  Tr,
} from '@/components/ui';
import { DepartmentStackChart, RankingBars, StatusDonut, TrendChart, VIZ } from '@/components/charts';
import { CourseStatusBadge, EmployeeCell, ProgressCell } from '@/components/shared';
import { useDataStore } from '@/store/useDataStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { employeeStatusLabel, formatDate, formatHours, formatMinutes } from '@/utils/format';

export default function DepartmentDetail() {
  const { departmentId = '' } = useParams();
  const departments = useDataStore((s) => s.departments);
  const courses = useDataStore((s) => s.courses);
  const paths = useDataStore((s) => s.paths);
  const navigate = useNavigate();
  const [tab, setTab] = React.useState('colaboradores');

  const department = departments.find((d) => d.id === departmentId);
  const analytics = useAnalytics({ departmentId, months: 12 });
  const companyAnalytics = useAnalytics({ months: 12 });

  if (!department) {
    return (
      <Card>
        <EmptyState
          icon="FileQuestion"
          title="Departamento não encontrado"
          description="O setor que você tentou acessar não existe mais na estrutura."
          action={
            <Button icon="ArrowLeft" onClick={() => navigate('/admin/departamentos')}>
              Voltar aos departamentos
            </Button>
          }
        />
      </Card>
    );
  }

  const departmentCourses = courses.filter((c) => c.departmentId === department.id);
  const departmentPaths = paths.filter((p) => p.departmentId === department.id);
  const row = analytics.byDepartment.find((item) => item.department.id === department.id);

  const statusData = [
    { name: 'Concluídos', value: analytics.byStatus.concluido, color: VIZ.status.concluido },
    {
      name: 'Em andamento',
      value: analytics.byStatus.em_andamento,
      color: VIZ.status.em_andamento,
    },
    {
      name: 'Não iniciados',
      value: analytics.byStatus.nao_iniciado,
      color: VIZ.status.nao_iniciado,
    },
    { name: 'Atrasados', value: analytics.byStatus.atrasado, color: VIZ.status.atrasado },
  ];

  const courseRanking = analytics.courseStats
    .filter((item) => item.course.departmentId === department.id)
    .slice(0, 6)
    .map((item) => ({
      label:
        item.course.title.length > 30 ? `${item.course.title.slice(0, 28)}…` : item.course.title,
      value: item.rate,
    }));

  return (
    <div>
      <div className="mb-4">
        <Breadcrumbs
          items={[
            { label: 'Painel de gestão', to: '/admin' },
            { label: 'Departamentos', to: '/admin/departamentos' },
            { label: department.name },
          ]}
        />
      </div>

      {/* --------------------------------- Capa -------------------------- */}
      <div
        className="relative mb-6 overflow-hidden rounded-2xl p-6 sm:p-7"
        style={{
          backgroundImage: `linear-gradient(135deg, ${department.color}, ${department.color}bb)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 18% 28%, #fff 1px, transparent 1.2px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div className="flex min-w-0 items-start gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20 text-white backdrop-blur">
              <Icon name={department.icon} className="h-7 w-7" />
            </span>
            <div className="min-w-0">
              <h1 className="text-[26px] font-extrabold tracking-tight text-white">
                {department.name}
              </h1>
              <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-white/85">
                {department.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12.5px] font-medium text-white/85">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="UserCog" className="h-4 w-4" />
                  {department.manager}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="Users" className="h-4 w-4" />
                  {analytics.employeeCount} colaboradores
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="GraduationCap" className="h-4 w-4" />
                  {departmentCourses.length} treinamentos
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="CalendarDays" className="h-4 w-4" />
                  Desde {formatDate(department.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            icon="ArrowLeft"
            onClick={() => navigate('/admin/departamentos')}
            className="bg-white/90"
          >
            Voltar
          </Button>
        </div>
      </div>

      {/* ----------------------------- Indicadores ----------------------- */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Taxa de conclusão"
          value={`${row?.rate ?? 0}%`}
          icon="Target"
          tone="success"
          hint={`${analytics.byStatus.concluido} de ${analytics.total} atribuições`}
        />
        <StatCard
          label="Horas de capacitação"
          value={formatHours(analytics.minutes)}
          icon="Clock"
          tone="brand"
          hint="Carga horária concluída pela equipe"
        />
        <StatCard
          label="Colaboradores em atraso"
          value={analytics.lateEmployees}
          icon="AlertTriangle"
          tone="danger"
          hint={`${analytics.byStatus.atrasado} treinamentos vencidos`}
        />
        <StatCard
          label="Certificados emitidos"
          value={analytics.certificateCount}
          icon="Award"
          tone="purple"
          hint="Total acumulado na equipe"
        />
      </div>

      {/* ------------------------------- Gráficos ------------------------ */}
      <div className="mb-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Evolução da capacitação do setor"
            subtitle="Conclusões e inícios por mês"
            icon="TrendingUp"
          />
          <div className="px-3 py-4 sm:px-5">
            <TrendChart data={analytics.series} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Situação das atribuições" icon="PieChart" />
          <div className="px-5 py-4">
            <StatusDonut data={statusData} centerLabel="atribuições" />
          </div>
        </Card>
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Comparativo entre setores"
            subtitle="Posição deste departamento na empresa"
            icon="BarChart3"
          />
          <div className="px-3 py-4 sm:px-5">
            <DepartmentStackChart data={companyAnalytics.byDepartment} height={200} />
          </div>
        </Card>
        <Card>
          <CardHeader
            title="Taxa de conclusão por treinamento"
            subtitle="Treinamentos do setor"
            icon="ListChecks"
          />
          <div className="px-3 py-4 sm:px-5">
            <RankingBars data={courseRanking} suffix="%" height={232} />
          </div>
        </Card>
      </div>

      {/* --------------------------------- Abas -------------------------- */}
      <Tabs
        className="mb-4"
        value={tab}
        onChange={setTab}
        tabs={[
          {
            id: 'colaboradores',
            label: 'Colaboradores',
            icon: 'Users',
            count: analytics.employeeCount,
          },
          {
            id: 'treinamentos',
            label: 'Treinamentos',
            icon: 'GraduationCap',
            count: departmentCourses.length,
          },
          {
            id: 'trilhas',
            label: 'Trilhas',
            icon: 'Route',
            count: departmentPaths.length,
          },
        ]}
      />

      {tab === 'colaboradores' && (
        <Card>
          <TableWrap>
            <thead>
              <tr>
                <Th>Colaborador</Th>
                <Th>Situação</Th>
                <Th align="center">Concluídos</Th>
                <Th align="center">Atrasados</Th>
                <Th>Progresso</Th>
                <Th align="center">Horas</Th>
                <Th align="right">Admissão</Th>
              </tr>
            </thead>
            <tbody>
              {analytics.ranking.map((item) => (
                <Tr key={item.employee.id}>
                  <Td>
                    <EmployeeCell
                      employee={item.employee}
                      to={`/admin/colaboradores/${item.employee.id}`}
                    />
                  </Td>
                  <Td>
                    <Badge
                      tone={
                        item.employee.status === 'ativo'
                          ? 'success'
                          : item.employee.status === 'ferias'
                            ? 'info'
                            : 'warning'
                      }
                    >
                      {employeeStatusLabel[item.employee.status]}
                    </Badge>
                  </Td>
                  <Td align="center">
                    <span className="font-semibold text-navy-900">
                      {item.concluido}/{item.total}
                    </span>
                  </Td>
                  <Td align="center">
                    <span
                      className={
                        item.atrasado > 0 ? 'font-bold text-rose-600' : 'text-slate-300'
                      }
                    >
                      {item.atrasado || '—'}
                    </span>
                  </Td>
                  <Td>
                    <ProgressCell value={item.progress} />
                  </Td>
                  <Td align="center">{formatHours(item.minutes)}</Td>
                  <Td align="right">
                    <span className="text-[12.5px] text-slate-600">
                      {formatDate(item.employee.admissionDate)}
                    </span>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableWrap>
        </Card>
      )}

      {tab === 'treinamentos' && (
        <Card>
          <TableWrap>
            <thead>
              <tr>
                <Th>Treinamento</Th>
                <Th>Situação</Th>
                <Th align="center">Carga</Th>
                <Th align="center">Inscritos</Th>
                <Th align="center">Concluídos</Th>
                <Th align="right">Taxa</Th>
              </tr>
            </thead>
            <tbody>
              {departmentCourses.map((course) => {
                const stats = analytics.courseStats.find(
                  (item) => item.course.id === course.id,
                );
                return (
                  <Tr key={course.id}>
                    <Td>
                      <Link
                        to={`/admin/treinamentos/${course.id}`}
                        className="group block min-w-0"
                      >
                        <span className="block truncate text-[13.5px] font-semibold text-navy-900 transition group-hover:text-brand-700">
                          {course.title}
                        </span>
                        <span className="block text-[11.5px] text-slate-400">
                          {course.category} · {course.instructor}
                        </span>
                      </Link>
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-1.5">
                        <CourseStatusBadge status={course.status} />
                        {course.mandatory && <Badge tone="danger">Obrigatório</Badge>}
                      </div>
                    </Td>
                    <Td align="center">{formatMinutes(course.durationMinutes)}</Td>
                    <Td align="center">{stats?.enrolled ?? 0}</Td>
                    <Td align="center">
                      <span className="font-semibold text-emerald-700">
                        {stats?.concluido ?? 0}
                      </span>
                    </Td>
                    <Td align="right">
                      <span className="font-bold tabular-nums text-navy-900">
                        {stats?.rate ?? 0}%
                      </span>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </TableWrap>
        </Card>
      )}

      {tab === 'trilhas' && (
        <Card>
          {departmentPaths.length === 0 ? (
            <EmptyState
              icon="Route"
              title="Nenhuma trilha específica"
              description="Este departamento ainda não possui trilhas exclusivas. As trilhas gerais da empresa continuam aplicáveis."
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {departmentPaths.map((path) => (
                <li key={path.id}>
                  <Link
                    to={`/admin/trilhas/${path.id}`}
                    className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
                  >
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${path.coverFrom}, ${path.coverTo})`,
                      }}
                    >
                      <Icon name={path.icon} className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[14px] font-bold text-navy-900">{path.title}</p>
                        {path.mandatory && <Badge tone="danger">Obrigatória</Badge>}
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-[12.5px] text-slate-500">
                        {path.description}
                      </p>
                      <p className="mt-1 text-[11.5px] text-slate-400">
                        {path.courseIds.length} treinamentos · prazo de {path.deadlineDays} dias
                      </p>
                    </div>
                    <Icon name="ArrowRight" className="h-4 w-4 shrink-0 text-slate-300" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
}
