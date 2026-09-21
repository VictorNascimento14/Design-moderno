# Bloco para o CLAUDE.md / AGENTS.md do projeto

Copie daqui para baixo. É a versão curta das invariantes de `DESIGN-SYSTEM.md`, escrita para ser lida
antes de editar — não para explicar o visual.

---

## 🎨 Sistema visual — invariantes que já custaram bug

O app usa o sistema "vidro orgânico" (`src/ui/`). A fundação é `src/ui/index.css` +
`tailwind.config.ts`; os primitivos, `src/ui/base/`; a casca, `src/ui/shell/`.

1. **As rampas de cor são OKLCH crus (`L C H`)**, consumidos como `oklch(var(--token) /
   <alpha-value>)`. Mudar uma rampa em `src/ui/index.css` **repinta o app inteiro** — é a alavanca
   certa para retonalizar, e a errada para ajustar uma tela.
2. **`text-foreground-400` é decorativo.** Sobre o vidro claro ele dá ~3:1 e reprova o AA. Texto
   informativo pequeno usa no mínimo `text-foreground-500`.
3. **Preenchimento de barra abaixo de `primary-500` some no trilho.** A escala usada é
   `primary-800..500`.
4. **`animation-fill-mode` é `backwards`, nunca `both`.** Com `both`, o último quadro fica aplicado
   para sempre — e animação vence declaração normal na cascata, então o `transform` congelado **anula
   o `:hover` do `.lift`**.
5. **Classe do Tailwind montada em runtime não existe.** O JIT varre o código-fonte; um
   `` `md:pl-[${n}px]` `` nunca é gerado. Ou o literal está escrito no fonte, ou a regra mora no CSS.
6. **As utilidades `.glass*` já trazem o próprio raio** (26px / 28px). Sobrescrever com um `rounded-*`
   ao lado é redundância ou briga.
7. **O deslocamento do conteúdo pela coluna lateral é CSS puro.** `sidebarMdClass()` devolve
   `.rail-offset`; o estado real mora em `html[data-rail]` (`collapsed` / `peek` / `open`), escrito
   por `src/ui/lib/sidebarCollapsed.ts`. Nenhuma página assina store para isso.
8. **`focus:outline-none` sem anel substituto apaga o foco.** Só use com um `focus:ring-*` junto.
9. **`<Button>` tem `type="button"` por padrão** de propósito: sem isso ele vira `submit` dentro de um
   `<form>`. Quem precisa enviar passa `type="submit"` explícito.
10. **`AnimatedNumber` é `aria-hidden` com o valor final em `sr-only`.** Ele muda o texto ~60×/s;
    dentro de uma região `aria-live` isso vira enxurrada de anúncios. Não remova o par.
11. **`useInView` usa `threshold: 0`.** Com fração, um cartão mais alto que a viewport nunca atinge o
    limiar e fica preso em `opacity-0`. Quem decide o disparo é o `rootMargin`.
12. **Ícone: `Glyph` só onde o design define** (navegação, pastilha de indicador, status principal);
    Remix Icon no resto. Nunca os dois lado a lado no mesmo agrupamento visual.
13. **Todo dropdown desdobra ao abrir e dobra ao fechar — automático, não opcional.**
    - **`<select>`** herda sozinho pelo CSS do `::picker(select)` (só Chrome/Edge; os outros mostram a
      lista do sistema, que não aceita animação).
    - **Painel próprio** usa **`<Dropdown open>`**, com `.dropdown-item` em cada item. O índice do
      escalonamento sai da posição (`:nth-child`) — item nenhum precisa de `style`.
    - **Nunca `{open && <painel/>}`**: desmontar mata a animação de saída. O painel fica montado, e o
      `<Dropdown>` o põe `inert` quando fechado.
    - **Tempos em `--dd-*`**, de propósito mais lentos que a coluna. Não mexa em
      `--dur-open`/`--dur-close`, que movem a coluna.
    - **A pseudo-classe vai no select** (`select:open::picker(select)`): `::picker(select):popover-open`
      derruba o `build` no minificador, mesmo com o navegador aceitando.
14. **Toda tela com coluna lateral é filha da rota do `RailLayout` e passa pelo `PageShell`.** O
    layout monta a coluna uma vez (invariante 16); o `PageShell` dá o cabeçalho que gruda no topo e a
    barra de baixo do celular. A página entrega só o `<main>` — com `w-full` se usar `mx-auto`.
    **Tela com coluna não tem rodapé**: montar um desloca o conteúdo duas vezes.
15. **Nada `fixed` dentro de `.glass*`.** O `backdrop-filter` do vidro vira o bloco de contenção de
    todo descendente `fixed`: um véu de "clicar fora" mede o tamanho do cartão, não a tela. Clicar
    fora é `mousedown` no `document` testando `ref.contains`; véu ou modal de verdade sai por portal.
16. **Clicar num item da coluna não a recolhe, não a pisca e não a redesenha: só o marcador de fundo
    desliza até o item novo.** Com a coluna recolhida, ela abre com o mouse em cima e só recolhe
    quando ele sai.
    - **A coluna é montada uma vez, pelo `RailLayout`.** Quando cada tela montava a própria, todo
      clique a recriava: os itens repetiam a entrada, a coluna sumia e a espiada zerava.
    - **O marcador é conta, não medida**: `translateY(0.375rem + i × (altura + 0.375rem))`. Medir
      durante a transição da coluna devolve a altura de partida. São duas camadas: a sombra atrás dos
      itens e, por cima, a pílula com uma cópia clara recortada (`clip-path`) na faixa do marcador.
    - **Item de lista é função chamada (`itemNav(item, i)`), nunca componente declarado no render.**
      Cada render criava um tipo novo e remontava os botões: perdia foco, hover e clique.
    - **O Chrome dispara `blur` no botão focado enquanto o remove**, ainda em `:hover`. Por isso o
      `onBlurCapture` da coluna só recolhe a espiada se ela não estiver em `:hover`.

**Antes de abrir PR:** nenhuma rampa mudou para ajustar uma tela · nenhuma classe montada em runtime ·
todo `focus:outline-none` com anel · dropdown novo é `<select>` ou `<Dropdown open>` · tela nova é
filha do `RailLayout` com `PageShell` e sem rodapé · nada `fixed` dentro de `.glass*`.
