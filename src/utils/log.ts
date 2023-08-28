import { Logger } from "pino";

export const logAndReturnError =
  (logger: Logger) => (error: unknown, logMessage?: string) => {
    logger.error(logMessage ?? "", error);
    return new Error(logMessage);
  };
