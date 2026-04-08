import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
const devPort = Number(process.env.VITE_PORT || process.env.PORT || 5173);

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: devPort,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  define: {
    __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
