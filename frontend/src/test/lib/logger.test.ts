import { describe, expect, it } from "vitest"

import { logger } from "@/lib/logger"

describe("logger", () => {
  it("exports a pino logger instance", () => {
    expect(logger).toBeDefined()
    expect(typeof logger.info).toBe("function")
    expect(typeof logger.error).toBe("function")
    expect(typeof logger.warn).toBe("function")
    expect(typeof logger.debug).toBe("function")
  })

  it("logs without throwing", () => {
    expect(() => logger.info({ test: true }, "test message")).not.toThrow()
    expect(() => logger.error({ err: "x" }, "error message")).not.toThrow()
  })
})
