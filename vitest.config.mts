import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    env: loadEnv("test", process.cwd(), ""),
    include: ["src/**/*.spec.{ts,tsx}"],
  },
  resolve: {
    tsconfigPaths: true,
  },
});
