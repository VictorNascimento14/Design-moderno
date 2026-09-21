import { useLocation, useNavigate } from "react-router-dom";

import Glyph from "../base/Glyph";
import { itemAtivo, type ItemNav } from "./navegacao";

interface BottomNavProps {
  itens: ItemNav[];
}

export default function BottomNav({ itens }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Seis itens não cabem em 390px sem cortar rótulo. Acima de cinco, o excesso
  // sai da barra e segue na coluna e na gaveta, que não têm esse limite.
  const visiveis = itens.slice(0, 5);
  if (visiveis.length === 0) return null;

  return (
    // A barra não tem fundo próprio: o que flutua sobre o gradiente é a cápsula
    // de vidro lá dentro. O recuo inferior respeita a área segura do aparelho.
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-2 md:hidden"
    >
      <div className="glass-strong mx-auto flex max-w-lg rounded-full p-1.5">
        {visiveis.map((item) => {
          const ativo = itemAtivo(item, location.pathname);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => navigate(item.path)}
              aria-current={ativo ? "page" : undefined}
              className={`press flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-1 rounded-full py-2 text-[11px] font-medium transition-colors ${
                ativo
                  ? "bg-primary-900 font-semibold text-primary-50 shadow-nav-active"
                  : "text-foreground-500 hover:text-primary-900"
              }`}
            >
              <Glyph name={item.icon} size={19} />
              <span className="max-w-full truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
