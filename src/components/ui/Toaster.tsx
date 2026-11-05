import { useToastStore } from '@/store/useToastStore';
import { cn } from '@/utils/format';
import { Icon } from './primitives';

const config = {
  success: {
    icon: 'CheckCircle2',
    ring: 'ring-emerald-200',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  error: {
    icon: 'XCircle',
    ring: 'ring-rose-200',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
  },
  info: {
    icon: 'Info',
    ring: 'ring-brand-200',
    bg: 'bg-brand-50',
    text: 'text-brand-700',
  },
};

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed right-4 z-[60] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2.5 sm:right-5 sm:w-[calc(100vw-2.5rem)]"
      style={{ bottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
    >
      {toasts.map((item) => {
        const style = config[item.kind];
        return (
          <div
            key={item.id}
            className="pointer-events-auto flex animate-slide-in-right items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-pop"
          >
            <span
              className={cn(
                'grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ring-inset',
                style.bg,
                style.ring,
                style.text,
              )}
            >
              <Icon name={style.icon} className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-bold text-navy-900">{item.title}</p>
              {item.description && (
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-500">
                  {item.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Fechar aviso"
            >
              <Icon name="X" className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
