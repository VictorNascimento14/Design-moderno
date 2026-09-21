import { MONOGRAMA, NOME } from "../lib/marca";

interface BrandMarkProps {
  /** Diâmetro do monograma, em px. */
  size?: number;
  /** Mostra o logotipo escrito ao lado do monograma. */
  showWordmark?: boolean;
  className?: string;
}

/**
 * Monograma da marca: disco verde profundo com a inicial e, opcionalmente, o
 * logotipo escrito. Funciona nos dois estados da coluna — o disco sozinho cabe
 * nos 76px recolhidos.
 *
 * Trocar por um SVG próprio é a mudança mais comum do sistema: mantenha a
 * assinatura (`size`, `showWordmark`) e o resto continua encaixando.
 */
export default function BrandMark({ size = 28, showWordmark = false, className = "" }: BrandMarkProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className="grid shrink-0 place-items-center rounded-full bg-primary-900 font-extrabold text-primary-50"
        style={{ width: size, height: size, fontSize: size * 0.43 }}
        aria-hidden="true"
      >
        {MONOGRAMA}
      </span>
      {showWordmark && (
        <span className="text-[15px] font-extrabold tracking-[0.05em] text-primary-900">{NOME}</span>
      )}
      <span className="sr-only">{NOME}</span>
    </span>
  );
}
