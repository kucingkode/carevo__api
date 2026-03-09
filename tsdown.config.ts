import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: "./src/index.ts",
    outDir: "./dist",
  },
  {
    entry: "./src/migrate.ts",
    outDir: "./dist",
  },
]);
