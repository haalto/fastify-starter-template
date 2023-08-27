import pino from "pino";
import { app } from "./app";
import { getConfig } from "./config";
import { getTodoService } from "./services/todoService";

const start = () => {
  const config = getConfig();

  if (config.isLeft()) {
    console.error(config.extract());
    process.exit(1);
  }

  config.map((config) => {
    const logger = pino();
    const todoService = getTodoService(logger);
    const components = {
      TodoService: todoService,
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
