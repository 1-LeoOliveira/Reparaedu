import React from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Badge, Button, Icon, Toaster } from '@/components/ui';
import { BrandLockup } from '@/components/Brand';
import { isManager, useAuthStore } from '@/store/useAuthStore';
import { useDataStore } from '@/store/useDataStore';
import { useMyNotifications } from '@/hooks/useAnalytics';
import { cn, firstName, notificationKindLabel, relativeTime } from '@/utils/format';

export interface NavItem {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
  badge?: number;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

function SidebarContent({
  groups,
  variant,
  onNavigate,
}: {
  groups: NavGroup[];
  variant: 'admin' | 'employee';
  onNavigate?: () => void;
}) {
  const settings = useDataStore((s) => s.settings);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col bg-navy-950 text-navy-100">
      <div className="relative shrink-0 overflow-hidden border-b border-white/5 px-5 py-5">
        <div className="absolute inset-0 grid-pattern opacity-60" />
        <Link
          to={variant === 'admin' ? '/admin' : '/app'}
          className="relative block"
          title={settings.companyName}
        >
          <BrandLockup height={30} />
          <span className="mt-2 block text-[9.5px] font-bold uppercase tracking-[0.2em] text-navy-200">
            Universidade Corporativa
          </span>
        </Link>
      </div>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group.title} className="mb-5 last:mb-0">
            <p className="mb-1.5 px-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-navy-400">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition-all duration-150',
                        isActive
                          ? 'bg-white/10 font-semibold text-white'
                          : 'text-navy-200 hover:bg-white/5 hover:text-white',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-repara-orange" />
                        )}
                        <Icon
                          name={item.icon}
                          className={cn(
                            'h-4 w-4 shrink-0 transition-colors',
                            isActive
                              ? 'text-repara-orange-soft'
                              : 'text-navy-300 group-hover:text-repara-orange-soft',
                          )}
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                        {Boolean(item.badge) && (
                          <span className="rounded bg-rose-500 px-1.5 py-0.5 text-[10.5px] font-bold text-white">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/5 p-3">
        {user && (
          <div className="flex items-center gap-2.5 rounded-lg bg-white/5 p-2.5">
            <Avatar name={user.name} src={user.avatar} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-white">{user.name}</p>
              <p className="truncate text-[11px] text-navy-300">{user.jobTitle}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="rounded-md p-1.5 text-navy-300 transition hover:bg-white/10 hover:text-white"
              title="Sair da plataforma"
            >
              <Icon name="LogOut" className="h-4 w-4" />
            </button>
          </div>
        )}
        <p className="mt-2.5 px-1 text-[10.5px] leading-relaxed text-navy-500">
          Ambiente de demonstração · dados fictícios
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Busca global
// ---------------------------------------------------------------------------

function GlobalSearch({ variant }: { variant: 'admin' | 'employee' }) {
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const courses = useDataStore((s) => s.courses);
  const employees = useDataStore((s) => s.employees);
  const paths = useDataStore((s) => s.paths);
  const navigate = useNavigate();
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const normalized = query.trim().toLowerCase();

  const results = React.useMemo(() => {
    if (normalized.length < 2) return [];
    const list: Array<{ id: string; label: string; hint: string; icon: string; to: string }> = [];

    courses
      .filter((c) => c.title.toLowerCase().includes(normalized))
      .slice(0, 5)
      .forEach((course) =>
        list.push({
          id: course.id,
          label: course.title,
          hint: 'Treinamento',
          icon: 'GraduationCap',
          to: variant === 'admin' ? `/admin/treinamentos/${course.id}` : `/app/catalogo/${course.id}`,
        }),
      );

    paths
      .filter((p) => p.title.toLowerCase().includes(normalized))
      .slice(0, 3)
      .forEach((path) =>
        list.push({
          id: path.id,
          label: path.title,
          hint: 'Trilha de aprendizagem',
          icon: 'Route',
          to: variant === 'admin' ? `/admin/trilhas/${path.id}` : `/app/trilhas/${path.id}`,
        }),
      );

    if (variant === 'admin') {
      employees
        .filter((e) => e.name.toLowerCase().includes(normalized))
        .slice(0, 5)
        .forEach((employee) =>
          list.push({
            id: employee.id,
            label: employee.name,
            hint: employee.jobTitle,
            icon: 'User',
            to: `/admin/colaboradores/${employee.id}`,
          }),
        );
    }

    return list;
  }, [normalized, courses, paths, employees, variant]);

  return (
    <div ref={containerRef} className="relative hidden flex-1 max-w-md md:block">
      <Icon
        name="Search"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      />
      <input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={
          variant === 'admin'
            ? 'Buscar treinamentos, colaboradores, trilhas…'
            : 'Buscar treinamentos e trilhas…'
        }
        className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/80 pl-9 pr-3 text-[13px] text-slate-700 placeholder:text-slate-400 transition focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
      {open && normalized.length >= 2 && (
        <div className="absolute left-0 right-0 top-11 z-40 animate-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white shadow-pop">
          {results.length === 0 ? (
            <p className="px-4 py-5 text-center text-[13px] text-slate-500">
              Nenhum resultado para “{query}”.
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1.5">
              {results.map((result) => (
                <li key={`${result.hint}-${result.id}`}>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(result.to);
                      setQuery('');
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition hover:bg-slate-50"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700">
                      <Icon name={result.icon} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-navy-900">
                        {result.label}
                      </span>
                      <span className="block truncate text-[11.5px] text-slate-400">
                        {result.hint}
                      </span>
                    </span>
                    <Icon name="ArrowRight" className="h-3.5 w-3.5 text-slate-300" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Central de notificações
// ---------------------------------------------------------------------------

const kindStyles: Record<string, { icon: string; className: string }> = {
  novo_curso: { icon: 'Sparkles', className: 'bg-brand-50 text-brand-700' },
  obrigatorio: { icon: 'ShieldAlert', className: 'bg-violet-50 text-violet-700' },
  prazo: { icon: 'Clock', className: 'bg-amber-50 text-amber-700' },
  atrasado: { icon: 'AlertTriangle', className: 'bg-rose-50 text-rose-700' },
  certificado: { icon: 'Award', className: 'bg-emerald-50 text-emerald-700' },
  comunicado: { icon: 'Megaphone', className: 'bg-navy-50 text-navy-700' },
};

function NotificationsMenu({ variant }: { variant: 'admin' | 'employee' }) {
  const [open, setOpen] = React.useState(false);
  const user = useAuthStore((s) => s.user);
  const { list, unread } = useMyNotifications(user?.id, variant === 'admin');
  const markRead = useDataStore((s) => s.markNotificationRead);
  const markAll = useDataStore((s) => s.markAllNotificationsRead);
  const navigate = useNavigate();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-navy-800"
        aria-label="Notificações"
      >
        <Icon name="Bell" className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-40 w-[22rem] animate-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white shadow-pop sm:w-96">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-[13.5px] font-bold text-navy-900">Notificações</p>
              <p className="text-[11.5px] text-slate-400">
                {unread > 0 ? `${unread} não lida${unread > 1 ? 's' : ''}` : 'Tudo em ordem'}
              </p>
            </div>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => markAll(variant === 'admin' ? undefined : user?.id)}
                className="text-[12px] font-semibold text-brand-700 transition hover:text-brand-800"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <ul className="max-h-[22rem] divide-y divide-slate-100 overflow-y-auto">
            {list.slice(0, 8).map((item) => {
              const style = kindStyles[item.kind] ?? kindStyles.comunicado;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      markRead(item.id);
                      setOpen(false);
                      navigate(
                        variant === 'admin' ? '/admin/notificacoes' : item.link ?? '/app/notificacoes',
                      );
                    }}
                    className={cn(
                      'flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50',
                      !item.read && 'bg-brand-50/35',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg',
                        style.className,
                      )}
                    >
                      <Icon name={style.icon} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-navy-900">
                          {item.title}
                        </span>
                        {!item.read && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                        )}
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-[12px] leading-relaxed text-slate-500">
                        {item.message}
                      </span>
                      <span className="mt-1 block text-[11px] font-medium text-slate-400">
                        {notificationKindLabel[item.kind]} · {relativeTime(item.date)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
            {list.length === 0 && (
              <li className="px-4 py-8 text-center text-[13px] text-slate-500">
                Nenhuma notificação por aqui.
              </li>
            )}
          </ul>

          <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-2.5">
            <Link
              to={variant === 'admin' ? '/admin/notificacoes' : '/app/notificacoes'}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 text-[12.5px] font-semibold text-brand-700 transition hover:text-brand-800"
            >
              Ver central de notificações
              <Icon name="ArrowRight" className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Menu do usuário
// ---------------------------------------------------------------------------

function UserMenu({ variant }: { variant: 'admin' | 'employee' }) {
  const [open, setOpen] = React.useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!user) return null;
  const manager = isManager(user);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white py-1 pl-1 pr-2 transition hover:border-slate-300"
      >
        <Avatar name={user.name} src={user.avatar} size="xs" />
        <span className="hidden text-left sm:block">
          <span className="block max-w-[9rem] truncate text-[12.5px] font-semibold leading-tight text-navy-900">
            {firstName(user.name)}
          </span>
          <span className="block text-[10.5px] font-medium uppercase tracking-wide text-slate-400">
            {user.role === 'admin' ? 'Administrador' : user.role === 'rh' ? 'Gestão de RH' : 'Colaborador'}
          </span>
        </span>
        <Icon name="ChevronDown" className="h-3.5 w-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-40 w-64 animate-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white shadow-pop">
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
            <Avatar name={user.name} src={user.avatar} size="md" />
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-bold text-navy-900">{user.name}</p>
              <p className="truncate text-[11.5px] text-slate-500">{user.email}</p>
            </div>
          </div>
          <div className="py-1.5">
            <Link
              to="/app/perfil"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-navy-900"
            >
              <Icon name="UserCircle" className="h-4 w-4 text-slate-400" />
              Meu perfil
            </Link>
            {manager && (
              <Link
                to={variant === 'admin' ? '/app' : '/admin'}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-navy-900"
              >
                <Icon name="ArrowLeftRight" className="h-4 w-4 text-slate-400" />
                {variant === 'admin' ? 'Ver como colaborador' : 'Ir para o painel de gestão'}
              </Link>
            )}
            {manager && (
              <Link
                to="/admin/configuracoes"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-navy-900"
              >
                <Icon name="Settings" className="h-4 w-4 text-slate-400" />
                Configurações
              </Link>
            )}
          </div>
          <div className="border-t border-slate-100 p-1.5">
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold text-rose-600 transition hover:bg-rose-50"
            >
              <Icon name="LogOut" className="h-4 w-4" />
              Sair da plataforma
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export function AppLayout({
  groups,
  variant,
}: {
  groups: NavGroup[];
  variant: 'admin' | 'employee';
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  React.useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  return (
    <div className="min-h-viewport bg-slate-50">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[244px] lg:block">
        <SidebarContent groups={groups} variant={variant} />
      </aside>

      {/* Sidebar mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-navy-950/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[268px] animate-slide-in-right">
            <SidebarContent
              groups={groups}
              variant={variant}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="lg:pl-[244px]">
        <header className="no-print sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:hidden"
              aria-label="Abrir menu"
            >
              <Icon name="Menu" className="h-4 w-4" />
            </button>

            <GlobalSearch variant={variant} />

            <div className="ml-auto flex items-center gap-2">
              <Badge tone={variant === 'admin' ? 'navy' : 'brand'} icon="Presentation" className="hidden sm:inline-flex">
                {variant === 'admin' ? 'Painel de gestão' : 'Ambiente do colaborador'}
              </Badge>
              {variant === 'employee' && user && isManager(user) && (
                <Link to="/admin" className="hidden sm:block">
                  <Button variant="outline" size="sm" icon="LayoutDashboard">
                    Painel de gestão
                  </Button>
                </Link>
              )}
              <NotificationsMenu variant={variant} />
              <UserMenu variant={variant} />
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto w-full max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>

      <Toaster />
    </div>
  );
}
