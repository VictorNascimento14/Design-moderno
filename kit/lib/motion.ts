// Constantes de movimento do sistema visual.
// A curva e as durações são as mesmas usadas pela coluna lateral;
// centralizá-las aqui evita que cada componente reinvente um número diferente.

import { useEffect, useState } from "react";

/** Curva do design: sai rápido, assenta devagar. */
export const EASE_ORGANIC = "cubic-bezier(0.22, 0.68, 0, 1)";

/** Abrir é mais lento que fechar — abrir é convite, fechar é saída. */
export const DUR_OPEN = 520;
export const DUR_CLOSE = 420;

/**
 * `true` quando o sistema pede menos movimento. Os componentes usam isto para
 * pular contagens progressivas e escalonamentos — o CSS já anula transições,
 * mas animação feita em JS precisa ser desligada aqui.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** Atraso escalonado de entrada, com teto para listas longas não arrastarem. */
export function stagger(index: number, step = 55, max = 420): number {
  return Math.min(index * step, max);
}
