import React from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  Icon,
  PageHeader,
  ProgressBar,
  RadialProgress,
  StatCard,
  TableWrap,
  Td,
  Th,
  Tr,
} from '@/components/ui';
import { Field, Input, Toggle } from '@/components/ui/form';
import { StatusBadge } from '@/components/shared';
import { useAuthStore } from '@/store/useAuthStore';
import { useDataStore } from '@/store/useDataStore';
import { useEmployeeLearning, usePathsProgress } from '@/hooks/useAnalytics';
import { toast } from '@/store/useToastStore';
import { formatDate, formatHours, formatMinutes, relativeTime } from '@/utils/format';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const employees = useDataStore((s) => s.employees);
  const departments = useDataStore((s) => s.departments);
  const learning = useEmployeeLearning(user?.id);
  const paths = usePathsProgress(user?.id);

  const employee = employees.find((e) => e.id === user?.id);
  const department = departments.find((d) => d.id === user?.departmentId);

  const [notifyEmail, setNotifyEmail] = React.useState(true);
  const [notifyDeadlines, setNotifyDeadlines] = React.useState(true);
  const [notifyNews, setNotifyNews] = React.useState(false);

  if (!user) return null;

  const myPaths = paths.filter(
    (item) => !item.path.departmentId || item.path.departmentId === user.departmentId,
  );

  return (
    <div>
      <PageHeader
        title="Meu perfil"
        description="Seus dados cadastrais, histórico de aprendizagem e preferências de notificação."
        breadcrumbs={[{ label: 'Início', to: '/app' }, { label: 'Meu perfil' }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ------------------------------ Lateral ----------------------- */}
        <div className="space-y-5">
          <Card className="overflow-hidden">
            <div className="relative h-24 bg-navy-950">
              <div className="absolute inset-0 grid-pattern opacity-60" />
              <div
                className="absolute -right-10 -top-12 h-40 w-40 rounded-full blur-2xl"
                style={{
                  background: 'radial-gradient(circle, rgba(37,99,235,0.45), transparent 70%)',
                }}
              />
            </div>
            <div className="-mt-10 px-5 pb-5 text-center">
              <Avatar
                name={user.name}
                src={user.avatar}
                size="xl"
                ring
                className="mx-auto ring-4 ring-white"
              />
              <h2 className="mt-3 text-[17px] font-extrabold tracking-tight text-navy-900">
                {user.name}
              </h2>
              <p className="text-[13px] text-slate-500">{user.jobTitle}</p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                {department && (
                  <Badge tone="navy" icon="Building2">
                    {department.name}
                  </Badge>
                )}
                <Badge tone={employee?.status === 'ativo' ? 'success' : 'warning'}>
                  {employee?.status === 'ativo' ? 'Ativo' : 'Em afastamento'}
                </Badge>
              </div>

              <dl className="mt-5 space-y-2.5 text-left">
                {[
                  { icon: 'Mail', label: 'E-mail', value: user.email },
                  { icon: 'Phone', label: 'Telefone', value: employee?.phone ?? '—' },
                  {
                    icon: 'BadgeCheck',
                    label: 'Matrícula',
                    value: employee?.registration ?? '—',
                  },
                  {
                    icon: 'CalendarDays',
                    label: 'Admissão',
                    value: formatDate(employee?.admissionDate),
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-2.5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500">
                      <Icon name={row.icon} className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">
                        {row.label}
                      </p>
                      <p className="truncate text-[12.5px] font-medium text-navy-900">
                        {row.value}
                      </p>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </Card>

          <Card>
            <CardHeader title="Resumo de aprendizagem" icon="GraduationCap" />
            <div className="flex flex-col items-center px-5 py-6">
              <RadialProgress value={learning.progress} sublabel="conclusão" />
              <div className="mt-5 w-full space-y-3">
                {[
                  {
                    label: 'Treinamentos concluídos',
                    value: `${learning.completed}/${learning.total}`,
                  },
                  { label: 'Horas de capacitação', value: formatHours(learning.minutes) },
                  { label: 'Certificados', value: learning.certificates.length },
                  { label: 'Pendências', value: learning.pending },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-3 text-[12.5px]"
                  >
                    <span className="text-slate-500">{row.label}</span>
                    <span className="font-bold tabular-nums text-navy-900">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Preferências de notificação" icon="BellRing" />
            <div className="divide-y divide-slate-100 px-5 py-1">
              <Toggle
                checked={notifyEmail}
                onChange={(value) => {
                  setNotifyEmail(value);
                  toast('Preferência atualizada', 'Notificações por e-mail.');
                }}
                label="Receber por e-mail"
                description="Resumo semanal dos treinamentos pendentes."
              />
              <Toggle
                checked={notifyDeadlines}
                onChange={(value) => {
                  setNotifyDeadlines(value);
                  toast('Preferência atualizada', 'Alertas de prazo.');
                }}
                label="Alertas de prazo"
                description="Aviso quando um treinamento obrigatório estiver próximo do vencimento."
              />
              <Toggle
                checked={notifyNews}
                onChange={(value) => {
                  setNotifyNews(value);
                  toast('Preferência atualizada', 'Novos treinamentos.');
                }}
                label="Novos treinamentos"
                description="Notificar sobre conteúdos publicados no catálogo."
              />
            </div>
          </Card>
        </div>

        {/* ------------------------------ Conteúdo ---------------------- */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Conclusão geral"
              value={`${learning.progress}%`}
              icon="Target"
              tone="brand"
            />
            <StatCard
              label="Horas acumuladas"
              value={formatHours(learning.minutes)}
              icon="Clock"
              tone="success"
            />
            <StatCard
              label="Certificados"
              value={learning.certificates.length}
              icon="Award"
              tone="warning"
            />
          </div>

          <Card>
            <CardHeader
              title="Histórico de treinamentos"
              subtitle="Todos os treinamentos atribuídos à sua função"
              icon="History"
            />
            <TableWrap>
              <thead>
                <tr>
                  <Th>Treinamento</Th>
                  <Th>Situação</Th>
                  <Th>Progresso</Th>
                  <Th align="center">Nota</Th>
                  <Th align="right">Conclusão</Th>
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
                          to={`/app/catalogo/${course.id}`}
                          className="group block min-w-0"
                        >
                          <span className="block truncate text-[13.5px] font-semibold text-navy-900 transition group-hover:text-brand-700">
                            {course.title}
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
                      <Td align="right">
                        <span className="text-[12.5px] text-slate-600">
                          {formatDate(enrollment.completedAt)}
                        </span>
                      </Td>
                    </Tr>
                  ))}
              </tbody>
            </TableWrap>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader title="Minhas trilhas" icon="Route" />
              <ul className="divide-y divide-slate-100">
                {myPaths.map((item) => (
                  <li key={item.path.id} className="px-5 py-3.5">
                    <Link to={`/app/trilhas/${item.path.id}`} className="group block">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-[13px] font-semibold text-navy-900 transition group-hover:text-brand-700">
                          {item.path.title}
                        </p>
                        <span className="shrink-0 text-[12.5px] font-bold tabular-nums text-navy-800">
                          {item.progress}%
                        </span>
                      </div>
                      <ProgressBar
                        value={item.progress}
                        size="sm"
                        className="mt-2"
                        tone={item.progress === 100 ? 'success' : 'brand'}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <CardHeader title="Atividades recentes" icon="Activity" />
              <ul className="divide-y divide-slate-100">
                {learning.activities.slice(0, 8).map((activity) => (
                  <li key={activity.id} className="px-5 py-3">
                    <p className="text-[12.5px] leading-snug text-slate-600">
                      Você {activity.action}{' '}
                      <strong className="font-semibold text-navy-900">
                        {activity.target}
                      </strong>
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {relativeTime(activity.date)}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card>
            <CardHeader
              title="Dados cadastrais"
              subtitle="Informações mantidas pela área de Recursos Humanos"
              icon="UserCog"
              action={
                <Button
                  variant="outline"
                  size="sm"
                  icon="Send"
                  onClick={() =>
                    toast(
                      'Solicitação registrada',
                      'A área de RH foi notificada sobre o pedido de atualização.',
                    )
                  }
                >
                  Solicitar atualização
                </Button>
              }
            />
            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
              <Field label="Nome completo">
                <Input value={user.name} disabled />
              </Field>
              <Field label="E-mail corporativo">
                <Input value={user.email} disabled />
              </Field>
              <Field label="Cargo">
                <Input value={user.jobTitle} disabled />
              </Field>
              <Field label="Departamento">
                <Input value={department?.name ?? '—'} disabled />
              </Field>
              <Field label="Matrícula">
                <Input value={employee?.registration ?? '—'} disabled />
              </Field>
              <Field label="Data de admissão">
                <Input value={formatDate(employee?.admissionDate)} disabled />
              </Field>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
