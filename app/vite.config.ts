import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import removeConsole from "vite-plugin-remove-console";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    removeConsole({
      includes: ["log"],
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 5000,
    hmr: {
      clientPort: 443,
    },
    allowedHosts: true,
  },
});
