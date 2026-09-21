// Barril do sistema visual. `import { GlassCard, PageShell } from "@/ui"`.
// Importar do arquivo direto também funciona — e é o que o próprio kit faz,
// para um componente nunca arrastar o resto do sistema junto.

// Fundação
export { EASE_ORGANIC, DUR_OPEN, DUR_CLOSE, stagger, usePrefersReducedMotion } from "./lib/motion";
export { SLUG, NOME, MONOGRAMA } from "./lib/marca";
export { diaISO } from "./lib/data";
export {
  aplicarTema,
  definirTema,
  observarSistema,
  sistemaEscuro,
  temaEfetivo,
  temaEscolhido,
  CHAVE_TEMA,
  type Tema,
} from "./lib/tema";
export {
  isSidebarCollapsed,
  setSidebarCollapsed,
  setRailPeek,
  isRailPeeking,
  useSidebarCollapsed,
  useRailPeek,
  sidebarMdClass,
  RAIL_WIDTH_COLLAPSED,
  RAIL_WIDTH_OPEN,
} from "./lib/sidebarCollapsed";
export { toast, assinarToasts, type Toast } from "./lib/toast";
export { useInView } from "./hooks/useInView";

// Primitivos
export { default as AnimatedNumber } from "./base/AnimatedNumber";
export { default as Avatar } from "./base/Avatar";
export { default as Button } from "./base/Button";
export { default as Calendar } from "./base/Calendar";
export { default as Dropdown } from "./base/Dropdown";
export { default as GlassCard } from "./base/GlassCard";
export { default as GlassPill } from "./base/GlassPill";
export { default as Glyph, type GlyphName } from "./base/Glyph";
export { default as MeterBar } from "./base/MeterBar";
export { default as Modal } from "./base/Modal";
export { default as Reveal } from "./base/Reveal";
export { default as StatCard, type StatTone } from "./base/StatCard";
export { default as TextField } from "./base/TextField";

// Casca
export { default as AppHeader } from "./shell/AppHeader";
export { default as BottomNav } from "./shell/BottomNav";
export { default as BrandMark } from "./shell/BrandMark";
export { default as PageShell } from "./shell/PageShell";
export { default as RailLayout, type RailOutletContext } from "./shell/RailLayout";
export { default as Sidebar } from "./shell/Sidebar";
export { default as TemaToggle } from "./shell/TemaToggle";
export { default as ToastHost } from "./shell/ToastHost";
export { itemAtivo, itensDaBarra, type Conta, type GrupoNav, type ItemNav } from "./shell/navegacao";
