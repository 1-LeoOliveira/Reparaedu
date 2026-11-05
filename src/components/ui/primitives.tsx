import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import { FallbackIcon, iconRegistry } from './icons';
import { cn, initials } from '@/utils/format';

// ---------------------------------------------------------------------------
// Ícone dinâmico (resolve pelo nome vindo dos dados)
// ---------------------------------------------------------------------------

type IconName = string;

export function Icon({
  name,
  className,
  strokeWidth = 1.9,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  const Component = iconRegistry[name] ?? FallbackIcon;
  return <Component className={className} strokeWidth={strokeWidth} />;
}

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'subtle'
  | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm shadow-brand-600/20',
  secondary:
    'bg-navy-800 text-white hover:bg-navy-900 active:bg-navy-950 shadow-sm shadow-navy-900/20',
  outline:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  subtle: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-600/20',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
  icon: 'h-9 w-9 justify-center',
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconRight,
      loading,
      className,
      children,
      disabled,
      ...rest
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center rounded-lg font-semibold transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-55',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        icon && <Icon name={icon} className="h-4 w-4 shrink-0" />
      )}
      {children}
      {iconRight && <Icon name={iconRight} className="h-4 w-4 shrink-0" />}
    </button>
  ),
);
Button.displayName = 'Button';

export function LinkButton({
  to,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  className,
  children,
}: {
  to: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex items-center rounded-lg font-semibold transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {icon && <Icon name={icon} className="h-4 w-4 shrink-0" />}
      {children}
      {iconRight && <Icon name={iconRight} className="h-4 w-4 shrink-0" />}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

export type BadgeTone =
  | 'neutral'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'navy'
  | 'purple';

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  danger: 'bg-rose-50 text-rose-700 ring-rose-200',
  info: 'bg-sky-50 text-sky-700 ring-sky-200',
  navy: 'bg-navy-50 text-navy-800 ring-navy-200',
  purple: 'bg-violet-50 text-violet-700 ring-violet-200',
};

export function Badge({
  tone = 'neutral',
  icon,
  children,
  className,
}: {
  tone?: BadgeTone;
  icon?: IconName;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11.5px] font-semibold ring-1 ring-inset',
        toneClasses[tone],
        className,
      )}
    >
      {icon && <Icon name={icon} className="h-3 w-3" strokeWidth={2.2} />}
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

export function Card({
  className,
  children,
  hover,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200/80 bg-white shadow-card',
        hover && 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  icon,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  icon?: IconName;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700">
            <Icon name={icon} className="h-4 w-4" />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-bold tracking-tight text-navy-900">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-[13px] leading-snug text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

const avatarSizes = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
};

export function Avatar({
  name,
  src,
  size = 'md',
  className,
  ring,
}: {
  name: string;
  src?: string;
  size?: keyof typeof avatarSizes;
  className?: string;
  ring?: boolean;
}) {
  const [failed, setFailed] = React.useState(false);
  const showImage = src && !failed;

  return (
    <span
      className={cn(
        'relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-navy-100 font-bold text-navy-700',
        ring && 'ring-2 ring-white',
        avatarSizes[size],
        className,
      )}
      title={name}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Progresso
// ---------------------------------------------------------------------------

export function ProgressBar({
  value,
  tone = 'brand',
  size = 'md',
  className,
}: {
  value: number;
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'navy';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const tones = {
    brand: 'bg-brand-600',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    navy: 'bg-navy-800',
  };
  const heights = { sm: 'h-1', md: 'h-1.5', lg: 'h-2.5' };
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-full bg-slate-100',
        heights[size],
        className,
      )}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-700', tones[tone])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function RadialProgress({
  value,
  size = 112,
  stroke = 9,
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, value) / 100) * circumference;

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-slate-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-brand-600 transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-xl font-extrabold tracking-tight text-navy-900">
            {label ?? `${Math.round(value)}%`}
          </div>
          {sublabel && (
            <div className="text-[10.5px] font-medium uppercase tracking-wide text-slate-400">
              {sublabel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// StatCard
// ---------------------------------------------------------------------------

export function StatCard({
  label,
  value,
  icon,
  tone = 'brand',
  hint,
  trend,
  onClick,
}: {
  label: string;
  value: React.ReactNode;
  icon: IconName;
  tone?: 'brand' | 'navy' | 'success' | 'warning' | 'danger' | 'purple';
  hint?: string;
  trend?: { value: number; label?: string };
  onClick?: () => void;
}) {
  const tones = {
    brand: 'bg-brand-50 text-brand-700',
    navy: 'bg-navy-50 text-navy-800',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-rose-50 text-rose-700',
    purple: 'bg-violet-50 text-violet-700',
  };

  return (
    <Card
      hover={Boolean(onClick)}
      onClick={onClick}
      className={cn('p-5', onClick && 'cursor-pointer')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12.5px] font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-[26px] font-extrabold leading-none tracking-tight text-navy-900">
            {value}
          </p>
          {hint && <p className="mt-2 text-[12.5px] text-slate-500">{hint}</p>}
          {trend && (
            <p
              className={cn(
                'mt-2 inline-flex items-center gap-1 text-[12.5px] font-semibold',
                trend.value >= 0 ? 'text-emerald-600' : 'text-rose-600',
              )}
            >
              <Icon
                name={trend.value >= 0 ? 'TrendingUp' : 'TrendingDown'}
                className="h-3.5 w-3.5"
              />
              {trend.value >= 0 ? '+' : ''}
              {trend.value}%
              {trend.label && (
                <span className="font-medium text-slate-400">{trend.label}</span>
              )}
            </p>
          )}
        </div>
        <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-lg', tones[tone])}>
          <Icon name={icon} className="h-5 w-5" />
        </span>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Capa de treinamento / trilha
// ---------------------------------------------------------------------------

export function CourseCover({
  icon,
  from,
  to,
  className,
  iconClassName,
  children,
}: {
  icon: IconName;
  from: string;
  to: string;
  className?: string;
  iconClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
    >
      <div
        className="absolute inset-0 opacity-[0.17]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 22%, #fff 1.1px, transparent 1.2px), radial-gradient(circle at 68% 72%, #fff 1.1px, transparent 1.2px)',
          backgroundSize: '22px 22px, 28px 28px',
        }}
      />
      <div className="absolute -right-7 -top-9 h-28 w-28 rounded-full bg-white/10" />
      <div className="absolute -bottom-10 -left-6 h-24 w-24 rounded-full bg-black/10" />
      <Icon
        name={icon}
        className={cn(
          'absolute right-4 top-1/2 h-16 w-16 -translate-y-1/2 text-white/25',
          iconClassName,
        )}
        strokeWidth={1.4}
      />
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Estados auxiliares
// ---------------------------------------------------------------------------

export function EmptyState({
  icon = 'SearchX',
  title,
  description,
  action,
  compact,
}: {
  icon?: IconName;
  title: string;
  description?: string;
  action?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'px-4 py-10' : 'px-6 py-16',
      )}
    >
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-400">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-[15px] font-bold text-navy-900">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-[13.5px] leading-relaxed text-slate-500">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-slate-100',
        'after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.6s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/70 after:to-transparent',
        className,
      )}
    />
  );
}

export function PageLoader({ label = 'Carregando informações…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24">
      <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
      <p className="text-[13.5px] font-medium text-slate-500">{label}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Breadcrumbs e cabeçalho de página
// ---------------------------------------------------------------------------

export function Breadcrumbs({
  items,
}: {
  items: Array<{ label: string; to?: string }>;
}) {
  return (
    <nav aria-label="Trilha de navegação" className="flex items-center gap-1.5 text-[12.5px]">
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {item.to && !last ? (
              <Link
                to={item.to}
                className="font-medium text-slate-500 transition hover:text-brand-700"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  'truncate',
                  last ? 'font-semibold text-navy-800' : 'font-medium text-slate-500',
                )}
              >
                {item.label}
              </span>
            )}
            {!last && <ChevronRight className="h-3.5 w-3.5 text-slate-300" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  children,
}: {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; to?: string }>;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 animate-fade-up">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-3">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[23px] font-extrabold tracking-tight text-navy-900 sm:text-[26px]">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 max-w-3xl text-[14px] leading-relaxed text-slate-500">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

export function Tabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: Array<{ id: string; label: string; icon?: IconName; count?: number }>;
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex gap-1 overflow-x-auto border-b border-slate-200 pb-px',
        className,
      )}
    >
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative inline-flex shrink-0 items-center gap-2 rounded-t-lg px-3.5 py-2.5 text-[13.5px] font-semibold transition-colors',
              active
                ? 'text-brand-700'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800',
            )}
          >
            {tab.icon && <Icon name={tab.icon} className="h-4 w-4" />}
            {tab.label}
            {typeof tab.count === 'number' && (
              <span
                className={cn(
                  'rounded px-1.5 py-0.5 text-[11px] font-bold',
                  active ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-500',
                )}
              >
                {tab.count}
              </span>
            )}
            {active && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-600" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabela
// ---------------------------------------------------------------------------

export function TableWrap({
  children,
  className,
  minWidth = 720,
}: {
  children: React.ReactNode;
  className?: string;
  /**
   * Largura mínima da tabela em pixels. Abaixo dela o container rola na
   * horizontal, em vez de espremer as colunas — comportamento necessário em
   * telas de celular, onde uma tabela de muitas colunas ficaria ilegível.
   */
  minWidth?: number;
}) {
  return (
    <div className={cn('scrollbar-thin overflow-x-auto', className)}>
      <table
        className="w-full border-collapse text-left text-[13.5px]"
        style={{ minWidth }}
      >
        {children}
      </table>
    </div>
  );
}

export function Th({
  children,
  className,
  align = 'left',
}: {
  children?: React.ReactNode;
  className?: string;
  align?: 'left' | 'right' | 'center';
}) {
  return (
    <th
      className={cn(
        'whitespace-nowrap border-b border-slate-200 bg-slate-50/70 px-4 py-2.5 text-[11.5px] font-bold uppercase tracking-wide text-slate-500',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
  align = 'left',
  colSpan,
}: {
  children?: React.ReactNode;
  className?: string;
  align?: 'left' | 'right' | 'center';
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      className={cn(
        'border-b border-slate-100 px-4 py-3 align-middle text-slate-700',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className,
      )}
    >
      {children}
    </td>
  );
}

export function Tr({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'transition-colors hover:bg-slate-50/80',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Divider / seção
// ---------------------------------------------------------------------------

export function SectionTitle({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: IconName;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy-800 text-white">
            <Icon name={icon} className="h-4 w-4" />
          </span>
        )}
        <div>
          <h2 className="text-[17px] font-extrabold tracking-tight text-navy-900">
            {title}
          </h2>
          {description && (
            <p className="text-[13px] text-slate-500">{description}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}
