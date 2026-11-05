import React from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  ConfirmDialog,
  EmptyState,
  Icon,
  Modal,
  PageHeader,
  StatCard,
  Tabs,
} from '@/components/ui';
import { Field, Input, Select, Textarea, Toggle } from '@/components/ui/form';
import { useAuthStore } from '@/store/useAuthStore';
import { useDataStore } from '@/store/useDataStore';
import { useMyNotifications } from '@/hooks/useAnalytics';
import { toast } from '@/store/useToastStore';
import { cn, formatDateTime, notificationKindLabel, relativeTime } from '@/utils/format';
import type { Announcement } from '@/types';

const kindStyles: Record<string, { icon: string; className: string }> = {
  novo_curso: { icon: 'Sparkles', className: 'bg-brand-50 text-brand-700' },
  obrigatorio: { icon: 'ShieldAlert', className: 'bg-violet-50 text-violet-700' },
  prazo: { icon: 'Clock', className: 'bg-amber-50 text-amber-700' },
  atrasado: { icon: 'AlertTriangle', className: 'bg-rose-50 text-rose-700' },
  certificado: { icon: 'Award', className: 'bg-emerald-50 text-emerald-700' },
  comunicado: { icon: 'Megaphone', className: 'bg-navy-50 text-navy-700' },
};

const tagOptions = [
  'Institucional',
  'Segurança',
  'Treinamentos',
  'Compliance',
  'Eventos',
  'Recursos Humanos',
];

export default function AdminNotifications() {
  const user = useAuthStore((s) => s.user);
  const notifications = useDataStore((s) => s.notifications);
  const announcements = useDataStore((s) => s.announcements);
  const markRead = useDataStore((s) => s.markNotificationRead);
  const markAll = useDataStore((s) => s.markAllNotificationsRead);
  const removeNotification = useDataStore((s) => s.removeNotification);
  const addAnnouncement = useDataStore((s) => s.addAnnouncement);
  const removeAnnouncement = useDataStore((s) => s.removeAnnouncement);
  const { unread } = useMyNotifications(user?.id, true);

  const [tab, setTab] = React.useState('comunicados');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [confirm, setConfirm] = React.useState<Announcement | null>(null);
  const [form, setForm] = React.useState({
    title: '',
    content: '',
    tag: tagOptions[0],
    pinned: false,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const byKind = (kind: string) => notifications.filter((n) => n.kind === kind);

  const feed = React.useMemo(() => {
    if (tab === 'alertas')
      return notifications.filter((n) => n.kind === 'atrasado' || n.kind === 'prazo');
    if (tab === 'sistema')
      return notifications.filter(
        (n) => n.kind === 'novo_curso' || n.kind === 'obrigatorio' || n.kind === 'certificado',
      );
    return notifications;
  }, [notifications, tab]);

  const publish = () => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = 'Informe o título do comunicado.';
    if (!form.content.trim()) next.content = 'Escreva o conteúdo do comunicado.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    addAnnouncement({
      title: form.title,
      content: form.content,
      tag: form.tag,
      pinned: form.pinned,
      author: user?.name ?? 'Recursos Humanos',
      authorAvatar: user?.avatar ?? '',
    });
    toast(
      'Comunicado publicado',
      'Todos os colaboradores receberão a notificação na plataforma.',
    );
    setForm({ title: '', content: '', tag: tagOptions[0], pinned: false });
    setModalOpen(false);
    setTab('comunicados');
  };

  return (
    <div>
      <PageHeader
        title="Notificações e comunicados"
        description="Central de avisos da plataforma e publicação de comunicados institucionais para os colaboradores."
        breadcrumbs={[{ label: 'Painel de gestão', to: '/admin' }, { label: 'Notificações' }]}
        actions={
          <>
            {unread > 0 && (
              <Button
                variant="outline"
                icon="CheckCheck"
                onClick={() => {
                  markAll();
                  toast('Notificações atualizadas', 'Todas foram marcadas como lidas.');
                }}
              >
                Marcar como lidas
              </Button>
            )}
            <Button icon="Megaphone" onClick={() => setModalOpen(true)}>
              Novo comunicado
            </Button>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Notificações ativas"
          value={notifications.length}
          icon="Bell"
          tone="navy"
          hint={`${unread} não lidas`}
        />
        <StatCard
          label="Alertas de atraso"
          value={byKind('atrasado').length}
          icon="AlertTriangle"
          tone="danger"
          hint="Prazos vencidos de treinamentos"
        />
        <StatCard
          label="Prazos próximos"
          value={byKind('prazo').length}
          icon="Clock"
          tone="warning"
          hint="Vencimento nos próximos dias"
        />
        <StatCard
          label="Comunicados publicados"
          value={announcements.length}
          icon="Megaphone"
          tone="brand"
          hint="Visíveis a todos os colaboradores"
        />
      </div>

      <Tabs
        className="mb-5"
        value={tab}
        onChange={setTab}
        tabs={[
          {
            id: 'comunicados',
            label: 'Comunicados',
            icon: 'Megaphone',
            count: announcements.length,
          },
          {
            id: 'alertas',
            label: 'Alertas de prazo',
            icon: 'AlertTriangle',
            count: byKind('atrasado').length + byKind('prazo').length,
          },
          {
            id: 'sistema',
            label: 'Avisos do sistema',
            icon: 'Sparkles',
            count:
              byKind('novo_curso').length +
              byKind('obrigatorio').length +
              byKind('certificado').length,
          },
          { id: 'todas', label: 'Todas', icon: 'Inbox', count: notifications.length },
        ]}
      />

      {/* ----------------------------- Comunicados ----------------------- */}
      {tab === 'comunicados' ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {announcements.length === 0 ? (
            <Card className="lg:col-span-2">
              <EmptyState
                icon="Megaphone"
                title="Nenhum comunicado publicado"
                description="Publique avisos institucionais para toda a base de colaboradores."
                action={
                  <Button icon="Megaphone" onClick={() => setModalOpen(true)}>
                    Novo comunicado
                  </Button>
                }
              />
            </Card>
          ) : (
            announcements.map((announcement) => (
              <Card key={announcement.id} className="flex flex-col p-5">
                <div className="flex items-start gap-3">
                  <Avatar
                    name={announcement.author}
                    src={announcement.authorAvatar}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[14.5px] font-bold text-navy-900">
                        {announcement.title}
                      </h3>
                      {announcement.pinned && (
                        <Badge tone="brand" icon="Pin">
                          Fixado
                        </Badge>
                      )}
                      <Badge tone="neutral">{announcement.tag}</Badge>
                    </div>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-600">
                      {announcement.content}
                    </p>
                    <p className="mt-2.5 text-[11.5px] text-slate-400">
                      {announcement.author} · {formatDateTime(announcement.date)} ·{' '}
                      {relativeTime(announcement.date)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfirm(announcement)}
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    title="Excluir comunicado"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      ) : (
        <Card>
          {feed.length === 0 ? (
            <EmptyState
              icon="BellOff"
              title="Nenhuma notificação nesta categoria"
              description="Novos avisos aparecerão aqui automaticamente conforme a movimentação da plataforma."
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {feed.slice(0, 60).map((item) => {
                const style = kindStyles[item.kind] ?? kindStyles.comunicado;
                return (
                  <li
                    key={item.id}
                    className={cn(
                      'group flex items-start gap-3.5 px-5 py-3.5 transition',
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
                      </div>
                      <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-600">
                        {item.message}
                      </p>
                      <p className="mt-1.5 text-[11.5px] text-slate-400">
                        {formatDateTime(item.date)} · {relativeTime(item.date)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {!item.read && (
                        <button
                          type="button"
                          onClick={() => markRead(item.id)}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-navy-800"
                          title="Marcar como lida"
                        >
                          <Icon name="Check" className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeNotification(item.id)}
                        className="rounded-lg p-1.5 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600"
                        title="Remover"
                      >
                        <Icon name="X" className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      )}

      {/* -------------------------- Novo comunicado ---------------------- */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Publicar comunicado institucional"
        description="O comunicado aparecerá no painel inicial e na central de notificações de todos os colaboradores."
        icon="Megaphone"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button icon="Send" onClick={publish}>
              Publicar comunicado
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Título" required error={errors.title}>
            <Input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="Ex.: Campanha de reciclagem da NR-10"
            />
          </Field>
          <Field label="Conteúdo" required error={errors.content}>
            <Textarea
              rows={6}
              value={form.content}
              onChange={(event) => setForm({ ...form, content: event.target.value })}
              placeholder="Escreva a mensagem que será enviada aos colaboradores…"
            />
          </Field>
          <Field label="Categoria">
            <Select
              value={form.tag}
              onChange={(event) => setForm({ ...form, tag: event.target.value })}
            >
              {tagOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </Field>
          <div className="rounded-xl border border-slate-200 px-4">
            <Toggle
              checked={form.pinned}
              onChange={(value) => setForm({ ...form, pinned: value })}
              label="Fixar comunicado"
              description="Comunicados fixados aparecem em destaque no topo do mural."
            />
          </div>
          <div className="flex items-start gap-2.5 rounded-lg border border-brand-200 bg-brand-50/60 px-3.5 py-3">
            <Icon name="Info" className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
            <p className="text-[12px] leading-relaxed text-slate-600">
              Será enviada uma notificação para{' '}
              <strong className="font-semibold text-navy-900">
                todos os colaboradores ativos
              </strong>{' '}
              da plataforma. Assinado por {user?.name}.
            </p>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm) {
            removeAnnouncement(confirm.id);
            toast('Comunicado removido', confirm.title, 'info');
          }
        }}
        title="Excluir comunicado"
        message={`Tem certeza que deseja excluir o comunicado "${confirm?.title}"? Ele deixará de ser exibido aos colaboradores.`}
        confirmLabel="Excluir comunicado"
      />
    </div>
  );
}
