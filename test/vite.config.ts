/// <reference = types="vitest" />
/// <reference = types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias '@' to the 'src' folder
    },
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    css: true, // no need to import it describe etc
    setupFiles: "./setupTests.js",
  },
});
