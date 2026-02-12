import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { componentTagger } from "lovable-tagger";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    react({ babel: { plugins: [["babel-plugin-react-compiler"]] } }),
    tailwindcss(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  server: { host: "::", port: 8080, hmr: { overlay: false } },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
}));
