import { FastifyInstance } from "fastify";
import { getTodoController } from "../controllers/todoController";
import { newTodoCodec, todoCodec, todoListCodec } from "../codecs/todo";
import { Components } from "../app";

export const todoRoutes =
  (components: Components) => (app: FastifyInstance) => {
    const todoService = components.todoService;
    const todoController = getTodoController(todoService);

    app.get("/", {
      schema: {
        response: {
          200: todoListCodec.schema(),
        },
      },
      handler: todoController.getTodos,
    });

    app.get("/:id", {
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

    app.post("/", {
      schema: {
        body: newTodoCodec.schema(),
        response: {
          201: todoCodec.schema(),
        },
      },
      handler: todoController.createTodo,
    });

    return app;
  };
