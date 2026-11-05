import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardHeader,
  EmptyState,
  Icon,
  Modal,
  ProgressBar,
  RadialProgress,
  StatCard,
  TableWrap,
  Tabs,
  Td,
  Th,
  Tr,
} from '@/components/ui';
import { StatusBadge } from '@/components/shared';
import { CertificateSheet, printCertificate } from '@/components/CertificateSheet';
import { useDataStore } from '@/store/useDataStore';
import { useEmployeeLearning, usePathsProgress } from '@/hooks/useAnalytics';
import { toast } from '@/store/useToastStore';
import {
  downloadCsv,
  employeeStatusLabel,
  formatDate,
  formatDateTime,
  formatHours,
  formatMinutes,
  relativeTime,
} from '@/utils/format';
import type { Certificate } from '@/types';

export default function EmployeeDetail() {
  const { employeeId = '' } = useParams();
  const employees = useDataStore((s) => s.employees);
  const departments = useDataStore((s) => s.departments);
  const navigate = useNavigate();

  const learning = useEmployeeLearning(employeeId);
  const paths = usePathsProgress(employeeId);
  const [tab, setTab] = React.useState('historico');
  const [certificate, setCertificate] = React.useState<Certificate | null>(null);

  const employee = employees.find((e) => e.id === employeeId);

  if (!employee) {
    return (
      <Card>
        <EmptyState
          icon="UserX"
          title="Colaborador não encontrado"
          description="Este registro não existe mais na base de colaboradores."
          action={
            <Button icon="ArrowLeft" onClick={() => navigate('/admin/colaboradores')}>
              Voltar à listagem
            </Button>
          }
        />
      </Card>
    );
  }

  const department = departments.find((d) => d.id === employee.departmentId);
  const myPaths = paths.filter(
    (item) => !item.path.departmentId || item.path.departmentId === employee.departmentId,
  );

  const exportHistory = () => {
    const header = [
      'Treinamento',
      'Categoria',
      'Situação',
      'Progresso (%)',
      'Nota',
      'Início',
      'Conclusão',
      'Prazo',
    ];
    const body = learning.items.map(({ course, enrollment }) => [
      course.title,
      course.category,
      enrollment.status,
      enrollment.progress,
      enrollment.score ?? '',
      formatDate(enrollment.startedAt),
      formatDate(enrollment.completedAt),
      formatDate(enrollment.dueDate),
    ]);
    downloadCsv(
      `historico-${employee.name.toLowerCase().replace(/\s+/g, '-')}.csv`,
      [header, ...body],
    );
    toast('Exportação concluída', 'Histórico individual exportado em CSV.');
  };

  return (
    <div>
      <div className="mb-4">
        <Breadcrumbs
          items={[
            { label: 'Painel de gestão', to: '/admin' },
            { label: 'Colaboradores', to: '/admin/colaboradores' },
            { label: employee.name },
          ]}
        />
      </div>

      {/* --------------------------------- Capa -------------------------- */}
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-navy-950 p-6 sm:p-7">
        <div className="absolute inset-0 grid-pattern opacity-60" />
        <div
          className="absolute -right-20 -top-24 h-72 w-72 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.4), transparent 70%)' }}
        />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar
              name={employee.name}
              src={employee.avatar}
              size="xl"
              ring
              className="ring-white/20"
            />
            <div className="min-w-0">
              <h1 className="truncate text-[25px] font-extrabold tracking-tight text-white">
                {employee.name}
              </h1>
              <p className="mt-1 text-[13.5px] text-navy-200">{employee.jobTitle}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {department && (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-0.5 text-[11.5px] font-semibold text-white backdrop-blur"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: department.color }}
                    />
                    {department.name}
                  </span>
                )}
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11.5px] font-semibold text-white backdrop-blur">
                  {employeeStatusLabel[employee.status]}
                </span>
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11.5px] font-semibold text-white backdrop-blur">
                  Matrícula {employee.registration}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12.5px] text-navy-200">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="Mail" className="h-3.5 w-3.5 text-navy-400" />
                  {employee.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="Phone" className="h-3.5 w-3.5 text-navy-400" />
                  {employee.phone}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="CalendarDays" className="h-3.5 w-3.5 text-navy-400" />
                  Admitido em {formatDate(employee.admissionDate)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <RadialProgress value={learning.progress} size={92} stroke={8} sublabel="geral" />
            <div className="space-y-1.5 text-[12.5px]">
              <p className="text-navy-100">
                <strong className="font-bold text-white">{learning.completed}</strong> concluídos
              </p>
              <p className="text-navy-100">
                <strong className="font-bold text-white">{learning.pending}</strong> pendentes
              </p>
              <p className="text-navy-100">
                <strong className="font-bold text-white">{learning.late}</strong> em atraso
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------- Indicadores ----------------------- */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Treinamentos atribuídos"
          value={learning.total}
          icon="BookOpen"
          tone="navy"
        />
        <StatCard
          label="Horas de capacitação"
          value={formatHours(learning.minutes)}
          icon="Clock"
          tone="brand"
        />
        <StatCard
          label="Certificados"
          value={learning.certificates.length}
          icon="Award"
          tone="success"
        />
        <StatCard
          label="Pendências em atraso"
          value={learning.late}
          icon="AlertTriangle"
          tone="danger"
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { id: 'historico', label: 'Histórico', icon: 'History', count: learning.total },
            {
              id: 'certificados',
              label: 'Certificados',
              icon: 'Award',
              count: learning.certificates.length,
            },
            { id: 'trilhas', label: 'Trilhas', icon: 'Route', count: myPaths.length },
            { id: 'atividades', label: 'Atividades', icon: 'Activity' },
          ]}
          className="flex-1"
        />
        <Button variant="outline" size="sm" icon="Download" onClick={exportHistory}>
          Exportar histórico
        </Button>
      </div>

      {/* ------------------------------ Histórico ------------------------ */}
      {tab === 'historico' && (
        <Card>
          <TableWrap>
            <thead>
              <tr>
                <Th>Treinamento</Th>
                <Th>Situação</Th>
                <Th>Progresso</Th>
                <Th align="center">Nota</Th>
                <Th align="center">Início</Th>
                <Th align="center">Conclusão</Th>
                <Th align="right">Prazo</Th>
              </tr>
            </thead>
            <tbody>
              {learning.items
                .slice()
                .sort((a, b) => {
                  const order = {
                    atrasado: 0,
                    em_andamento: 1,
                    nao_iniciado: 2,
                    concluido: 3,
                  };
                  return order[a.enrollment.status] - order[b.enrollment.status];
                })
                .map(({ course, enrollment }) => (
                  <Tr key={course.id}>
                    <Td>
                      <Link
                        to={`/admin/treinamentos/${course.id}`}
                        className="group block min-w-0"
                      >
                        <span className="flex items-center gap-2">
                          <span className="block truncate text-[13.5px] font-semibold text-navy-900 transition group-hover:text-brand-700">
                            {course.title}
                          </span>
                          {course.mandatory && (
                            <Badge tone="danger">Obrigatório</Badge>
                          )}
                        </span>
                        <span className="block text-[11.5px] text-slate-400">
                          {course.category} · {formatMinutes(course.durationMinutes)}
                        </span>
                      </Link>
                    </Td>
                    <Td>
                      <StatusBadge status={enrollment.status} />
                    </Td>
                    <Td>
                      <div className="flex min-w-[120px] items-center gap-2">
                        <ProgressBar
                          value={enrollment.progress}
                          size="sm"
                          tone={
                            enrollment.status === 'concluido'
                              ? 'success'
                              : enrollment.status === 'atrasado'
                                ? 'danger'
                                : 'brand'
                          }
                          className="flex-1"
                        />
                        <span className="w-8 text-right text-[12px] font-bold tabular-nums text-navy-800">
                          {enrollment.progress}%
                        </span>
                      </div>
                    </Td>
                    <Td align="center">
                      {enrollment.score !== null ? (
                        <span className="font-bold tabular-nums text-emerald-700">
                          {enrollment.score}%
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </Td>
                    <Td align="center">
                      <span className="text-[12.5px] text-slate-600">
                        {formatDate(enrollment.startedAt)}
                      </span>
                    </Td>
                    <Td align="center">
                      <span className="text-[12.5px] text-slate-600">
                        {formatDate(enrollment.completedAt)}
                      </span>
                    </Td>
                    <Td align="right">
                      <span
                        className={
                          enrollment.status === 'atrasado'
                            ? 'text-[12.5px] font-semibold text-rose-600'
                            : 'text-[12.5px] text-slate-600'
                        }
                      >
                        {formatDate(enrollment.dueDate)}
                      </span>
                    </Td>
                  </Tr>
                ))}
            </tbody>
          </TableWrap>
        </Card>
      )}

      {/* ---------------------------- Certificados ----------------------- */}
      {tab === 'certificados' && (
        <Card>
          {learning.certificates.length === 0 ? (
            <EmptyState
              icon="Award"
              title="Nenhum certificado emitido"
              description="Este colaborador ainda não concluiu treinamentos com aprovação na avaliação."
            />
          ) : (
            <TableWrap>
              <thead>
                <tr>
                  <Th>Treinamento</Th>
                  <Th align="center">Carga horária</Th>
                  <Th align="center">Nota</Th>
                  <Th align="center">Emissão</Th>
                  <Th>Código</Th>
                  <Th align="right">Ações</Th>
                </tr>
              </thead>
              <tbody>
                {learning.certificates.map((item) => {
                  const course = learning.items.find(
                    (entry) => entry.course.id === item.courseId,
                  )?.course;
                  return (
                    <Tr key={item.id}>
                      <Td>
                        <span className="text-[13.5px] font-semibold text-navy-900">
                          {course?.title ?? '—'}
                        </span>
                      </Td>
                      <Td align="center">{item.hours}h</Td>
                      <Td align="center">
                        <Badge tone="success">{item.score}%</Badge>
                      </Td>
                      <Td align="center">
                        <span className="text-[12.5px] text-slate-600">
                          {formatDate(item.issuedAt)}
                        </span>
                      </Td>
                      <Td>
                        <span className="font-mono text-[12px] font-semibold text-navy-800">
                          {item.code}
                        </span>
                      </Td>
                      <Td align="right">
                        <Button
                          variant="outline"
                          size="sm"
                          icon="Eye"
                          onClick={() => setCertificate(item)}
                        >
                          Visualizar
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </TableWrap>
          )}
        </Card>
      )}

      {/* ------------------------------- Trilhas ------------------------- */}
      {tab === 'trilhas' && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {myPaths.map((item) => (
            <Card key={item.path.id} className="p-5">
              <div className="flex items-start gap-3">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${item.path.coverFrom}, ${item.path.coverTo})`,
                  }}
                >
                  <Icon name={item.path.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/admin/trilhas/${item.path.id}`}
                    className="block truncate text-[14px] font-bold text-navy-900 transition hover:text-brand-700"
                  >
                    {item.path.title}
                  </Link>
                  <p className="text-[12px] text-slate-500">
                    {item.completed} de {item.courses.length} treinamentos
                  </p>
                </div>
                <span className="shrink-0 text-[13px] font-extrabold tabular-nums text-navy-900">
                  {item.progress}%
                </span>
              </div>
              <ProgressBar
                value={item.progress}
                className="mt-3"
                tone={item.progress === 100 ? 'success' : 'brand'}
              />
            </Card>
          ))}
        </div>
      )}

      {/* ----------------------------- Atividades ------------------------ */}
      {tab === 'atividades' && (
        <Card>
          <CardHeader
            title="Linha do tempo"
            subtitle="Registro completo de atividades do colaborador"
            icon="Activity"
          />
          {learning.activities.length === 0 ? (
            <EmptyState
              compact
              icon="History"
              title="Nenhuma atividade registrada"
              description="Este colaborador ainda não iniciou treinamentos na plataforma."
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {learning.activities.map((activity) => (
                <li key={activity.id} className="flex items-start gap-3 px-5 py-3.5">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700">
                    <Icon
                      name={
                        activity.kind === 'conclusao'
                          ? 'CheckCircle2'
                          : activity.kind === 'certificado'
                            ? 'Award'
                            : activity.kind === 'avaliacao'
                              ? 'ClipboardCheck'
                              : 'PlayCircle'
                      }
                      className="h-4 w-4"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] leading-snug text-slate-600">
                      <strong className="font-semibold text-navy-900">
                        {employee.name.split(' ')[0]}
                      </strong>{' '}
                      {activity.action}{' '}
                      <strong className="font-semibold text-navy-900">{activity.target}</strong>
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-slate-400">
                      {formatDateTime(activity.date)} · {relativeTime(activity.date)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      <Modal
        open={Boolean(certificate)}
        onClose={() => setCertificate(null)}
        title="Certificado do colaborador"
        description="Documento emitido automaticamente pela plataforma."
        size="xl"
        icon="Award"
        footer={
          <Button icon="Printer" onClick={printCertificate}>
            Imprimir certificado
          </Button>
        }
      >
        {certificate && <CertificateSheet certificate={certificate} />}
      </Modal>
    </div>
  );
}
