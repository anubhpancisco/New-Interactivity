import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// For GitHub Pages project sites, CI sets VITE_BASE_PATH to "/your-repo-name/".
// Local dev uses "/" (see https://vitejs.dev/guide/static-deploy.html#github-pages).
const base = process.env.VITE_BASE_PATH ?? "/";

export default defineConfig({
  plugins: [react()],
  base,
});
