import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: "./src/index.ts",
    outDir: "./dist",
  },
  {
    entry: "./src/cleanup-files.ts",
    outDir: "./dist",
  },
]);
