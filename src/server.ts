import pino from "pino";
import { app } from "./app";
import { getConfig } from "./config";
import { getTodoService } from "./services/todoService";
import { migrateToLatest } from "./migrator";
import { createCache } from "./data-layer/cache";
import { createDb } from "./data-layer/db";

const start = () => {
  const config = getConfig();
  const logger = pino();

  if (config.isLeft()) {
    logger.error(config.extract());
    process.exit(1);
  }

  config.map(async (config) => {
    await migrateToLatest(logger, config);

    const db = createDb(config);
    const cache = createCache(config);

    const todoService = getTodoService(logger, db, cache);
    const components = {
      todoService,
    };

    const server = app(config, components, { logger: logger });
    server.listen({ port: config.port }, (error, address) => {
      if (error) {
        server.log.error(error);
        process.exit(1);
      }
      server.log.info(`server listening on ${address}`);
    });
  });
};

start();
