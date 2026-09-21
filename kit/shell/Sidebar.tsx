import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Dropdown from "../base/Dropdown";
import Glyph from "../base/Glyph";
import Avatar from "../base/Avatar";
import { DUR_CLOSE, DUR_OPEN, EASE_ORGANIC, stagger } from "../lib/motion";
import {
  RAIL_WIDTH_COLLAPSED,
  RAIL_WIDTH_OPEN,
  setRailPeek,
  setSidebarCollapsed,
  useRailPeek,
  useSidebarCollapsed,
} from "../lib/sidebarCollapsed";
import { NOME } from "../lib/marca";
import BrandMark from "./BrandMark";
import { itemAtivo, type Conta, type GrupoNav, type ItemNav } from "./navegacao";

interface SidebarProps {
  /** Seções da coluna. Um grupo só é o caso comum. */
  grupos: GrupoNav[];
  /** Bloco do pé da coluna. Sem ele, a coluna termina na navegação. */
  conta?: Conta;
  /** Sem esta função, o botão "Sair" não aparece. */
  onSair?: () => void;
  /** Gaveta do celular — o estado mora no `RailLayout`. */
  mobileOpen?: boolean;
  onClose?: () => void;
  /** Substitui o monograma padrão (um `<img>`, um SVG próprio). */
  logo?: ReactNode;
}

/**
 * Coluna lateral flutuante: 76px recolhida, 236px aberta, vidro sobre o fundo
 * e cantos de 28px. Monte-a UMA vez, no `RailLayout` — remontá-la a cada troca
 * de tela recria os botões e mata hover, foco e a espiada.
 */
export default function Sidebar({ grupos, conta, onSair, mobileOpen, onClose, logo }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Colapso fixado (preferência persistida) e espiada por hover são coisas
  // diferentes: a primeira é escolha do usuário, a segunda dura enquanto o
  // mouse está em cima. As duas movem a coluna E a página — quem desloca o
  // conteúdo é o CSS, a partir do estado que o store grava no `<html>`.
  // `aberta` é a união das duas.
  const collapsed = useSidebarCollapsed();
  const espiando = useRailPeek();
  const aberta = !collapsed || espiando;

  // Trocar de aba não desmonta a coluna (ela mora no `RailLayout`); ela só
  // desmonta quando se sai das telas que a têm. Sem zerar a espiada aqui, a
  // volta encontraria a coluna aberta sem o mouse em cima.
  useEffect(() => () => setRailPeek(false), []);

  // Alternância das dobras de seção — mapa de exceções: sem clique, a seção
  // nasce aberta; o clique alterna o valor.
  const [dobras, setDobras] = useState<Record<string, boolean>>({});

  // Travar/liberar o scroll do corpo quando a gaveta móvel abre.
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function isActive(item: ItemNav) {
    return itemAtivo(item, location.pathname);
  }

  function handleNav(path: string) {
    navigate(path);
    onClose?.();
  }

  const primeiroNome = conta?.nome.split(" ")[0] ?? "";
  const perfilAtivo = !!conta?.href && location.pathname.startsWith(conta.href);
  const avatar = conta ? (
    conta.avatar ?? <Avatar nome={conta.nome} size={32} />
  ) : null;

  /* ── Coreografia ────────────────────────────────────────────────────────
     Abrir é mais lento que fechar. Os rótulos não aparecem junto com a
     largura: cada um entra 38ms depois do anterior, 90ms depois da coluna
     começar a abrir — é o escalonamento que dá a sensação de "desdobrar".
     Ao fechar, todos somem juntos e rápido, senão a saída arrasta.
     ─────────────────────────────────────────────────────────────────────── */
  const dur = aberta ? DUR_OPEN : DUR_CLOSE;

  /** Estilo do rótulo que aparece/some, escalonado pela posição `i`. */
  function fade(i: number, extra?: CSSProperties): CSSProperties {
    const delay = aberta ? 90 + i * 38 : 0;
    return {
      whiteSpace: "nowrap",
      minWidth: 0,
      overflow: "hidden",
      flex: "none",
      opacity: aberta ? 1 : 0,
      maxWidth: aberta ? 170 : 0,
      transform: aberta ? "translateX(0)" : "translateX(-8px)",
      transition:
        `opacity ${aberta ? 300 : 200}ms ease ${delay}ms,` +
        ` max-width ${dur}ms ${EASE_ORGANIC} ${aberta ? i * 26 : 0}ms,` +
        ` transform ${aberta ? 480 : 260}ms ${EASE_ORGANIC} ${delay}ms`,
      ...extra,
    };
  }

  /** Base do item de navegação: pílula larga aberta, quadrado 46 recolhido. */
  const alturaItem = aberta ? 44 : 46;
  const larguraItem = aberta ? "100%" : 46;
  const raioItem = aberta ? 999 : 16;
  const itemBase: CSSProperties = {
    display: "flex",
    alignItems: "center",
    fontSize: "13.5px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    boxSizing: "border-box",
    transition:
      `background-color 200ms ease, color 200ms ease,` +
      ` transform 160ms ${EASE_ORGANIC},` +
      ` width ${dur}ms ${EASE_ORGANIC}, height ${dur}ms ${EASE_ORGANIC},` +
      ` padding ${dur}ms ${EASE_ORGANIC}, gap ${dur}ms ${EASE_ORGANIC},` +
      ` border-radius ${dur}ms ${EASE_ORGANIC}`,
    width: larguraItem,
    height: alturaItem,
    borderRadius: raioItem,
    ...(aberta
      ? {
          gap: 11,
          padding: "11px 13px",
          justifyContent: "flex-start",
        }
      : {
          gap: 0,
          padding: 0,
          justifyContent: "center",
          alignSelf: "center",
        }),
  };

  const railStyle: CSSProperties = {
    width: aberta ? RAIL_WIDTH_OPEN : RAIL_WIDTH_COLLAPSED,
    padding: aberta ? "20px 14px" : "16px 14px",
    // Pelas variáveis do vidro, e não por branco fixo: em `style` não há
    // variante `dark:`, e é assim que a coluna acompanha o tema escuro.
    backgroundColor: `rgb(var(--glass-tint) / ${aberta ? 0.85 : 0.6})`,
    borderColor: "rgb(var(--glass-edge) / 0.78)",
    boxShadow: `0 12px 30px rgb(var(--glass-ink) / ${aberta ? 0.14 : 0.09})`,
    transition:
      `width ${dur}ms ${EASE_ORGANIC}, padding ${dur}ms ${EASE_ORGANIC},` +
      ` background-color ${dur}ms ease, box-shadow ${dur}ms ease`,
  };

  /** Ícone e rótulo do item — o mesmo desenho no botão e na cópia clara que
   *  o marcador revela por cima dele. */
  function conteudoItem(item: ItemNav, index: number) {
    return (
      <>
        <Glyph name={item.icon} className="shrink-0" />
        <span style={fade(index)}>{item.label}</span>
      </>
    );
  }

  /** Item de navegação. A pílula verde profunda do ativo não é dele: é o
   *  marcador, que desliza de um item a outro (ver a navegação abaixo).
   *
   *  Função chamada, não componente: declarado como componente dentro do
   *  render, cada render da coluna (a espiada, a troca de tela) criava um
   *  tipo novo e remontava todos os botões — perdia foco, hover e clique. */
  function itemNav(item: ItemNav, index: number) {
    const ativo = isActive(item);
    return (
      <button
        type="button"
        onClick={() => handleNav(item.path)}
        aria-current={ativo ? "page" : undefined}
        title={aberta ? undefined : item.label}
        style={itemBase}
        className={`press cursor-pointer outline-offset-2 ${
          ativo
            ? "font-semibold text-primary-900"
            : "text-foreground-600 hover:bg-primary-900/[0.07] hover:text-primary-900"
        }`}
      >
        {conteudoItem(item, index)}
      </button>
    );
  }

  const navContent = (
    <>
      {/* Marca + botão de fixar/soltar a coluna */}
      <div
        className="flex items-center overflow-hidden pb-[18px] pt-1"
        style={{
          justifyContent: aberta ? "flex-start" : "center",
          paddingLeft: aberta ? 10 : 0,
          transition: `padding ${dur}ms ${EASE_ORGANIC}`,
        }}
      >
        {logo ?? <BrandMark size={28} />}
        {/* Margem só com a coluna aberta: recolhida, uma margem de rótulo de
            largura zero desloca a marca para fora do eixo dos ícones. */}
        <span style={fade(0, { marginLeft: aberta ? 10 : 0 })}>
          <span className="text-[15px] font-extrabold tracking-[0.05em] text-primary-900">{NOME}</span>
        </span>
        <button
          type="button"
          onClick={() => {
            const proximo = !collapsed;
            setSidebarCollapsed(proximo);
            if (proximo) setRailPeek(false);
          }}
          aria-label={collapsed ? "Fixar o menu aberto" : "Recolher o menu"}
          className="press grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-lg text-foreground-500 transition-colors hover:bg-primary-900/[0.07] hover:text-primary-900"
          style={{
            opacity: aberta ? 1 : 0,
            pointerEvents: aberta ? "auto" : "none",
            maxWidth: aberta ? 28 : 0,
            marginLeft: aberta ? "auto" : 0,
            marginRight: aberta ? 4 : 0,
            transition: `opacity ${aberta ? 300 : 160}ms ease ${aberta ? 200 : 0}ms, max-width ${dur}ms ${EASE_ORGANIC}, background-color 200ms ease`,
          }}
        >
          <Glyph
            name="panel-left"
            size={16}
            style={{
              transform: collapsed ? "rotate(180deg)" : "none",
              transition: `transform ${dur}ms ${EASE_ORGANIC}`,
            }}
          />
        </button>
      </div>

      {/* Navegação por grupos */}
      <nav className="scrollbar-hide flex min-h-0 flex-col gap-1.5 overflow-y-auto overflow-x-hidden">
        {grupos.map((grupo) => {
          const dobrada = !(dobras[grupo.chave] ?? true);
          const indiceAtivo = grupo.itens.findIndex((item) => isActive(item));
          // Posição do marcador: conta, não medida — medir durante a
          // transição da coluna devolveria a altura de partida. 0.375rem é o
          // `gap-1.5` e o `pt-1.5` da lista.
          const topoMarcador = `calc(0.375rem + ${Math.max(indiceAtivo, 0)} * (${alturaItem}px + 0.375rem))`;
          const marcador: CSSProperties = {
            width: larguraItem,
            height: alturaItem,
            borderRadius: raioItem,
            // O item recolhido é centrado e o aberto encosta à esquerda, e a
            // troca é instantânea: a margem troca junto, e o marcador cresce
            // e encolhe exatamente como o item.
            marginLeft: aberta ? 0 : "auto",
            marginRight: "auto",
            transform: `translateY(${topoMarcador})`,
            transition:
              `transform ${dur}ms ${EASE_ORGANIC}, width ${dur}ms ${EASE_ORGANIC},` +
              ` height ${dur}ms ${EASE_ORGANIC}, border-radius ${dur}ms ${EASE_ORGANIC}`,
          };
          return (
            <div key={grupo.chave} className="flex flex-col">
              <button
                type="button"
                onClick={() => setDobras((m) => ({ ...m, [grupo.chave]: dobrada }))}
                aria-expanded={!dobrada}
                className="flex cursor-pointer items-center justify-between text-left"
                style={fade(0, {
                  padding: "0 10px 8px",
                  display: "flex",
                  maxWidth: aberta ? 220 : 0,
                })}
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground-500">
                  {grupo.rotulo}
                </span>
                <Glyph
                  name="chevron-down"
                  size={13}
                  className="text-foreground-400"
                  style={{
                    transform: dobrada ? "rotate(-90deg)" : "none",
                    transition: `transform 240ms ${EASE_ORGANIC}`,
                  }}
                />
              </button>

              {/* A dobra só vale com a coluna aberta: recolhida, os ícones
                  precisam continuar acessíveis. O `pt-1.5` faz o papel do
                  antigo `gap` e some junto quando a seção dobra. */}
              <Dropdown open={!(dobrada && aberta)}>
                <div className="relative isolate flex flex-col gap-1.5 pt-1.5">
                  {grupo.itens.map((item, i) => (
                    <div key={item.key} className="dropdown-item flex flex-col">
                      {itemNav(item, i)}
                    </div>
                  ))}

                  {/* Marcador do item ativo: desliza até o item novo em vez
                      de o destaque apagar num e acender no outro. São duas
                      camadas com a mesma geometria: a sombra, atrás dos
                      itens, e por cima deles a pílula com uma cópia clara dos
                      itens, recortada na faixa do marcador. Assim o texto fica
                      claro exatamente onde o marcador está, em qualquer quadro
                      do deslize, sem clarear antes de ele chegar. Ficam por
                      último para não mexer no `:nth-child` que escalona a
                      entrada dos itens. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 -z-10 bg-primary-900 shadow-nav-active"
                    style={{ ...marcador, opacity: indiceAtivo < 0 ? 0 : 1 }}
                  />
                  <div
                    aria-hidden="true"
                    inert
                    className="pointer-events-none absolute inset-0 isolate flex flex-col gap-1.5 pt-1.5"
                    style={{
                      clipPath: `inset(${topoMarcador} 0 calc(100% - ${topoMarcador} - ${alturaItem}px) 0)`,
                      opacity: indiceAtivo < 0 ? 0 : 1,
                      transition: `clip-path ${dur}ms ${EASE_ORGANIC}, opacity 200ms ease`,
                    }}
                  >
                    {grupo.itens.map((item, i) => (
                      <div key={item.key} className="dropdown-item flex flex-col">
                        <div
                          style={itemBase}
                          className={`text-primary-50 ${i === indiceAtivo ? "font-semibold" : ""}`}
                        >
                          {conteudoItem(item, i)}
                        </div>
                      </div>
                    ))}
                    <span className="absolute inset-x-0 top-0 -z-10 bg-primary-900" style={marcador} />
                  </div>
                </div>
              </Dropdown>
            </div>
          );
        })}
      </nav>

      {/* Conta + sair */}
      {(conta || onSair) && <div className="mx-1.5 mb-3 mt-3.5 h-px shrink-0 bg-foreground-950/10" />}
      {conta && (
        <button
          type="button"
          onClick={() => conta.href && handleNav(conta.href)}
          disabled={!conta.href}
          aria-current={perfilAtivo ? "page" : undefined}
          aria-label={conta.papel ? `${conta.nome}, ${conta.papel}` : conta.nome}
          title={aberta ? undefined : conta.nome}
          className={`press mb-1.5 flex min-h-[44px] shrink-0 items-center gap-2.5 overflow-hidden rounded-[16px] py-1.5 outline-offset-2 ${
            conta.href ? "cursor-pointer" : ""
          } ${perfilAtivo ? "bg-primary-900/[0.07]" : conta.href ? "hover:bg-primary-900/[0.07]" : ""}`}
          style={{
            justifyContent: aberta ? "flex-start" : "center",
            paddingLeft: aberta ? 10 : 0,
            transition:
              `padding ${dur}ms ${EASE_ORGANIC}, background-color 200ms ease,` + ` transform 160ms ${EASE_ORGANIC}`,
          }}
        >
          {avatar}
          <span style={fade(7, { display: "flex", flexDirection: "column", lineHeight: 1.25, textAlign: "left" })}>
            <span className="text-[12.5px] font-semibold text-foreground-900">{primeiroNome}</span>
            {conta.papel && <span className="text-[11px] text-foreground-500">{conta.papel}</span>}
          </span>
        </button>
      )}
      {onSair && (
        <button
          type="button"
          onClick={onSair}
          title={aberta ? undefined : "Sair da conta"}
          style={itemBase}
          className="press shrink-0 cursor-pointer font-semibold text-red-700 transition-colors hover:bg-red-100"
        >
          <Glyph name="logout" size={17} className="shrink-0" />
          <span style={fade(8)}>Sair da conta</span>
        </button>
      )}
    </>
  );

  return (
    <>
      {/* Coluna flutuante do desktop — vidro sobre o fundo, cantos de 28px,
          altura do próprio conteúdo e centrada na vertical. Recolhida mede
          76px; a espiada por hover a leva a 236px e a página reflui junto. */}
      <aside
        onMouseEnter={() => setRailPeek(true)}
        onMouseLeave={() => setRailPeek(false)}
        onFocusCapture={() => setRailPeek(true)}
        onBlurCapture={(e) => {
          // Com o mouse em cima, perder o foco não é sair da coluna: clicar
          // numa parte sem botão manda o foco para o `body`, e o Chrome
          // dispara o blur de um botão focado enquanto o remove.
          const coluna = e.currentTarget;
          if (!coluna.contains(e.relatedTarget as Node | null) && !coluna.matches(":hover")) {
            setRailPeek(false);
          }
        }}
        aria-label="Menu lateral"
        style={railStyle}
        className="fixed left-4 top-1/2 z-40 hidden max-h-[calc(100vh-2rem)] -translate-y-1/2 flex-col overflow-hidden rounded-rail border backdrop-blur-[22px] backdrop-saturate-[1.3] md:flex print:hidden"
      >
        {navContent}
      </aside>

      {/* Véu da gaveta móvel */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/45 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Gaveta móvel — mesma linguagem, sempre em largura cheia */}
      <aside
        aria-label="Menu"
        aria-hidden={!mobileOpen}
        className={`glass-strong fixed bottom-3 left-3 top-3 z-50 flex w-[264px] flex-col overflow-hidden p-[18px_14px] transition-transform duration-500 ease-organic md:hidden print:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-[110%]"
        }`}
      >
        <div className="mb-4 flex items-center justify-between pl-2.5">
          {logo ?? <BrandMark size={28} showWordmark />}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="press grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-primary-900/[0.07] text-foreground-700 transition-colors hover:bg-primary-900/[0.14]"
          >
            <Glyph name="close" size={16} />
          </button>
        </div>

        <nav className="scrollbar-hide flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto">
          {grupos.map((grupo) => (
            <div key={grupo.chave} className="flex flex-col gap-1.5">
              <p className="px-2.5 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground-500">
                {grupo.rotulo}
              </p>
              {grupo.itens.map((item, i) => {
                const ativo = isActive(item);
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleNav(item.path)}
                    aria-current={ativo ? "page" : undefined}
                    style={mobileOpen ? ({ "--d": `${120 + stagger(i, 42)}ms` } as CSSProperties) : undefined}
                    className={`press flex h-11 cursor-pointer items-center gap-[11px] rounded-full px-[13px] text-[13.5px] transition-colors ${
                      mobileOpen ? "animate-rise" : ""
                    } ${
                      ativo
                        ? "bg-primary-900 font-semibold text-primary-50 shadow-nav-active"
                        : "text-foreground-600 hover:bg-primary-900/[0.07]"
                    }`}
                  >
                    <Glyph name={item.icon} className="shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {(conta || onSair) && <div className="mx-1.5 mb-3 mt-3.5 h-px bg-foreground-950/10" />}
        {conta && (
          <button
            type="button"
            onClick={() => conta.href && handleNav(conta.href)}
            disabled={!conta.href}
            aria-current={perfilAtivo ? "page" : undefined}
            aria-label={conta.papel ? `${conta.nome}, ${conta.papel}` : conta.nome}
            className={`press mb-1.5 flex min-h-[44px] w-full items-center gap-2.5 rounded-full py-1.5 pl-2.5 pr-3 text-left transition-colors ${
              conta.href ? "cursor-pointer" : ""
            } ${perfilAtivo ? "bg-primary-900/[0.07]" : conta.href ? "hover:bg-primary-900/[0.07]" : ""}`}
          >
            {avatar}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-foreground-900">{primeiroNome}</p>
              {conta.papel && <p className="text-[11px] text-foreground-500">{conta.papel}</p>}
            </div>
            {conta.href && (
              <Glyph name="chevron-down" size={14} className="shrink-0 -rotate-90 text-foreground-500" />
            )}
          </button>
        )}
        {onSair && (
          <button
            type="button"
            onClick={onSair}
            className="press flex h-11 w-full cursor-pointer items-center gap-[11px] rounded-full px-[13px] text-[13.5px] font-semibold text-red-700 transition-colors hover:bg-red-100"
          >
            <Glyph name="logout" size={17} className="shrink-0" />
            Sair da conta
          </button>
        )}
      </aside>
    </>
  );
}
