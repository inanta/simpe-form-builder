import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

import eslintPlugin from "vite-plugin-eslint";
import htmlMinifier from "rollup-plugin-html-minifier";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), eslintPlugin()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src")
    }
  },
  base: "",
  build: {
    assetsDir: "public",
    rollupOptions: {
      plugins: [
        htmlMinifier({
          // These are the default values:

          // Glob pattern or array of glob patterns to include
          include: "**/*.html",

          // Glob pattern or array of glob patterns to exclude
          exclude: undefined,

          // Method returning a boolean that filters files to process
          // given their name (overrides include and exclude parameters)
          filter: undefined,

          // html-minifier options
          options: {
            collapseWhitespace: false
          }
        })
      ],
      input: {
        ui: resolve(__dirname, "private/application/app/views/ui/index.html")
      },
      output: {
        assetFileNames: (assetInfo) => {
          let info = assetInfo.name.split(".");
          let extType = info[info.length - 1];

          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = "img";
          } else if (/woff|woff2|ttf|eot/.test(extType)) {
            extType = "font";
          }

          return `public/koma/application/app/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: "public/koma/application/app/js/[name]-[hash].js",
        entryFileNames: "public/koma/application/app/js/[name]-[hash].js"
      }
    }
  }
});
