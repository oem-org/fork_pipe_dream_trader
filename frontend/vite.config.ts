//
//import { defineConfig } from 'vite'
//import react from '@vitejs/plugin-react'
//
//// https://vite.dev/config/
//export default defineConfig({
//  plugins: [react()],
//})

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';
import tailwindcss from 'tailwindcss'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias '@' to the 'src' folder
    },
  },
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  }
});

//test: {
//  globals: true,
//    environment: "jsdom",
//      css: true, // no need to import it describe etc
//        setupFiles: "./setupTests.js",
//  },
