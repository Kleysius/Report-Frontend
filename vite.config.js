import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Patch AVANT d’importer flowbite-react
import flowbiteReactPlugin from "flowbite-react/plugin/vite";
flowbiteReactPlugin.__skipTailwindVersionCheck = true;

export default defineConfig({
  plugins: [
    react(),
    flowbiteReactPlugin,
  ],
  resolve: {
    "@": path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "./frontend/src"
    ),
  },
});
