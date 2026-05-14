import path from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import createHtmlPlugin from "vite-plugin-simple-html";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: process.env.NODE_ENV !== "CI",
      filename: "./dist/stats.html",
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          mainScript: `sqlwebapi/main.tsx`,
        },
      },
    }),
  ],
  define: {
    "import.meta.env.VITE_IS_DEMO": JSON.stringify("true"),
    "import.meta.env.VITE_SQLWEBAPI_URL": JSON.stringify(
      process.env.VITE_SQLWEBAPI_URL ?? "http://localhost:5092",
    ),
    "import.meta.env.VITE_SQLWEBAPI_SERVICE": JSON.stringify(
      process.env.VITE_SQLWEBAPI_SERVICE ??
        process.env.VITE_SERVICE ??
        "crm2api",
    ),
    "import.meta.env.VITE_SERVICE": JSON.stringify(
      process.env.VITE_SERVICE ?? "crmapi",
    ),
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
      process.env.VITE_SUPABASE_URL ?? "https://example.supabase.co",
    ),
    "import.meta.env.VITE_SB_PUBLISHABLE_KEY": JSON.stringify(
      process.env.VITE_SB_PUBLISHABLE_KEY ??
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMDk5OTk5OTk5fQ.example",
    ),

  },
  base: "./",
  esbuild: {
    keepNames: true,
  },
  build: {
    sourcemap: true,
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
