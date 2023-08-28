import Fastify, { FastifyServerOptions } from "fastify";

import { configurePlugins } from "./plugins";
import { configureRoutes } from "./routes/routes";
import { TodoService } from "./services/todoService";

export interface Components {
  todoService: TodoService;
}

export const app = (components: Components, opts?: FastifyServerOptions) => {
  const app = Fastify(opts);
  configurePlugins(app);
  configureRoutes(app, components);
  return app;
};
