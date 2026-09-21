import type { ReactElement, SVGProps } from "react";

/**
 * Ícones do sistema — traçado de 2.5 em caixa 24, pontas e
 * junções arredondadas. São inline (e não uma fonte de ícones) porque a
 * espessura e o raio fazem parte da identidade: um ícone de outra família ao
 * lado destes destoa na hora.
 */
export type GlyphName =
  | "grid"
  | "calendar"
  | "calendar-check"
  | "users"
  | "user"
  | "check-double"
  | "receipt"
  | "card"
  | "chart"
  | "coin"
  | "hand-coin"
  | "shield-check"
  | "swap"
  | "search"
  | "arrow-up"
  | "arrow-left"
  | "wifi-off"
  | "bell"
  | "logout"
  | "menu"
  | "close"
  | "chevron-down"
  | "panel-left";

const PATHS: Record<GlyphName, ReactElement> = {
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="4" />
      <path d="M8 3v4M16 3v4M3.5 10.5h17" />
    </>
  ),
  "calendar-check": (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="4" />
      <path d="M8 3v4M16 3v4M3.5 10.5h17" />
      <path d="m8.5 15 2.2 2.2L15.5 12.5" />
    </>
  ),
  users: (
    <>
      <circle cx="10" cy="8" r="3.5" />
      <path d="M4 19.5c1-3 3.2-4.5 6-4.5s5 1.5 6 4.5" />
      <path d="M16.5 5.5a3.2 3.2 0 0 1 0 5.6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.75" />
      <path d="M5.5 20c1.2-3.2 3.6-4.8 6.5-4.8s5.3 1.6 6.5 4.8" />
    </>
  ),
  "check-double": (
    <>
      <path d="m3 13 3.5 3.5L13 10" />
      <path d="m11 16.5 2 2L21 10" />
    </>
  ),
  receipt: (
    <>
      <path d="M5 3.5h14v17l-2.3-1.6-2.3 1.6-2.4-1.6-2.4 1.6L7.3 19 5 20.5z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="12.5" rx="3.5" />
      <path d="M3 10.5h18" />
      <path d="M7 15h3" />
    </>
  ),
  chart: <path d="M5 20V11M12 20V5M19 20v-6" />,
  coin: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.5 9.5c-.6-.8-1.5-1.2-2.5-1.2-1.4 0-2.3.7-2.3 1.7 0 2.4 5 1.1 5 3.6 0 1.1-1 1.9-2.7 1.9-1.1 0-2.1-.4-2.7-1.2" />
      <path d="M12 6.5v11" />
    </>
  ),
  "hand-coin": (
    <>
      <path d="M3 15.5c2.5-2 5-2 7.5 0h5.5a2 2 0 0 1 0 4H8" />
      <circle cx="15.5" cy="7.5" r="3.5" />
    </>
  ),
  "shield-check": (
    <>
      <path d="M12 3.5l7 2.5v5c0 4.2-2.9 7.5-7 9-4.1-1.5-7-4.8-7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  swap: (
    <>
      <path d="M4 8.5h13M13.5 5 17 8.5 13.5 12" />
      <path d="M20 15.5H7M10.5 12 7 15.5 10.5 19" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  "arrow-up": <path d="M12 19V5M6 11l6-6 6 6" />,
  "arrow-left": <path d="M19 12H5M11 6l-6 6 6 6" />,
  "wifi-off": (
    <>
      <path d="M3 3l18 18" />
      <path d="M8.5 15.5a5 5 0 0 1 6 0" />
      <path d="M5 12a10 10 0 0 1 3.2-2.1M19 12a10 10 0 0 0-7.5-2.9" />
      <path d="M2 8.5a15 15 0 0 1 4.2-2.7M22 8.5a15 15 0 0 0-9.8-3.4" />
      <path d="M12 19h.01" />
    </>
  ),
  bell: (
    <>
      <path d="M6 10a6 6 0 0 1 12 0c0 3.2.7 5 1.5 6h-15C5.3 15 6 13.2 6 10z" />
      <path d="M10 19.5a2.2 2.2 0 0 0 4 0" />
    </>
  ),
  logout: (
    <>
      <path d="M14 4.5H7.5A2.5 2.5 0 0 0 5 7v10a2.5 2.5 0 0 0 2.5 2.5H14" />
      <path d="M16 8.5 19.5 12 16 15.5M11 12h8.5" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  "chevron-down": <path d="m6 9.5 6 6 6-6" />,
  "panel-left": (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="4" />
      <path d="M9.5 4.5v15" />
    </>
  ),
};

interface GlyphProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: GlyphName;
  size?: number;
}

export default function Glyph({ name, size = 18, ...rest }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
