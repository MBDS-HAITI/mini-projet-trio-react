import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  server: mode === "development"
    ? {
        proxy: {
          "/api": {
            target: "http://localhost:8010",
            changeOrigin: true,
          },
        },
      }
    : undefined, // 🔥 PAS DE PROXY EN PROD
}));
