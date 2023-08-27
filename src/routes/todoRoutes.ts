import { FastifyInstance } from "fastify";
import { getTodoController } from "../controllers/todoController";
import { todoCodec, todoListCodec } from "../codecs/todo";
import { Components } from "../app";

export const todoRoutes =
  (components: Components) => (server: FastifyInstance) => {
    const todoService = components.TodoService;
    const todoController = getTodoController(todoService);

    server.get("/external", {
      schema: {
        response: {
          200: todoListCodec.schema(),
        },
      },
      handler: todoController.getTodos,
    });

    server.get("/external/:id", {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
        },
        response: {
          200: todoCodec.schema(),
        },
      },
      handler: todoController.getTodoById,
    });

    return server;
  };
