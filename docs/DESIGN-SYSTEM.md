# Sistema visual "vidro orgânico"

> Verde profundo sobre uma base quase branca esverdeada, cartões de vidro fosco, pílulas e uma
> coluna lateral flutuante que desdobra. Nasceu no design `Painel COMINT` (Claude Design) e foi
> endurecido em ~40 telas.
>
> **Este documento não é uma descrição do visual — é a lista do que quebra quando alguém mexe.**
> Cada invariante abaixo é um bug que já aconteceu, não boa prática genérica.

---

## 1. O que é fundação e o que é tela

| Camada | Onde | Alcance de uma mudança |
|---|---|---|
| Rampas de cor, vidro, movimento, animações | `src/ui/index.css` | **O app inteiro.** |
| Tokens do Tailwind (cores, raios, sombras, curvas) | `tailwind.config.ts` | O app inteiro. |
| Primitivos | `src/ui/base/` | Todo lugar que usa o componente. |
| Casca (coluna, cabeçalho, moldura) | `src/ui/shell/` | Todas as telas com coluna. |
| Tela | `src/paginas/` | Só ela. |

**Regra que resume:** ajustar *uma tela* nunca se faz na fundação. Mudar a rampa `primary` para
acertar um cartão repinta os outros trinta — e o estrago só aparece dias depois.

---

## 2. Cor

As rampas são **OKLCH cru** (`L C H`, sem função em volta), porque o `tailwind.config.ts` as consome
como `oklch(var(--token) / <alpha-value>)` — é isso que faz `text-primary-900/70` funcionar.

```css
--primary-900: 0.28 0.05 160;   /* ✅ cru */
--primary-900: oklch(0.28 0.05 160);  /* ❌ quebra toda opacidade do Tailwind */
```

Sete rampas de 50 a 950: `background`, `foreground`, `primary`, `secondary`, `accent`, `red`,
`orange`. Mais quatro variáveis em **RGB** (`r g b`), porque entram em `rgb(… / α)` dentro de
`style` e de `box-shadow`:

| Variável | Para quê |
|---|---|
| `--glass-tint` | o branco do vidro |
| `--glass-edge` | a "quina de luz" da borda |
| `--glass-ink` | a tinta da sombra — esverdeada, nunca preto puro |
| `--nav-ink` | a sombra do item ativo da navegação |
| `--surface` | campo e cabeçalho de tabela sobre o vidro |

**Tema escuro é `.dark` no `<html>`** (`darkMode: 'class'`), não `media`: o usuário escolhe. Toda
rampa tem a claridade invertida e o matiz preservado. Um script no `<head>` aplica a classe antes da
primeira pintura — sem ele a tela pisca clara antes de o React montar.

### Contraste — duas medidas que divergem de propósito do artboard

| No design | Medido | Adotado aqui |
|---|---|---|
| `rgba(31,41,37,0.55)` em texto secundário | 3,9:1 sobre o vidro — reprova AA | `foreground-500`, escurecido para 4,6:1 |
| Barras descendo até `primary-300` | 1,1:1 contra o trilho — a barra some | rampa `primary-800..500` |

➜ **`text-foreground-400` é decorativo.** Texto informativo pequeno usa no mínimo
`text-foreground-500`.
➜ **Preenchimento de barra abaixo de `primary-500` some no trilho.**

---

## 3. Superfície

Cinco utilitários carregam fundo, desfoque, borda, sombra **e raio**. Repetir a cadeia à mão é o que
produz deriva entre telas.

| Classe | Vidro | Raio | Onde |
|---|---|---|---|
| `.glass` | 55% | 26px | cartão de seção |
| `.glass-md` | 62% | 26px | cartão que precisa se destacar do vizinho |
| `.glass-strong` | 85% | 28px | coluna, modal, barra de baixo, painel de dropdown |
| `.glass-pill` | 60% | 999px | cápsula do cabeçalho, filtro, selo |
| `.glass-inset` | 75% | — | cartão dentro de cartão (o raio é de quem usa) |

➜ **As utilidades `.glass*` já trazem o próprio raio.** `rounded-card` ao lado é redundância;
`rounded-rail` sobre `.glass` é briga.
➜ **Nada `fixed` dentro de `.glass*`.** O `backdrop-filter` vira o bloco de contenção de todo
descendente `fixed`: um véu `inset-0` nasce do tamanho do cartão, não da tela. Clicar fora se faz com
`mousedown` no `document` testando `ref.contains`; véu e modal de verdade saem por portal.

**Espaçamento em vidro:** 26px (cartão de seção) · 22px (cartão de indicador) · 3.5 (cartão interno).
**Raios:** 26px cartão · 28px coluna e modal · 18px cartão interno · 999px selo, botão, campo, aba,
avatar.

---

## 4. Movimento

Vocabulário fechado. Um número novo inventado numa tela é deriva.

```css
--ease-organic: cubic-bezier(0.22, 0.68, 0, 1);  /* sai rápido, assenta devagar */
--dur-open:  520ms;   --dur-close: 420ms;   /* coluna lateral */
--dd-open:   720ms;   --dd-close:  560ms;   /* dropdowns — mais lentos, de propósito */
```

Animações: `rise` · `bar-grow` · `pop-in` · `live-dot` · `shimmer` · `fade-up` · `fade-in`.
Micro-interações: `.lift` (levanta no hover) · `.press` (afunda no clique) · `.sheen` (brilho
diagonal) · `.underline-grow` (sublinhado que cresce do centro).

➜ **Abrir é mais lento que fechar.** Abrir é convite; fechar é saída, e arrastar a saída irrita.
➜ **`animation-fill-mode` é `backwards`, nunca `both`.** Com `both` o último quadro fica aplicado
para sempre — e animação vence declaração normal na cascata, então o `transform` congelado **anula o
`:hover` do `.lift`**. Foi bug real.
➜ **Tudo se anula sob `prefers-reduced-motion` na fundação.** Componente não reimplementa isso; o que
é animado em JS (contadores, escalonamento) consulta `usePrefersReducedMotion()`.

---

## 5. A coluna lateral

O componente mais denso do sistema. Cada linha abaixo custou um bug.

**Geometria:** 76px recolhida · 236px aberta · 16px de folga de cada lado (ela flutua, não encosta).
O conteúdo se desloca 108px / 268px.

➜ **A coluna é montada UMA vez, pelo `RailLayout`** — a rota de layout das telas que a têm. Quando
cada tela montava a própria, todo clique a recriava: os itens repetiam a animação de entrada (todos a
opacidade 0 e de volta em ~900ms), a coluna sumia enquanto a página carregava e a espiada zerava.

➜ **O deslocamento do conteúdo é CSS puro.** `sidebarMdClass()` devolve `.rail-offset`; o estado real
mora em `html[data-rail]` (`collapsed` / `peek` / `open`), escrito por `lib/sidebarCollapsed.ts`.
Nenhuma página assina store para isso — é o que faz a página refluir junto com a coluna.

➜ **Clicar num item não recolhe, não pisca e não redesenha: só o marcador desliza.** Com a coluna
recolhida, ela abre com o mouse em cima e só recolhe quando ele sai.

➜ **O marcador é conta, não medida:** `translateY(0.375rem + i × (altura + 0.375rem))`. Medir durante
a transição da coluna devolve a altura de partida. São **duas camadas**: a sombra atrás dos itens e,
por cima, a pílula com uma cópia clara dos itens recortada (`clip-path`) na faixa do marcador — assim
o texto clareia exatamente onde o marcador está, em qualquer quadro do deslize. A margem esquerda
troca entre `0` e `auto` junto com o `alignSelf` do item; sem isso o marcador se descola ao abrir.

➜ **Item de lista é função chamada (`itemNav(item, i)`), nunca componente declarado no render.** Cada
render criava um tipo novo e remontava os botões: perdia foco, hover e clique.

➜ **O Chrome dispara `blur` no botão focado enquanto o remove**, ainda conectado e em `:hover`. Por
isso o `onBlurCapture` da coluna só recolhe a espiada se ela não estiver em `:hover`.

➜ **A coluna se pinta pelas variáveis do vidro, não por branco fixo.** Em `style` não existe variante
`dark:` — foi assim que a coluna ficou clara no tema escuro enquanto o resto do app já tinha virado.

---

## 6. Dropdowns

**Todo painel que abre desdobra ao abrir e dobra ao fechar — automático, não opcional.**

- **`<select>`** herda sozinho: o CSS do `::picker(select)` anima (Chrome/Edge 135+, inclusive
  Android). Safari, iOS e Firefox descartam o `@supports` e usam a lista do sistema, sem quebrar.
- **Painel próprio** usa **`<Dropdown open>`**, com `.dropdown-item` em cada item. O escalonamento sai
  da posição (`:nth-child`) — item nenhum precisa de `style`.
- ➜ **Nunca `{open && <painel/>}`**: desmontar mata a animação de saída. O painel fica montado, e o
  `<Dropdown>` o põe `inert` quando fechado (sem foco, sem clique, fora do leitor de tela).
- ➜ **A lista do select anima a altura, não `scale`** — ela abre para cima quando sobra mais espaço
  acima. **A pseudo-classe vai no select** (`select:open::picker(select)`):
  `::picker(select):popover-open` derruba o build no minificador, mesmo com o navegador aceitando.
- ➜ **Anel de foco dos itens vai por dentro** (`outline-offset: -2px`); por fora, o item focado
  crescia além dos outros e era cortado pela borda do painel.

---

## 7. Moldura das telas

➜ **Toda tela com coluna é filha da rota do `RailLayout` e passa pelo `PageShell`.** A página entrega
só o `<main>` — com `w-full` se usar `mx-auto`, senão a coluna flex o encolhe até o conteúdo.

➜ **Tela com coluna NÃO tem rodapé.** Montar um desloca o conteúdo duas vezes: faixa clara à esquerda
e conteúdo empurrado. Foi bug real.

➜ **Um cabeçalho só.** O `PageShell` monta o `AppHeader`; a tela passa `titulo`/`detalhe` e nada mais.
Conta, navegação e "sair" chegam pelo contexto do `RailLayout` — a tela não repete nada disso.

➜ **Cabeçalho e abas grudam JUNTOS, num bloco só.** A altura do cabeçalho varia (as pílulas quebram
linha no celular), então um offset fixo esconderia as abas atrás dele.

---

## 8. Regras que não são de estilo

➜ **Classe do Tailwind montada em runtime não existe.** O JIT varre o código-fonte; um
`` `md:pl-[${n}px]` `` nunca é gerado — a tela quebra só no build de produção. Ou o literal está
escrito no fonte, ou a regra mora no CSS.

➜ **`focus:outline-none` sem anel substituto apaga o foco.** O utilitário casa em `:focus` e vence o
`:focus-visible` global: o controle fica sem indicador nenhum para quem navega por teclado. Só use
com um `focus:ring-*` junto.

➜ **`<Button>` tem `type="button"` por padrão** de propósito: sem isso ele vira `submit` dentro de um
`<form>` e envia o formulário sem querer. Quem precisa enviar passa `type="submit"` explícito.

➜ **`AnimatedNumber` é `aria-hidden` com o valor final em `sr-only`.** Ele muda o texto ~60×/s; dentro
de uma região `aria-live` isso vira enxurrada de anúncios. Não remova o par.

➜ **`useInView` usa `threshold: 0`.** Com fração, um cartão mais alto que a viewport nunca atinge o
limiar e fica preso em `opacity-0`. Quem decide o disparo é o `rootMargin`.

➜ **Ícone: `Glyph` só onde o design define** (navegação, pastilha de indicador, status principal);
Remix Icon no resto. Nunca os dois lado a lado no mesmo agrupamento visual.

---

## 9. Checklist antes de abrir PR num projeto que usa este sistema

- [ ] Nenhuma rampa de `index.css` mudou para ajustar uma tela.
- [ ] Nenhuma classe do Tailwind montada por template string.
- [ ] Todo `focus:outline-none` tem `focus:ring-*` junto.
- [ ] Dropdown novo é `<select>` ou `<Dropdown open>` — nunca `{open && …}`.
- [ ] Tela nova com coluna é filha do `RailLayout` e usa `PageShell`; sem rodapé.
- [ ] Nada `fixed` dentro de um `.glass*`.
- [ ] Texto informativo pequeno em `foreground-500` ou mais escuro.
- [ ] `lint`, `type-check` e `build` passaram.
