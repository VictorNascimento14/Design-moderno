import { resolve } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Deploy em subpasta precisa de BASE_PATH no build, senão todo link quebra
// em produção — e só lá.
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  plugins: [react()],
  base,
  build: { outDir: "out", sourcemap: true },
  resolve: { alias: { "@": resolve(import.meta.dirname, "./src") } },
  server: { port: 3000, host: "0.0.0.0" },
});
