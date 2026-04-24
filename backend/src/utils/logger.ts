import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorSize: true,
    },
  },
});

export default logger;
