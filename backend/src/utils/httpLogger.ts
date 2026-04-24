import pinoHttp from "pino-http";

const httpLogger = pinoHttp({
  transport: {
    target: "pino-pretty",
    options: {
      colorSize: true,
    },
  },
});

export default httpLogger;
