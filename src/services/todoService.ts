import { EitherAsync } from "purify-ts/EitherAsync";
import { Todo, todoCodec, todoListCodec } from "../codecs/todo";
import { FastifyBaseLogger } from "fastify";
import { Just, Maybe, Nothing, Right } from "purify-ts";
import { get } from "../utils/http";
import { logAndReturnError } from "../utils/log";

interface TodoService {
  listTodos: () => EitherAsync<Error, Todo[]>;
  findTodoById: (id: number) => EitherAsync<Error, Maybe<Todo>>;
}

const getTodoService = (logger: FastifyBaseLogger): TodoService => {
  const logError = logAndReturnError(logger);

  const listTodos = () => {
    logger.info("Fetching todos");
    return get(`https://jsonplaceholder.typicode.com/todos`)
      .mapLeft((error) => logError(error, "Error fetching todos"))
      .map((response) => {
        logger.info("Todo fetched");
        return todoListCodec
          .decode(response.data)
          .mapLeft((error) => logError(error, "Error decoding todos"));
      })
      .join();
  };

  const findTodoById = (id: number) => {
    logger.info("Fetching todo");
    return get(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .mapLeft((error) => {
        logger.error("Error fetching todo", error);
        return new Error("Error fetching todo");
      })
      .map((response) => {
        logger.info("Todo fetched");
        if (response.status === 404) {
          return Right(Nothing);
        }
        return todoCodec
          .decode(response.data)
          .mapLeft((error) => logError(error, "Error decoding todo"))
          .map((todo) => Just(todo));
      })
      .join();
  };

  return { listTodos, findTodoById };
};

export { TodoService, getTodoService };
