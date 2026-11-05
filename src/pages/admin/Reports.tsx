import React from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  CardHeader,
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
import { useDataStore } from '@/store/useDataStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { toast } from '@/store/useToastStore';
import {
  downloadCsv,
  enrollmentStatusLabel,
  formatDate,
  formatHours,
  formatNumber,
} from '@/utils/format';

const reportTabs = [
  { id: 'geral', label: 'Desempenho geral', icon: 'BarChart3' },
  { id: 'departamentos', label: 'Por departamento', icon: 'Building2' },
  { id: 'colaboradores', label: 'Histórico individual', icon: 'Users' },
  { id: 'treinamentos', label: 'Treinamentos', icon: 'GraduationCap' },
  { id: 'pendencias', label: 'Pendências e atrasos', icon: 'AlertTriangle' },
  { id: 'avaliacoes', label: 'Avaliações', icon: 'ClipboardCheck' },
];

export default function Reports() {
  const departments = useDataStore((s) => s.departments);
  const employees = useDataStore((s) => s.employees);
  const courses = useDataStore((s) => s.courses);
  const enrollments = useDataStore((s) => s.enrollments);
  const settings = useDataStore((s) => s.settings);

  const [tab, setTab] = React.useState('geral');
  const [department, setDepartment] = React.useState('all');
  const [months, setMonths] = React.useState('12');
  const [search, setSearch] = React.useState('');

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

  const participation = analytics.byDepartment.map((item, index) => ({
    label: item.department.name,
    value: item.rate,
    color: VIZ.series[index % VIZ.series.length],
  }));

  const lateRows = enrollments
    .filter((e) => e.status === 'atrasado')
    .map((enrollment) => ({
      enrollment,
      employee: employees.find((item) => item.id === enrollment.employeeId),
      course: courses.find((item) => item.id === enrollment.courseId),
    }))
    .filter(
      (row) =>
        row.employee &&
        row.course &&
        (department === 'all' || row.employee.departmentId === department),
    )
    .sort(
      (a, b) =>
        new Date(a.enrollment.dueDate ?? 0).getTime() -
        new Date(b.enrollment.dueDate ?? 0).getTime(),
    );

  const filteredRanking = analytics.ranking.filter((row) =>
    search.trim()
      ? row.employee.name.toLowerCase().includes(search.trim().toLowerCase())
      : true,
  );

  // --------------------------------- Exportações -------------------------
  const exportCurrent = () => {
    const periodLabel = `Últimos ${months} meses`;
    const deptLabel =
      department === 'all'
        ? 'Todos os departamentos'
        : departments.find((d) => d.id === department)?.name ?? '';

    if (tab === 'departamentos') {
      downloadCsv('relatorio-departamentos.csv', [
        ['Relatório de desempenho por departamento'],
        [`Período: ${periodLabel}`],
        [],
        [
          'Departamento',
          'Colaboradores',
          'Atribuições',
          'Concluídos',
          'Em andamento',
          'Não iniciados',
          'Atrasados',
          'Taxa de conclusão (%)',
          'Horas',
        ],
        ...analytics.byDepartment.map((item) => [
          item.department.name,
          item.employees,
          item.total,
          item.concluido,
          item.em_andamento,
          item.nao_iniciado,
          item.atrasado,
          item.rate,
          Math.round(item.minutes / 60),
        ]),
      ]);
    } else if (tab === 'colaboradores') {
      downloadCsv('relatorio-colaboradores.csv', [
        ['Relatório de histórico individual'],
        [`Período: ${periodLabel} · ${deptLabel}`],
        [],
        [
          'Colaborador',
          'Cargo',
          'Departamento',
          'Atribuídos',
          'Concluídos',
          'Atrasados',
          'Progresso (%)',
          'Horas',
          'Certificados',
        ],
        ...filteredRanking.map((row) => [
          row.employee.name,
          row.employee.jobTitle,
          departments.find((d) => d.id === row.employee.departmentId)?.name ?? '',
          row.total,
          row.concluido,
          row.atrasado,
          row.progress,
          Math.round(row.minutes / 60),
          row.certificates,
        ]),
      ]);
    } else if (tab === 'treinamentos') {
      downloadCsv('relatorio-treinamentos.csv', [
        ['Relatório de treinamentos'],
        [`Período: ${periodLabel} · ${deptLabel}`],
        [],
        [
          'Treinamento',
          'Departamento',
          'Inscritos',
          'Acessaram',
          'Concluíram',
          'Taxa de conclusão (%)',
          'Taxa de aprovação (%)',
          'Nota média',
        ],
        ...analytics.courseStats.map((item) => [
          item.course.title,
          departments.find((d) => d.id === item.course.departmentId)?.name ?? '',
          item.enrolled,
          item.accessed,
          item.concluido,
          item.rate,
          item.approvalRate,
          item.averageScore,
        ]),
      ]);
    } else if (tab === 'pendencias') {
      downloadCsv('relatorio-pendencias.csv', [
        ['Relatório de pendências e atrasos'],
        [`Período: ${periodLabel} · ${deptLabel}`],
        [],
        ['Colaborador', 'Departamento', 'Treinamento', 'Prazo', 'Progresso (%)', 'Situação'],
        ...lateRows.map((row) => [
          row.employee!.name,
          departments.find((d) => d.id === row.employee!.departmentId)?.name ?? '',
          row.course!.title,
          formatDate(row.enrollment.dueDate),
          row.enrollment.progress,
          enrollmentStatusLabel[row.enrollment.status],
        ]),
      ]);
    } else {
      downloadCsv('relatorio-geral.csv', [
        ['Relatório de desempenho geral'],
        [settings.companyName],
        [`Período: ${periodLabel} · ${deptLabel}`],
        [`Emitido em: ${formatDate(new Date().toISOString())}`],
        [],
        ['Indicador', 'Valor'],
        ['Colaboradores', analytics.employeeCount],
        ['Treinamentos publicados', analytics.courseCount],
        ['Atribuições totais', analytics.total],
        ['Concluídos', analytics.byStatus.concluido],
        ['Em andamento', analytics.byStatus.em_andamento],
        ['Não iniciados', analytics.byStatus.nao_iniciado],
        ['Atrasados', analytics.byStatus.atrasado],
        ['Taxa de conclusão (%)', analytics.completionRate],
        ['Taxa de aprovação (%)', analytics.approvalRate],
        ['Horas de capacitação', Math.round(analytics.minutes / 60)],
        ['Certificados emitidos', analytics.certificateCount],
        [],
        ['Mês', 'Conclusões', 'Inícios', 'Horas'],
        ...analytics.series.map((item) => [
          item.label,
          item.conclusoes,
          item.inicios,
          item.horas,
        ]),
      ]);
    }
    toast('Relatório exportado', 'Arquivo CSV gerado com os dados do filtro atual.');
  };

  return (
    <div>
      <PageHeader
        title="Relatórios"
        description="Análises detalhadas de desempenho, participação e conformidade da capacitação corporativa."
        breadcrumbs={[{ label: 'Painel de gestão', to: '/admin' }, { label: 'Relatórios' }]}
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
              className="w-auto min-w-[150px]"
            >
              <option value="3">Últimos 3 meses</option>
              <option value="6">Últimos 6 meses</option>
              <option value="12">Últimos 12 meses</option>
            </Select>
            <Button variant="outline" icon="Printer" onClick={() => window.print()}>
              Imprimir
            </Button>
            <Button icon="Download" onClick={exportCurrent}>
              Exportar CSV
            </Button>
          </>
        }
      />

      <Tabs className="mb-5" value={tab} onChange={setTab} tabs={reportTabs} />

      <div className="print-area">
        {/* ------------------------------ Geral ------------------------- */}
        {tab === 'geral' && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                tone="brand"
                hint={`${formatNumber(analytics.byStatus.concluido)} treinamentos concluídos`}
              />
              <StatCard
                label="Taxa de aprovação"
                value={`${analytics.approvalRate}%`}
                icon="ClipboardCheck"
                tone="purple"
                hint="Aprovações nas avaliações finais"
              />
              <StatCard
                label="Colaboradores em atraso"
                value={analytics.lateEmployees}
                icon="AlertTriangle"
                tone="danger"
                hint={`${analytics.byStatus.atrasado} treinamentos vencidos`}
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <Card className="xl:col-span-2">
                <CardHeader
                  title="Evolução mensal da capacitação"
                  subtitle="Conclusões e novos inícios ao longo do período"
                  icon="TrendingUp"
                />
                <div className="px-3 py-4 sm:px-5">
                  <TrendChart data={analytics.series} />
                </div>
              </Card>
              <Card>
                <CardHeader title="Distribuição por situação" icon="PieChart" />
                <div className="px-5 py-4">
                  <StatusDonut
                    data={statusData}
                    centerLabel="atribuições"
                    centerValue={formatNumber(analytics.total)}
                  />
                </div>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader
                  title="Horas de capacitação por mês"
                  subtitle="Carga horária concluída"
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
            </div>
          </div>
        )}

        {/* --------------------------- Departamentos -------------------- */}
        {tab === 'departamentos' && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader
                  title="Situação por departamento"
                  subtitle="Distribuição das atribuições em cada setor"
                  icon="Building2"
                />
                <div className="px-3 py-4 sm:px-5">
                  <DepartmentStackChart data={analytics.byDepartment} />
                </div>
              </Card>
              <Card>
                <CardHeader
                  title="Taxa de conclusão por setor"
                  subtitle="Comparativo de desempenho"
                  icon="BarChart3"
                />
                <div className="px-3 py-4 sm:px-5">
                  <ParticipationChart data={participation} />
                </div>
              </Card>
            </div>

            <Card>
              <CardHeader
                title="Quadro comparativo"
                subtitle="Indicadores consolidados por departamento"
                icon="Table2"
              />
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Departamento</Th>
                    <Th align="center">Colaboradores</Th>
                    <Th align="center">Atribuições</Th>
                    <Th align="center">Concluídos</Th>
                    <Th align="center">Em andamento</Th>
                    <Th align="center">Atrasados</Th>
                    <Th>Taxa de conclusão</Th>
                    <Th align="right">Horas</Th>
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
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: item.department.color }}
                          />
                          {item.department.name}
                        </Link>
                      </Td>
                      <Td align="center">{item.employees}</Td>
                      <Td align="center">{item.total}</Td>
                      <Td align="center">
                        <span className="font-semibold text-emerald-700">{item.concluido}</span>
                      </Td>
                      <Td align="center">{item.em_andamento}</Td>
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
                        <ProgressCell value={item.rate} />
                      </Td>
                      <Td align="right">{formatHours(item.minutes)}</Td>
                    </Tr>
                  ))}
                </tbody>
              </TableWrap>
            </Card>
          </div>
        )}

        {/* -------------------------- Colaboradores --------------------- */}
        {tab === 'colaboradores' && (
          <Card>
            <CardHeader
              title="Histórico individual dos colaboradores"
              subtitle="Ranking de participação e evolução"
              icon="Users"
              action={
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Buscar colaborador…"
                  className="w-56"
                />
              }
            />
            <TableWrap>
              <thead>
                <tr>
                  <Th>#</Th>
                  <Th>Colaborador</Th>
                  <Th>Departamento</Th>
                  <Th align="center">Atribuídos</Th>
                  <Th align="center">Concluídos</Th>
                  <Th align="center">Atrasados</Th>
                  <Th>Progresso</Th>
                  <Th align="center">Horas</Th>
                  <Th align="right">Certificados</Th>
                </tr>
              </thead>
              <tbody>
                {filteredRanking.map((row, index) => (
                  <Tr key={row.employee.id}>
                    <Td>
                      <span className="text-[12px] font-bold text-slate-400">{index + 1}</span>
                    </Td>
                    <Td>
                      <EmployeeCell
                        employee={row.employee}
                        to={`/admin/colaboradores/${row.employee.id}`}
                      />
                    </Td>
                    <Td>
                      <span className="text-[12.5px] text-slate-600">
                        {departments.find((d) => d.id === row.employee.departmentId)?.name ?? '—'}
                      </span>
                    </Td>
                    <Td align="center">{row.total}</Td>
                    <Td align="center">
                      <span className="font-semibold text-emerald-700">{row.concluido}</span>
                    </Td>
                    <Td align="center">
                      <span
                        className={row.atrasado > 0 ? 'font-bold text-rose-600' : 'text-slate-300'}
                      >
                        {row.atrasado || '—'}
                      </span>
                    </Td>
                    <Td>
                      <ProgressCell value={row.progress} />
                    </Td>
                    <Td align="center">{formatHours(row.minutes)}</Td>
                    <Td align="right">
                      <Badge tone="warning" icon="Award">
                        {row.certificates}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </TableWrap>
          </Card>
        )}

        {/* --------------------------- Treinamentos --------------------- */}
        {tab === 'treinamentos' && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader
                  title="Treinamentos mais acessados"
                  subtitle="Colaboradores que iniciaram o conteúdo"
                  icon="Flame"
                />
                <div className="px-3 py-4 sm:px-5">
                  <RankingBars
                    data={analytics.courseStats.slice(0, 7).map((item) => ({
                      label:
                        item.course.title.length > 32
                          ? `${item.course.title.slice(0, 30)}…`
                          : item.course.title,
                      value: item.accessed,
                    }))}
                    height={286}
                  />
                </div>
              </Card>
              <Card>
                <CardHeader
                  title="Maiores taxas de conclusão"
                  subtitle="Percentual de conclusão por treinamento"
                  icon="Trophy"
                />
                <div className="px-3 py-4 sm:px-5">
                  <RankingBars
                    data={[...analytics.courseStats]
                      .filter((item) => item.enrolled > 0)
                      .sort((a, b) => b.rate - a.rate)
                      .slice(0, 7)
                      .map((item) => ({
                        label:
                          item.course.title.length > 32
                            ? `${item.course.title.slice(0, 30)}…`
                            : item.course.title,
                        value: item.rate,
                      }))}
                    suffix="%"
                    height={286}
                    color={VIZ.series[1]}
                  />
                </div>
              </Card>
            </div>

            <Card>
              <CardHeader
                title="Desempenho detalhado dos treinamentos"
                subtitle="Participação, conclusão e aproveitamento"
                icon="GraduationCap"
              />
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Treinamento</Th>
                    <Th>Departamento</Th>
                    <Th align="center">Inscritos</Th>
                    <Th align="center">Acessaram</Th>
                    <Th align="center">Concluíram</Th>
                    <Th>Taxa de conclusão</Th>
                    <Th align="center">Aprovação</Th>
                    <Th align="right">Nota média</Th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.courseStats.map((item) => (
                    <Tr key={item.course.id}>
                      <Td>
                        <Link
                          to={`/admin/treinamentos/${item.course.id}`}
                          className="block max-w-[260px] truncate text-[13.5px] font-semibold text-navy-900 transition hover:text-brand-700"
                        >
                          {item.course.title}
                        </Link>
                      </Td>
                      <Td>
                        <span className="text-[12.5px] text-slate-600">
                          {departments.find((d) => d.id === item.course.departmentId)?.name ?? '—'}
                        </span>
                      </Td>
                      <Td align="center">{item.enrolled}</Td>
                      <Td align="center">{item.accessed}</Td>
                      <Td align="center">
                        <span className="font-semibold text-emerald-700">{item.concluido}</span>
                      </Td>
                      <Td>
                        <ProgressCell value={item.rate} />
                      </Td>
                      <Td align="center">
                        {item.approvalRate > 0 ? (
                          <Badge tone={item.approvalRate >= 70 ? 'success' : 'warning'}>
                            {item.approvalRate}%
                          </Badge>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </Td>
                      <Td align="right">
                        {item.averageScore > 0 ? (
                          <span className="font-bold tabular-nums text-navy-900">
                            {item.averageScore}%
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </TableWrap>
            </Card>
          </div>
        )}

        {/* ---------------------------- Pendências ---------------------- */}
        {tab === 'pendencias' && (
          <Card>
            <CardHeader
              title="Treinamentos em atraso"
              subtitle="Pendências que exigem acompanhamento da liderança"
              icon="AlertTriangle"
              action={
                <Badge tone="danger" icon="AlertTriangle">
                  {lateRows.length} pendências
                </Badge>
              }
            />
            {lateRows.length === 0 ? (
              <EmptyState
                icon="ShieldCheck"
                title="Nenhum treinamento em atraso"
                description="Todos os colaboradores deste recorte estão em conformidade com os prazos."
              />
            ) : (
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Colaborador</Th>
                    <Th>Departamento</Th>
                    <Th>Treinamento</Th>
                    <Th align="center">Prazo</Th>
                    <Th align="center">Dias em atraso</Th>
                    <Th align="right">Progresso</Th>
                  </tr>
                </thead>
                <tbody>
                  {lateRows.map((row) => {
                    const days = row.enrollment.dueDate
                      ? Math.max(
                          1,
                          Math.round(
                            (Date.now() - new Date(row.enrollment.dueDate).getTime()) /
                              86400000,
                          ),
                        )
                      : 0;
                    return (
                      <Tr key={row.enrollment.id}>
                        <Td>
                          <EmployeeCell
                            employee={row.employee!}
                            to={`/admin/colaboradores/${row.employee!.id}`}
                          />
                        </Td>
                        <Td>
                          <span className="text-[12.5px] text-slate-600">
                            {departments.find((d) => d.id === row.employee!.departmentId)?.name}
                          </span>
                        </Td>
                        <Td>
                          <span className="block max-w-[240px] truncate text-[13px] font-medium text-navy-900">
                            {row.course!.title}
                          </span>
                        </Td>
                        <Td align="center">
                          <span className="text-[12.5px] font-semibold text-rose-600">
                            {formatDate(row.enrollment.dueDate)}
                          </span>
                        </Td>
                        <Td align="center">
                          <Badge tone={days > 30 ? 'danger' : 'warning'}>{days} dias</Badge>
                        </Td>
                        <Td align="right">
                          <div className="flex min-w-[120px] items-center justify-end gap-2">
                            <ProgressBar
                              value={row.enrollment.progress}
                              size="sm"
                              tone="danger"
                              className="w-20"
                            />
                            <span className="w-9 text-right text-[12px] font-bold tabular-nums text-navy-800">
                              {row.enrollment.progress}%
                            </span>
                          </div>
                        </Td>
                      </Tr>
                    );
                  })}
                </tbody>
              </TableWrap>
            )}
          </Card>
        )}

        {/* ---------------------------- Avaliações ---------------------- */}
        {tab === 'avaliacoes' && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Taxa de aprovação"
                value={`${analytics.approvalRate}%`}
                icon="ClipboardCheck"
                tone="success"
                hint="Tentativas aprovadas sobre o total"
              />
              <StatCard
                label="Avaliações realizadas"
                value={formatNumber(
                  analytics.courseStats.reduce((sum, item) => sum + item.concluido, 0),
                )}
                icon="FileCheck"
                tone="brand"
              />
              <StatCard
                label="Certificados emitidos"
                value={analytics.certificateCount}
                icon="Award"
                tone="warning"
              />
              <StatCard
                label="Nota mínima institucional"
                value={`${settings.minimumScore}%`}
                icon="Target"
                tone="navy"
              />
            </div>

            <Card>
              <CardHeader
                title="Aproveitamento nas avaliações"
                subtitle="Taxa de aprovação e nota média por treinamento"
                icon="ClipboardCheck"
              />
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Treinamento</Th>
                    <Th align="center">Nota mínima</Th>
                    <Th align="center">Questões</Th>
                    <Th align="center">Avaliações</Th>
                    <Th>Taxa de aprovação</Th>
                    <Th align="right">Nota média</Th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.courseStats
                    .filter((item) => item.course.assessment)
                    .map((item) => (
                      <Tr key={item.course.id}>
                        <Td>
                          <Link
                            to={`/admin/treinamentos/${item.course.id}`}
                            className="block max-w-[280px] truncate text-[13.5px] font-semibold text-navy-900 transition hover:text-brand-700"
                          >
                            {item.course.title}
                          </Link>
                        </Td>
                        <Td align="center">{item.course.assessment?.minimumScore}%</Td>
                        <Td align="center">{item.course.assessment?.questions.length}</Td>
                        <Td align="center">{item.concluido}</Td>
                        <Td>
                          <ProgressCell value={item.approvalRate} />
                        </Td>
                        <Td align="right">
                          {item.averageScore > 0 ? (
                            <span className="font-bold tabular-nums text-navy-900">
                              {item.averageScore}%
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </Td>
                      </Tr>
                    ))}
                </tbody>
              </TableWrap>
            </Card>
          </div>
        )}
      </div>

      <p className="mt-5 flex items-center gap-1.5 text-[11.5px] text-slate-400">
        <Icon name="Info" className="h-3.5 w-3.5" />
        Relatório gerado em {formatDate(new Date().toISOString())} ·{' '}
        {settings.companyName} · dados demonstrativos
      </p>
    </div>
  );
}
