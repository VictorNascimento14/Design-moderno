import { useEffect, useRef, useState } from "react";
import { useInView } from "../hooks/useInView";
import { usePrefersReducedMotion } from "../lib/motion";

interface AnimatedNumberProps {
  value: number;
  /** Formatação final — moeda, percentual, contagem. */
  format?: (n: number) => string;
  /** Duração da contagem, em ms. */
  duration?: number;
  /** Atraso antes de começar, em ms. */
  delay?: number;
  className?: string;
}

/** Desaceleração cúbica: quase todo o caminho no primeiro terço do tempo. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Número que conta de zero até o valor quando entra na tela. Sob
 * `prefers-reduced-motion` — ou sem `requestAnimationFrame` — mostra o valor
 * final direto, sem contagem.
 */
export default function AnimatedNumber({
  value,
  format = (n) => String(Math.round(n)),
  duration = 1100,
  delay = 0,
  className = "",
}: AnimatedNumberProps) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [shown, setShown] = useState(reduced ? value : 0);
  const frame = useRef<number>(0);

  useEffect(() => {
    if (reduced || !inView) {
      setShown(value);
      return;
    }

    let start: number | null = null;
    const step = (now: number) => {
      if (start === null) start = now;
      const elapsed = now - start - delay;
      if (elapsed < 0) {
        frame.current = requestAnimationFrame(step);
        return;
      }
      const t = Math.min(1, elapsed / duration);
      setShown(value * easeOutCubic(t));
      if (t < 1) frame.current = requestAnimationFrame(step);
    };

    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [value, duration, delay, inView, reduced]);

  // A contagem muda o texto ~60 vezes por segundo. Dentro de uma região viva
  // (`aria-live`) isso viraria uma enxurrada de anúncios, então o número que
  // anima fica escondido do leitor de tela e o valor final vai num par
  // `sr-only` — que muda uma vez só, quando o dado muda de verdade.
  return (
    <>
      <span ref={ref} aria-hidden="true" className={className}>
        {format(shown)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </>
  );
}
