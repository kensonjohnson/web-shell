import { defineConfig } from "vite";
import { join } from "node:path";
import { cwd } from "node:process";

export default defineConfig({
  root: join(cwd(), "frontend"),
  build: {
    outDir: join(cwd(), "build/frontend"),
    emptyOutDir: true,
  },
  server: {
    proxy: {
      // Example proxying to a local server
      // "/api": {
      //   target: "http://localhost:3000",
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ""),
      // },

      // Shorthand for proxying to specific endpoint
      "/hello": "http://localhost:3000",
      "/run": "http://localhost:3000",
    },
  },
});
