import pino from "pino"

const isTest = import.meta.env.MODE === "test"
const isDevelopment = import.meta.env.VITE_MODE === "development"

export const logger = pino({
  level: isTest ? "silent" : isDevelopment ? "debug" : "info",

  transport:
    isTest || !isDevelopment
      ? undefined
      : {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
})
