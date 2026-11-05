import { cn } from '@/utils/format';

/**
 * Marca Repara Edu.
 *
 * Os arquivos ficam em /public:
 *  - repara-edu-logo.png  → lockup horizontal (fundo navy #09132a)
 *  - favicon.png          → símbolo quadrado (beca + R)
 *
 * Como os arquivos possuem fundo sólido navy, o lockup é sempre aplicado
 * sobre superfícies navy-950, garantindo encaixe perfeito.
 */

export const BRAND_NAVY = '#09132a';
export const BRAND_ORANGE = '#e8551f';

/** Símbolo quadrado da marca, usado como ícone/avatar da plataforma. */
export function BrandMark({
  size = 40,
  className,
  rounded = 'rounded-xl',
}: {
  size?: number;
  className?: string;
  rounded?: string;
}) {
  return (
    <span
      className={cn(
        'inline-grid shrink-0 place-items-center overflow-hidden',
        rounded,
        className,
      )}
      style={{ width: size, height: size, background: BRAND_NAVY }}
    >
      <img
        src="/favicon.png"
        alt="Repara Edu"
        width={size}
        height={size}
        className="h-full w-full object-contain"
        style={{ transform: 'scale(1.08)' }}
      />
    </span>
  );
}

/** Lockup horizontal completo — aplicar somente sobre fundo navy. */
export function BrandLockup({
  className,
  height = 38,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <img
      src="/repara-edu-logo.png"
      alt="Repara Edu"
      className={cn('w-auto select-none', className)}
      style={{ height }}
      draggable={false}
    />
  );
}

/** Marca + descritor da plataforma, usado na sidebar e no cabeçalho de acesso. */
export function BrandSignature({
  tone = 'dark',
  size = 40,
}: {
  tone?: 'dark' | 'light';
  size?: number;
}) {
  return (
    <span className="flex items-center gap-3">
      <BrandMark size={size} />
      <span className="min-w-0">
        <span
          className={cn(
            'block truncate text-[15px] font-extrabold leading-tight tracking-tight',
            tone === 'dark' ? 'text-white' : 'text-navy-900',
          )}
        >
          Repara Edu
        </span>
        <span
          className={cn(
            'block truncate text-[10px] font-bold uppercase tracking-[0.16em]',
            tone === 'dark' ? 'text-repara-orange-soft' : 'text-repara-orange',
          )}
        >
          Universidade Corporativa
        </span>
      </span>
    </span>
  );
}
