import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { createHtmlPlugin } from "vite-plugin-html";
import react from "@vitejs/plugin-react";
import svgLoader from "vite-svg-loader";

export default defineConfig({
  plugins: [
    react(),
    svgLoader(),
    viteStaticCopy({
      targets: [
        {
          src: "src/manifest.json",
          dest: "./",
        },
        {
          src: "src/options/options.html",
          dest: "./options",
        },
        {
          src: "src/popup/popup.html",
          dest: "./popup",
        },
        {
          src: "src/assets/images",
          dest: "./assets",
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        serviceWorker: resolve(__dirname, "src/serviceWorker/serviceWorker.ts"),
        cotentScript: resolve(__dirname, "src/cotentScript/cotentScript.ts"),
        recorderWidget: resolve(
          __dirname,
          "src/cotentScript/recorderWidget.ts"
        ),
        setupContentConfig: resolve(
          __dirname,
          "src/cotentScript/setupContentConfig.ts"
        ),
        recordSession: resolve(__dirname, "src/recordSession/recordSession.ts"),
        options: resolve(__dirname, "src/options/options.tsx"),
        popup: resolve(__dirname, "src/popup/popup.tsx"),
        iframeContentScript: resolve(
          __dirname,
          "src/iframeContentScript/iframeContentScript.ts"
        ),
        HTTPLoggerWindow: resolve(
          __dirname,
          "src/HTTPLoggerWindow/HTTPLoggerWindow.tsx"
        ),
      },
      output: {
        entryFileNames: "[name]/[name].js",
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@assets": resolve(__dirname, "./src/assets"),
      "@popup": resolve(__dirname, "./src/popup"),
      "@context": resolve(__dirname, "./src/context"),
      "@services": resolve(__dirname, "./src/services"),
      "@options": resolve(__dirname, "./src/options"),
      "@models": resolve(__dirname, "./src/models"),
      "@utils": resolve(__dirname, "./src/utils"),
    },
  },
});
