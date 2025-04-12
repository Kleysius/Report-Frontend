import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Patch AVANT d’importer flowbite-react
import flowbiteReactPlugin from "flowbite-react/plugin/vite";
flowbiteReactPlugin.__skipTailwindVersionCheck = true;

export default defineConfig({
  plugins: [
    react(),
    flowbiteReactPlugin, // 💡 pas flowbiteReact directement
  ],
});
