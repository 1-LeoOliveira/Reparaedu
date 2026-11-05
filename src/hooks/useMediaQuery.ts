import { useEffect, useState } from 'react';

/**
 * Observa uma media query do CSS a partir do React.
 *
 * Usado para ajustar propriedades que não podem ser definidas por classe —
 * principalmente larguras de eixo dos gráficos, que o Recharts recebe como
 * número em pixels.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(list.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Telas de celular — iPhone 14 tem 390px de largura. */
export const useIsMobile = () => useMediaQuery('(max-width: 639px)');
