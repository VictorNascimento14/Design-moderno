import type { ReactNode } from "react";
import GlassCard from "./GlassCard";
import Glyph from "./Glyph";
import type { GlyphName } from "./Glyph";

/** Paleta dos chips de ícone — verde por padrão, âmbar/vermelho para alerta. */
export type StatTone = "green" | "mint" | "amber" | "red";

const CHIP: Record<StatTone, string> = {
  green: "bg-primary-50 text-primary-800",
  mint: "bg-secondary-100 text-secondary-800",
  amber: "bg-orange-100 text-orange-700",
  red: "bg-red-100 text-red-700",
};

interface StatCardProps {
  /** Rótulo em caixa alta acima do número. */
  label: string;
  /** O número em si — aceita `<AnimatedNumber>`. */
  value: ReactNode;
  /** Ícone do conjunto do design. */
  icon: GlyphName;
  tone?: StatTone;
  /** Linha de apoio embaixo: texto curto, selo ou barra. */
  foot?: ReactNode;
  /** Valores longos (moeda) pedem um corpo menor para não quebrar. */
  compact?: boolean;
  delay?: number;
  className?: string;
}

/**
 * Cartão de indicador do painel — rótulo, ícone em pastilha redonda, número
 * grande e um rodapé livre.
 */
export default function StatCard({
  label,
  value,
  icon,
  tone = "green",
  foot,
  compact = false,
  delay = 0,
  className = "",
}: StatCardProps) {
  return (
    <GlassCard
      interactive
      delay={delay}
      className={`flex flex-col gap-2.5 p-[22px] ${className}`}
    >
      <div className="flex items-center justify-between gap-2.5">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-foreground-500">
          {label}
        </span>
        <span
          className={`grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full ${CHIP[tone]}`}
        >
          <Glyph name={icon} size={17} />
        </span>
      </div>

      <p
        className={`font-bold leading-none tracking-[-0.02em] text-foreground-950 ${
          compact ? "text-[25px] leading-[1.1]" : "text-[34px]"
        }`}
      >
        {value}
      </p>

      {foot && <div className="text-[12.5px] text-foreground-500">{foot}</div>}
    </GlassCard>
  );
}
