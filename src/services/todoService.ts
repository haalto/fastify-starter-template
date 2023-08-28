import { EitherAsync } from "purify-ts/EitherAsync";
import { NewTodo, Todo, todoCodec, todoListCodec } from "../codecs/todo";
import { Just, Maybe, Nothing, Right } from "purify-ts";
import { logAndReturnError } from "../utils/log";
import { Kysely } from "kysely";
import { Database } from "../data-layer/dbTypes";
import { Cache } from "../data-layer/cache";
import { Logger } from "pino";

export interface TodoService {
  listTodos: () => EitherAsync<Error, Todo[]>;
  findTodoById: (id: number) => EitherAsync<Error, Maybe<Todo>>;
  createTodo: (newTodo: NewTodo) => EitherAsync<Error, Todo>;
}

export const createTodoService = (
  logger: Logger,
  db: Kysely<Database>,
  cache: Cache
): TodoService => {
  const logError = logAndReturnError(logger);

  const listTodos = () => {
    logger.info("Fetching todos");
    return EitherAsync<Error, Todo[]>(async ({ liftEither, throwE }) => {
      try {
        const cachedTodos = await cache.get("todos");
        const result = await todoListCodec.decode(cachedTodos).caseOf({
          Right: async (todos) => {
            logger.info("Todos fetched from cache");
            return todos;
          },
          Left: async () => {
            const todos = await db
              .selectFrom("todos")
              .select(["id", "title", "completed", "createdAt"])
              .execute();
            cache.set("todos", todos);
            logger.info("Todos fetched from database");
            return todos;
          },
        });
        return liftEither(Right(result));
      } catch (error) {
        logError(error);
        return throwE(new Error("Error fetching todos"));
      }
    });
  };

  const findTodoById = (id: number) => {
    logger.info("Fetching todo by id %d", id);

    return EitherAsync<Error, Maybe<Todo>>(async ({ liftEither, throwE }) => {
      try {
        const cachedTodo = await cache.get(`todos:${id}`);
        const result = await todoCodec.decode(cachedTodo).caseOf({
          Right: async (todo) => {
            logger.info("Todo fetched from cache");
            return Just(todo);
          },
          Left: async () => {
            const todo = await db
              .selectFrom("todos")
              .where("id", "=", id)
              .select(["id", "title", "completed", "createdAt"])
              .executeTakeFirst();

            if (!todo) {
              return Nothing;
            }
            cache.set(`todos:${id}`, todo);
            logger.info("Todo fetched from database");
            return Just(todo);
          },
        });
        return liftEither(Right(result));
      } catch (error) {
        logError(error);
        return throwE(new Error("Error fetching todos"));
      }
    });
  };

  const createTodo = (newTodo: NewTodo) => {
    logger.info("Creating a new todo");
    return EitherAsync<Error, Todo>(async ({ liftEither, throwE }) => {
      try {
        const todo = await db
          .insertInto("todos")
          .values(newTodo)
          .returning(["id", "title", "completed", "createdAt"])
          .executeTakeFirst();
        if (!todo) {
          return throwE(new Error("Error creating todo"));
        }
        cache.invalidate("todos");
        cache.set(`todos:${todo.id}`, todo);
        return liftEither(Right(todo));
      } catch (error) {
        logError(error);
        return throwE(new Error("Error creating todo"));
      }
    });
  };
  return { listTodos, findTodoById, createTodo };
};
