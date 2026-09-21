import type { CSSProperties, ElementType, ReactNode } from "react";
import { useInView } from "../hooks/useInView";

type Tone = "soft" | "medium" | "strong";

interface GlassCardProps {
  children: ReactNode;
  /** Intensidade do vidro — do design: 0.55 / 0.62 / 0.85 de branco. */
  tone?: Tone;
  /** Levanta no hover. Ligue só em cartão clicável ou de destaque. */
  interactive?: boolean;
  /** Brilho diagonal que atravessa o cartão no hover. */
  sheen?: boolean;
  /** Atraso da entrada, em ms — escalone com `stagger(i)`. */
  delay?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}

const TONE: Record<Tone, string> = {
  soft: "glass",
  medium: "glass-md",
  strong: "glass-strong",
};

/**
 * Cartão de vidro fosco do painel: fundo branco translúcido, desfoque
 * saturado e uma borda clara que simula a quina de luz. Entra subindo assim
 * que aparece na tela.
 */
export default function GlassCard({
  children,
  tone = "soft",
  interactive = false,
  sheen = false,
  delay = 0,
  as: Tag = "div",
  className = "",
  style,
  ...rest
}: GlassCardProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      className={`${TONE[tone]} ${interactive ? "lift" : ""} ${sheen ? "sheen" : ""} ${
        inView ? "animate-rise" : "opacity-0"
      } ${className}`}
      style={{ ...style, "--d": `${delay}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}
