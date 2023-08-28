import { FastifyInstance } from "fastify";
import { todoRoutes } from "./todoRoutes";
import { Components } from "../app";

export const configureRoutes = (
  app: FastifyInstance,
  components: Components,
) => {
  app.register(todoRoutes(components), { prefix: "/api/todos" });
};
