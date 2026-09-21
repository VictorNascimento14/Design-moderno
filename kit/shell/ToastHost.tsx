import { useEffect, useState } from "react";

import Glyph from "../base/Glyph";
import { assinarToasts, type Toast } from "../lib/toast";

/**
 * Pilha de avisos no canto superior direito. Monte uma vez, na raiz do app —
 * `toast("Salvo")` de qualquer lugar cai aqui.
 */
export default function ToastHost() {
  const [avisos, setAvisos] = useState<Toast[]>([]);

  useEffect(
    () =>
      assinarToasts((t) => {
        setAvisos((prev) => [...prev, t]);
        setTimeout(() => setAvisos((prev) => prev.filter((x) => x.id !== t.id)), t.duracao ?? 5000);
      }),
    [],
  );

  if (avisos.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm space-y-3">
      {avisos.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={t.onClick}
          className="glass-strong lift press animate-rise pointer-events-auto flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-100 text-primary-800">
            <Glyph name={t.onClick ? "bell" : "check-double"} size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground-950">{t.titulo}</p>
            {t.corpo && <p className="mt-0.5 text-xs text-foreground-500">{t.corpo}</p>}
          </div>
        </button>
      ))}
    </div>
  );
}
