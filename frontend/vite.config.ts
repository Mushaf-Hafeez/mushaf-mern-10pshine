import { defineConfig } from "vitest/config"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "path"
import process from "node:process"

const nodeMajor = Number.parseInt(process.versions.node.split(".")[0] ?? "0", 10)

// Node 25+ exposes a broken global localStorage (empty object) that shadows jsdom.
const testExecArgv =
  nodeMajor >= 25 ? (["--no-webstorage"] as const) : ([] as const)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    execArgv: [...testExecArgv],

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/main.tsx",
        "src/App.tsx",
        "src/services/axios.ts",
        "src/constants/**",
        "src/components/ui/**",
        "src/index.css",
        "src/test/**",
        "src/**/*.d.ts",
      ],
      thresholds: {
        lines: 90,
        statements: 89,
        functions: 79,
        branches: 73,
      },
    },
  },
})
