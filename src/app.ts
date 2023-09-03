import Fastify, { FastifyServerOptions } from "fastify";

import { configurePlugins } from "./plugins";
import { configureRoutes } from "./routes/routes";
import { TodoService } from "./services/todoService";

export interface Components {
  todoService: TodoService;
}

export const app = (components: Components, opts?: FastifyServerOptions) => {
  const options = {
    ...opts,
    ajv: {
      customOptions: {
        removeAdditional: "all" as const, // remove additional properties from request bodies
      },
    },
  };
  const app = Fastify(options);
  configurePlugins(app);
  configureRoutes(app, components);
  return app;
};
