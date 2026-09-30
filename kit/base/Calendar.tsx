import { useState } from "react";

interface CalendarProps {
  /** Dias com marca, em `AAAA-MM-DD`. */
  marcados?: string[];
  onDayClick?: (date: Date) => void;
}

import { diaISO } from "../lib/data";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

function gradeDoMes(ano: number, mes: number) {
  const primeiro = new Date(ano, mes, 1);
  const recuo = primeiro.getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const dias: (Date | null)[] = [];
  for (let i = 0; i < recuo; i++) dias.push(null);
  for (let d = 1; d <= diasNoMes; d++) dias.push(new Date(ano, mes, d));
  while (dias.length % 7 !== 0) dias.push(null);
  return dias;
}

/** Calendário mensal na linguagem do sistema: hoje é a pílula verde profunda,
 *  dia marcado é a pílula clara com o ponto embaixo. */
export default function Calendar({ marcados = [], onDayClick }: CalendarProps) {
  const agora = new Date();
  const [ano, setAno] = useState(agora.getFullYear());
  const [mes, setMes] = useState(agora.getMonth());

  const grade = gradeDoMes(ano, mes);
  const hoje = diaISO(new Date());
  const rotuloMes = new Date(ano, mes, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  function mesAnterior() {
    if (mes === 0) {
      setMes(11);
      setAno((a) => a - 1);
    } else {
      setMes((m) => m - 1);
    }
  }

  function mesSeguinte() {
    if (mes === 11) {
      setMes(0);
      setAno((a) => a + 1);
    } else {
      setMes((m) => m + 1);
    }
  }

  const navClass =
    "glass-pill press flex h-10 w-10 cursor-pointer items-center justify-center text-foreground-700 transition-colors hover:text-primary-800";

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={mesAnterior} className={navClass} aria-label="Mês anterior">
          <i className="ri-arrow-left-s-line" aria-hidden="true" />
        </button>
        {/* `first-letter:uppercase`, não `capitalize`: este faria "Setembro De 2026". */}
        <span className="inline-block text-[17px] font-bold tracking-[-0.01em] text-foreground-950 first-letter:uppercase">
          {rotuloMes}
        </span>
        <button type="button" onClick={mesSeguinte} className={navClass} aria-label="Próximo mês">
          <i className="ri-arrow-right-s-line" aria-hidden="true" />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 text-center">
        {DIAS_SEMANA.map((d, i) => (
          <span
            key={`${d}-${i}`}
            className="py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-foreground-500"
          >
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {grade.map((data, i) => {
          if (!data) return <div key={`vazio-${i}`} className="h-10" />;
          const dia = diaISO(data);
          const ehHoje = dia === hoje;
          const marcado = marcados.includes(dia);
          return (
            <button
              key={dia}
              type="button"
              onClick={() => onDayClick?.(data)}
              className={`press relative mx-auto flex h-10 w-10 max-w-full cursor-pointer items-center justify-center rounded-full text-sm transition-colors
                ${ehHoje ? "bg-primary-900 font-semibold text-primary-50 shadow-nav-active" : ""}
                ${marcado && !ehHoje ? "bg-secondary-200 font-semibold text-secondary-800 hover:bg-secondary-300" : ""}
                ${!ehHoje && !marcado ? "text-foreground-700 hover:bg-primary-900/[0.07]" : ""}
              `}
            >
              {data.getDate()}
              {marcado && !ehHoje && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
