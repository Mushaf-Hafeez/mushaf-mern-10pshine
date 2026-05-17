import pino from "pino"

const isDevelopment = import.meta.env.VITE_MODE === "development"

export const logger = pino({
  level: isDevelopment ? "debug" : "info",

  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
          ignore: "pid,hostname",
        },
      }
    : undefined,
})
