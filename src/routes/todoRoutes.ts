import { FastifyInstance } from "fastify";
import { getTodoController } from "../controllers/todoController";
import {
  newTodoBodySchema,
  todoResponseSchema,
  todosResponseSchema,
} from "../codecs/todo";
import { Components } from "../app";

export const todoRoutes =
  (components: Components) => (app: FastifyInstance) => {
    const todoService = components.todoService;
    const todoController = getTodoController(todoService);

    app.get("/", {
      schema: {
        response: {
          200: todosResponseSchema,
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
          200: todoResponseSchema,
        },
      },
      handler: todoController.getTodoById,
    });

    app.post("/", {
      schema: {
        body: newTodoBodySchema,
        response: {
          201: todoResponseSchema,
        },
      },
      handler: todoController.createTodo,
    });

    app.put("/:id", {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
        },
        body: newTodoBodySchema,
        response: {
          200: todoResponseSchema,
        },
      },
      handler: todoController.updateTodo,
    });

    app.delete("/:id", {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
        },
        response: {
          204: {},
        },
      },
      handler: todoController.deleteTodo,
    });

    return app;
  };
