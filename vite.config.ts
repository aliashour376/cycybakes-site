import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/cycybakes-site/",
  plugins: [react()],
});
