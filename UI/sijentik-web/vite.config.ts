import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (id.includes("@tanstack/react-query")) {
            return "query";
          }

          if (id.includes("recharts")) {
            return "charts";
          }

          if (id.includes("react-select")) {
            return "select";
          }

          if (id.includes("react-leaflet") || /[\\/]leaflet[\\/]/.test(id)) {
            return "map";
          }

          if (/[\\/]react-dom[\\/]/.test(id) || /[\\/]react[\\/]/.test(id)) {
            return "vendor";
          }

          return undefined;
        },
      },
    },
  },
});
