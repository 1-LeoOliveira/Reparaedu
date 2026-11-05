import React from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Card,
  CardHeader,
  Icon,
  LinkButton,
  PageHeader,
  ProgressBar,
  StatCard,
  TableWrap,
  Td,
  Th,
  Tr,
} from '@/components/ui';
import { Select } from '@/components/ui/form';
import {
  CompletionRateChart,
  DepartmentStackChart,
  HoursChart,
  ParticipationChart,
  RankingBars,
  StatusDonut,
  TrendChart,
  VIZ,
} from '@/components/charts';
import { EmployeeCell, ProgressCell } from '@/components/shared';
import { useAuthStore } from '@/store/useAuthStore';
import { useDataStore } from '@/store/useDataStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { firstName, formatHours, formatNumber, relativeTime } from '@/utils/format';

const periodOptions = [
  { id: '3', label: 'Últimos 3 meses' },
  { id: '6', label: 'Últimos 6 meses' },
  { id: '12', label: 'Últimos 12 meses' },
];

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const departments = useDataStore((s) => s.departments);
  const activities = useDataStore((s) => s.activities);
  const [department, setDepartment] = React.useState('all');
  const [months, setMonths] = React.useState('12');

  const analytics = useAnalytics({
    departmentId: department === 'all' ? undefined : department,
    months: Number(months),
  });

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

  const topCourses = analytics.courseStats
    .filter((item) => item.accessed > 0)
    .slice(0, 6)
    .map((item) => ({
      label: item.course.title.length > 34 ? `${item.course.title.slice(0, 32)}…` : item.course.title,
      value: item.accessed,
    }));

  const participation = analytics.byDepartment.map((item, index) => ({
    label: item.department.name,
    value: item.rate,
    color: VIZ.series[index % VIZ.series.length],
  }));

  return (
    <div>
      <PageHeader
        title={`Visão geral${user ? ` · ${firstName(user.name)}` : ''}`}
        description="Panorama consolidado da capacitação da empresa, com indicadores de conclusão, engajamento e pendências por departamento."
        breadcrumbs={[{ label: 'Painel de gestão' }, { label: 'Visão geral' }]}
        actions={
          <>
            <Select
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              className="w-auto min-w-[170px]"
            >
              <option value="all">Todos os departamentos</option>
              {departments.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
            <Select
              value={months}
              onChange={(event) => setMonths(event.target.value)}
              className="w-auto min-w-[160px]"
            >
              {periodOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </Select>
            <LinkButton to="/admin/relatorios" variant="outline" icon="FileBarChart">
              Relatórios
            </LinkButton>
          </>
        }
      />

      {/* ----------------------------- Indicadores ----------------------- */}
      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Colaboradores"
          value={analytics.employeeCount}
          icon="Users"
          tone="navy"
          hint={`${departments.length} departamentos cadastrados`}
        />
        <StatCard
          label="Treinamentos publicados"
          value={analytics.courseCount}
          icon="GraduationCap"
          tone="brand"
          hint={`${analytics.draftCount} em rascunho`}
        />
        <StatCard
          label="Taxa geral de conclusão"
          value={`${analytics.completionRate}%`}
          icon="Target"
          tone="success"
          trend={{ value: analytics.trend, label: 'vs. mês anterior' }}
        />
        <StatCard
          label="Horas de capacitação"
          value={formatHours(analytics.minutes)}
          icon="Clock"
          tone="purple"
          hint="Somatório das cargas horárias concluídas"
        />
      </section>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Concluídos"
          value={formatNumber(analytics.byStatus.concluido)}
          icon="CheckCircle2"
          tone="success"
          hint={`de ${formatNumber(analytics.total)} atribuições`}
        />
        <StatCard
          label="Em andamento"
          value={formatNumber(analytics.byStatus.em_andamento)}
          icon="PlayCircle"
          tone="brand"
          hint="Treinamentos iniciados"
        />
        <StatCard
          label="Pendentes"
          value={formatNumber(analytics.byStatus.nao_iniciado)}
          icon="Circle"
          tone="navy"
          hint="Ainda não iniciados"
        />
        <StatCard
          label="Colaboradores em atraso"
          value={analytics.lateEmployees}
          icon="AlertTriangle"
          tone="danger"
          hint={`${analytics.byStatus.atrasado} treinamentos vencidos`}
        />
      </section>

      {/* ------------------------------- Gráficos ------------------------ */}
      <section className="mb-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Evolução da capacitação"
            subtitle="Treinamentos concluídos e iniciados por mês"
            icon="TrendingUp"
          />
          <div className="px-3 py-4 sm:px-5">
            <TrendChart data={analytics.series} />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Distribuição por situação"
            subtitle="Atribuições de treinamento"
            icon="PieChart"
          />
          <div className="px-5 py-4">
            <StatusDonut
              data={statusData}
              centerLabel="atribuições"
              centerValue={formatNumber(analytics.total)}
            />
          </div>
        </Card>
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Desempenho por departamento"
            subtitle="Situação das atribuições em cada setor"
            icon="Building2"
          />
          <div className="px-3 py-4 sm:px-5">
            <DepartmentStackChart data={analytics.byDepartment} />
          </div>
          <TableWrap minWidth={560} className="border-t border-slate-100">
            <thead>
              <tr>
                <Th>Departamento</Th>
                <Th align="center">Colab.</Th>
                <Th align="center">Concluídos</Th>
                <Th align="center">Atrasados</Th>
                <Th align="right">Taxa</Th>
              </tr>
            </thead>
            <tbody>
              {analytics.byDepartment.map((item) => (
                <Tr key={item.department.id}>
                  <Td>
                    <Link
                      to={`/admin/departamentos/${item.department.id}`}
                      className="inline-flex items-center gap-2 font-semibold text-navy-900 transition hover:text-brand-700"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: item.department.color }}
                      />
                      {item.department.name}
                    </Link>
                  </Td>
                  <Td align="center">{item.employees}</Td>
                  <Td align="center">
                    <span className="font-semibold text-emerald-700">{item.concluido}</span>
                  </Td>
                  <Td align="center">
                    <span
                      className={
                        item.atrasado > 0 ? 'font-semibold text-rose-600' : 'text-slate-400'
                      }
                    >
                      {item.atrasado}
                    </span>
                  </Td>
                  <Td align="right">
                    <span className="font-bold tabular-nums text-navy-900">{item.rate}%</span>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableWrap>
        </Card>

        <Card>
          <CardHeader
            title="Treinamentos mais acessados"
            subtitle="Número de colaboradores que iniciaram cada conteúdo"
            icon="Flame"
          />
          <div className="px-3 py-4 sm:px-5">
            <RankingBars data={topCourses} />
          </div>
        </Card>
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader
            title="Participação por setor"
            subtitle="Taxa de conclusão de cada departamento"
            icon="Users"
          />
          <div className="px-3 py-4 sm:px-5">
            <ParticipationChart data={participation} />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Horas de capacitação"
            subtitle="Carga horária concluída por mês"
            icon="Clock"
          />
          <div className="px-3 py-4 sm:px-5">
            <HoursChart data={analytics.series} />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Evolução da taxa de conclusão"
            subtitle="Percentual acumulado no período"
            icon="LineChart"
          />
          <div className="px-3 py-4 sm:px-5">
            <CompletionRateChart data={analytics.rateSeries} />
          </div>
        </Card>
      </section>

      {/* -------------------------- Ranking e atividades ------------------ */}
      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Ranking de participação"
            subtitle="Colaboradores com maior evolução nos treinamentos"
            icon="Trophy"
            action={
              <LinkButton to="/admin/colaboradores" variant="ghost" size="sm" iconRight="ArrowRight">
                Ver todos
              </LinkButton>
            }
          />
          <TableWrap minWidth={700}>
            <thead>
              <tr>
                <Th>#</Th>
                <Th>Colaborador</Th>
                <Th align="center">Concluídos</Th>
                <Th>Progresso</Th>
                <Th align="center">Horas</Th>
                <Th align="center">Certif.</Th>
              </tr>
            </thead>
            <tbody>
              {analytics.ranking.slice(0, 8).map((row, index) => (
                <Tr key={row.employee.id}>
                  <Td>
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-md text-[11.5px] font-bold ${
                        index === 0
                          ? 'bg-amber-100 text-amber-700'
                          : index === 1
                            ? 'bg-slate-200 text-slate-600'
                            : index === 2
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </Td>
                  <Td>
                    <EmployeeCell
                      employee={row.employee}
                      to={`/admin/colaboradores/${row.employee.id}`}
                    />
                  </Td>
                  <Td align="center">
                    <span className="font-semibold text-navy-900">
                      {row.concluido}/{row.total}
                    </span>
                  </Td>
                  <Td>
                    <ProgressCell value={row.progress} />
                  </Td>
                  <Td align="center">{formatHours(row.minutes)}</Td>
                  <Td align="center">
                    <Badge tone="warning" icon="Award">
                      {row.certificates}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableWrap>
        </Card>

        <Card>
          <CardHeader
            title="Atividades recentes"
            subtitle="Movimentação na plataforma"
            icon="Activity"
          />
          <ul className="scrollbar-thin max-h-[480px] divide-y divide-slate-100 overflow-y-auto">
            {activities.slice(0, 14).map((activity) => {
              const employee = analytics.employees.find((e) => e.id === activity.employeeId);
              return (
                <li key={activity.id} className="flex items-start gap-3 px-5 py-3">
                  {employee ? (
                    <Avatar name={employee.name} src={employee.avatar} size="xs" />
                  ) : (
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-100">
                      <Icon name="User" className="h-3.5 w-3.5 text-slate-400" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] leading-snug text-slate-600">
                      <strong className="font-semibold text-navy-900">
                        {employee ? firstName(employee.name) : 'Colaborador'}
                      </strong>{' '}
                      {activity.action}{' '}
                      <strong className="font-semibold text-navy-900">{activity.target}</strong>
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {relativeTime(activity.date)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </section>
    </div>
  );
}
