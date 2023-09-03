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
    res: FastifyReply
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
        })
      );
  };

  const createTodo = async (
    req: FastifyRequest<{ Body: NewTodo }>,
    res: FastifyReply
  ) => {
    const todo = await todoService.createTodo(req.body);
    todo
      .mapLeft((error) => {
        req.log.error(error);
        res.internalServerError();
      })
      .map((todo) => res.status(201).send(todo));
  };

  const updateTodo = async (
    req: FastifyRequest<{ Params: { id: number }; Body: NewTodo }>,
    res: FastifyReply
  ) => {
    const { title, completed } = req.body;
    const todo = await todoService.updateTodo(req.params.id, {
      title,
      completed,
    });
    todo
      .mapLeft((error) => {
        req.log.error(error);
        res.internalServerError();
      })
      .map((todo) =>
        todo.caseOf({
          Just: (todo) => res.send(todo),
          Nothing: () => res.notFound(),
        })
      );
  };

  const deleteTodo = async (
    req: FastifyRequest<{ Params: { id: number } }>,
    res: FastifyReply
  ) => {
    const result = await todoService.deleteTodo(req.params.id);
    result
      .mapLeft((error) => {
        req.log.error(error);
        res.internalServerError();
      })
      .map((id) =>
        id.caseOf({
          Just: (_) => res.status(204).send,
          Nothing: () => res.notFound(),
        })
      );
  };

  return { getTodos, getTodoById, createTodo, deleteTodo, updateTodo };
};
