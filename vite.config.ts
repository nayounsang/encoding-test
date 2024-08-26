import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: "esnext",
  },
  esbuild: {
    supported: {
      "top-level-await": true,
    },
    target: "esnext",
  },
  optimizeDeps: {
    include: ["bson"], // optionally specify dependency name
    esbuildOptions: {
      supported: {
        "top-level-await": true
      },
    },
  },
});
