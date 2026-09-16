import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    testTimeout: 20000, // pdflatex compiles + in-memory mongo can be slow on first run
    globals: false,
  },
});
