import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/e2e/**/*.test.ts"],
    environment: "node",
    globalSetup: "./tests/e2e/global-setup.ts",
    setupFiles: ["./tests/e2e/setup.ts"],
    reporters: ["verbose", "html"],
    outputFile: {
      html: "./reports/e2e/index.html",
    },
    testTimeout: 15_000,
    hookTimeout: 15_000,
    pool: "forks",
  },
});
