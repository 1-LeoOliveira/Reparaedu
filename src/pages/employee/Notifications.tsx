import React from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  EmptyState,
  Icon,
  PageHeader,
  Tabs,
} from '@/components/ui';
import { useAuthStore } from '@/store/useAuthStore';
import { useDataStore } from '@/store/useDataStore';
import { useMyNotifications } from '@/hooks/useAnalytics';
import { cn, formatDateTime, notificationKindLabel, relativeTime } from '@/utils/format';
import { toast } from '@/store/useToastStore';

const kindStyles: Record<string, { icon: string; className: string }> = {
  novo_curso: { icon: 'Sparkles', className: 'bg-brand-50 text-brand-700' },
  obrigatorio: { icon: 'ShieldAlert', className: 'bg-violet-50 text-violet-700' },
  prazo: { icon: 'Clock', className: 'bg-amber-50 text-amber-700' },
  atrasado: { icon: 'AlertTriangle', className: 'bg-rose-50 text-rose-700' },
  certificado: { icon: 'Award', className: 'bg-emerald-50 text-emerald-700' },
  comunicado: { icon: 'Megaphone', className: 'bg-navy-50 text-navy-700' },
};

export default function EmployeeNotifications() {
  const user = useAuthStore((s) => s.user);
  const { list, unread } = useMyNotifications(user?.id, false);
  const markRead = useDataStore((s) => s.markNotificationRead);
  const markAll = useDataStore((s) => s.markAllNotificationsRead);
  const removeNotification = useDataStore((s) => s.removeNotification);
  const announcements = useDataStore((s) => s.announcements);
  const [tab, setTab] = React.useState('todas');

  const filtered = React.useMemo(() => {
    if (tab === 'nao_lidas') return list.filter((n) => !n.read);
    if (tab === 'comunicados') return list.filter((n) => n.kind === 'comunicado');
    if (tab === 'prazos')
      return list.filter((n) => n.kind === 'prazo' || n.kind === 'atrasado');
    return list;
  }, [list, tab]);

  return (
    <div>
      <PageHeader
        title="Notificações e comunicados"
        description="Avisos sobre treinamentos, prazos, certificados e comunicados institucionais."
        breadcrumbs={[{ label: 'Início', to: '/app' }, { label: 'Notificações' }]}
        actions={
          unread > 0 && (
            <Button
              variant="outline"
              icon="CheckCheck"
              onClick={() => {
                markAll(user?.id);
                toast('Notificações atualizadas', 'Todas foram marcadas como lidas.');
              }}
            >
              Marcar todas como lidas
            </Button>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs
            className="mb-4"
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'todas', label: 'Todas', icon: 'Inbox', count: list.length },
              { id: 'nao_lidas', label: 'Não lidas', icon: 'Mail', count: unread },
              {
                id: 'prazos',
                label: 'Prazos e atrasos',
                icon: 'Clock',
                count: list.filter((n) => n.kind === 'prazo' || n.kind === 'atrasado').length,
              },
              {
                id: 'comunicados',
                label: 'Comunicados',
                icon: 'Megaphone',
                count: list.filter((n) => n.kind === 'comunicado').length,
              },
            ]}
          />

          {filtered.length === 0 ? (
            <Card>
              <EmptyState
                icon="BellOff"
                title="Nenhuma notificação"
                description="Você está em dia. Novos avisos aparecerão aqui automaticamente."
              />
            </Card>
          ) : (
            <Card className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const style = kindStyles[item.kind] ?? kindStyles.comunicado;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      'group flex items-start gap-3.5 px-5 py-4 transition',
                      !item.read && 'bg-brand-50/30',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg',
                        style.className,
                      )}
                    >
                      <Icon name={style.icon} className="h-4 w-4" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[13.5px] font-bold text-navy-900">{item.title}</p>
                        <Badge tone={item.read ? 'neutral' : 'brand'}>
                          {notificationKindLabel[item.kind]}
                        </Badge>
                        {!item.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                        )}
                      </div>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-slate-600">
                        {item.message}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <span className="text-[11.5px] text-slate-400">
                          {formatDateTime(item.date)} · {relativeTime(item.date)}
                        </span>
                        {item.link && (
                          <Link
                            to={item.link}
                            onClick={() => markRead(item.id)}
                            className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-brand-700 transition hover:text-brand-800"
                          >
                            Abrir
                            <Icon name="ArrowRight" className="h-3 w-3" />
                          </Link>
                        )}
                        {!item.read && (
                          <button
                            type="button"
                            onClick={() => markRead(item.id)}
                            className="text-[11.5px] font-semibold text-slate-500 transition hover:text-navy-900"
                          >
                            Marcar como lida
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeNotification(item.id)}
                          className="text-[11.5px] font-semibold text-slate-400 opacity-0 transition group-hover:opacity-100 hover:text-rose-600"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Card>
          )}
        </div>

        {/* ------------------------- Mural de comunicados ---------------- */}
        <div>
          <Card>
            <CardHeader
              title="Mural de comunicados"
              subtitle="Avisos institucionais da empresa"
              icon="Megaphone"
            />
            <ul className="divide-y divide-slate-100">
              {announcements.map((announcement) => (
                <li key={announcement.id} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <Avatar
                      name={announcement.author}
                      src={announcement.authorAvatar}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[13px] font-bold text-navy-900">
                          {announcement.title}
                        </p>
                        {announcement.pinned && (
                          <Badge tone="brand" icon="Pin">
                            Fixado
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-slate-600">
                        {announcement.content}
                      </p>
                      <p className="mt-2 text-[11.5px] text-slate-400">
                        {announcement.author} · {announcement.tag} ·{' '}
                        {relativeTime(announcement.date)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
