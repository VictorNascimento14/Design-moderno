import { NOME } from "../lib/marca";

interface AvatarProps {
  /** Nome da pessoa. As iniciais e a cor saem daqui. */
  nome: string;
  /** Lado, em px. */
  size?: number;
  /** Imagem, quando houver. Sem ela (ou sem consentimento), ficam as iniciais. */
  src?: string;
  className?: string;
}

/**
 * Disco com as iniciais, na tinta do sistema. A cor é derivada do nome, então
 * a mesma pessoa tem sempre o mesmo tom — e duas pessoas lado a lado quase
 * nunca têm o mesmo.
 *
 * As classes são literais escritas no fonte de propósito: o JIT do Tailwind
 * varre o código-fonte e uma classe montada em runtime nunca é gerada.
 */
const TONS = [
  "bg-secondary-200 text-secondary-800",
  "bg-primary-100 text-primary-800",
  "bg-accent-100 text-accent-800",
  "bg-orange-100 text-orange-700",
  "bg-background-200 text-foreground-700",
];

function hash(texto: string): number {
  let h = 5381;
  for (const ch of texto) h = ((h << 5) + h + ch.charCodeAt(0)) >>> 0;
  return h;
}

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase() || NOME.slice(0, 2).toUpperCase();
}

export default function Avatar({ nome, size = 40, src, className = "" }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={nome}
        width={size}
        height={size}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={`Iniciais de ${nome}`}
      className={`grid shrink-0 place-items-center rounded-full font-bold ${
        TONS[hash(nome.toLowerCase()) % TONS.length]
      } ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.36)) }}
    >
      {iniciais(nome)}
    </span>
  );
}
