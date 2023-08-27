import Fastify, { FastifyServerOptions } from "fastify";

import { Config } from "./config";
import { configurePlugins } from "./plugins";
import { configureRoutes } from "./routes/routes";
import { TodoService } from "./services/todoService";

export interface Components {
  TodoService: TodoService;
}

export const app = (
  config: Config,
  components: Components,
  opts?: FastifyServerOptions
) => {
  const app = Fastify(opts);
  configurePlugins(app, config);
  configureRoutes(app, components);
  return app;
};
