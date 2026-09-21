import type { CSSProperties } from "react";
import { useInView } from "../hooks/useInView";

interface MeterBarProps {
  /** 0–100. Valores fora da faixa são grampeados. */
  pct: number;
  /** Classe de cor do preenchimento (ex.: "bg-primary-600"). */
  fillClass?: string;
  /** Altura da barra em px — 7 nos KPIs, 9 nos gráficos do design. */
  height?: number;
  delay?: number;
  className?: string;
  /** Rótulo acessível; sem ele a barra fica como decoração. */
  label?: string;
}

/**
 * Barra horizontal do painel: trilho de tinta a 9% e preenchimento verde que
 * cresce da esquerda quando entra na tela.
 */
export default function MeterBar({
  pct,
  fillClass = "bg-primary-600",
  height = 9,
  delay = 0,
  className = "",
  label,
}: MeterBarProps) {
  const value = Math.min(100, Math.max(0, pct));
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-full bg-foreground-950/[0.09] ${className}`}
      style={{ height }}
      role={label ? "progressbar" : undefined}
      aria-label={label}
      aria-valuenow={label ? Math.round(value) : undefined}
      aria-valuemin={label ? 0 : undefined}
      aria-valuemax={label ? 100 : undefined}
    >
      <div
        className={`h-full rounded-full ${fillClass} ${inView ? "animate-bar" : ""}`}
        style={
          {
            width: inView ? `${value}%` : "0%",
            "--w": `${value}%`,
            "--d": `${delay}ms`,
          } as CSSProperties
        }
      />
    </div>
  );
}
