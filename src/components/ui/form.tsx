import React from 'react';
import { cn } from '@/utils/format';
import { Icon } from './primitives';

const baseField =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[13.5px] text-slate-800 placeholder:text-slate-400 shadow-sm transition ' +
  'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 disabled:bg-slate-50 disabled:text-slate-400';

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('block', className)}>
      {label && (
        <span className="mb-1.5 flex items-center gap-1 text-[12.5px] font-semibold text-slate-700">
          {label}
          {required && <span className="text-rose-500">*</span>}
        </span>
      )}
      {children}
      {hint && !error && (
        <span className="mt-1 block text-[11.5px] text-slate-400">{hint}</span>
      )}
      {error && (
        <span className="mt-1 flex items-center gap-1 text-[11.5px] font-medium text-rose-600">
          <Icon name="AlertCircle" className="h-3 w-3" />
          {error}
        </span>
      )}
    </label>
  );
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...rest }, ref) => (
  <input ref={ref} className={cn(baseField, 'h-10', className)} {...rest} />
));
Input.displayName = 'Input';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 4, ...rest }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    className={cn(baseField, 'py-2.5 leading-relaxed', className)}
    {...rest}
  />
));
Textarea.displayName = 'Textarea';

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...rest }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(baseField, 'h-10 cursor-pointer appearance-none pr-9', className)}
      {...rest}
    >
      {children}
    </select>
    <Icon
      name="ChevronDown"
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
    />
  </div>
));
Select.displayName = 'Select';

export function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar…',
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn('relative', className)}>
      <Icon
        name="Search"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(baseField, 'h-10 pl-9 pr-9')}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Limpar busca"
        >
          <Icon name="X" className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold text-navy-900">{label}</p>
        {description && (
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-500">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200',
          checked ? 'bg-brand-600' : 'bg-slate-300',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  );
}

export function FilterChip({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition',
        active
          ? 'border-brand-600 bg-brand-600 text-white shadow-sm shadow-brand-600/25'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
      )}
    >
      {children}
      {typeof count === 'number' && (
        <span
          className={cn(
            'rounded px-1 text-[11px] font-bold',
            active ? 'bg-white/20' : 'bg-slate-100 text-slate-500',
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
