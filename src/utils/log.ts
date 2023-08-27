import { FastifyBaseLogger } from "fastify";

export const logAndReturnError =
  (logger: FastifyBaseLogger) => (error: unknown, logMessage: string) => {
    logger.error(logMessage, error);
    return new Error(logMessage);
  };
