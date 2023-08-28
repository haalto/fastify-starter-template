import { FastifyReply, FastifyRequest } from "fastify";
import { TodoService } from "../services/todoService";
import { NewTodo } from "../codecs/todo";

export const getTodoController = (todoService: TodoService) => {
  const getTodos = async (req: FastifyRequest, res: FastifyReply) => {
    const todos = await todoService.listTodos();
    todos
      .mapLeft((error) => {
        req.log.error(error);
        res.internalServerError();
      })
      .map((todos) => res.send(todos));
  };

  const getTodoById = async (
    req: FastifyRequest<{ Params: { id: number } }>,
    res: FastifyReply,
  ) => {
    const todo = await todoService.findTodoById(req.params.id);
    todo
      .mapLeft((error) => {
        req.log.error(error);
        res.internalServerError();
      })
      .map((todo) =>
        todo.caseOf({
          Just: (todo) => res.send(todo),
          Nothing: () => res.notFound(),
        }),
      );
  };

  const createTodo = async (
    req: FastifyRequest<{ Body: NewTodo }>,
    res: FastifyReply,
  ) => {
    const todo = await todoService.createTodo(req.body);
    todo
      .mapLeft((error) => {
        req.log.error(error);
        res.internalServerError();
      })
      .map((todo) => res.status(201).send(todo));
  };

  return { getTodos, getTodoById, createTodo };
};
