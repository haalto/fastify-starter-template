import { EitherAsync } from "purify-ts/EitherAsync";
import { NewTodo, Todo, todoCodec, todoListCodec } from "../codecs/todo";
import { Just, Maybe, Nothing, Right } from "purify-ts";
import { Kysely } from "kysely";
import { Database, TodoUpdateDb } from "../data-layer/dbTypes";
import { Cache } from "../data-layer/cache";
import { Logger } from "pino";
import { handleUnknownError } from "../utils/errors";

export interface TodoService {
  listTodos: () => EitherAsync<Error, Todo[]>;
  findTodoById: (id: number) => EitherAsync<Error, Maybe<Todo>>;
  createTodo: (newTodo: NewTodo) => EitherAsync<Error, Todo>;
  deleteTodo: (id: number) => EitherAsync<Error, Maybe<number>>;
  updateTodo: (
    id: number,
    updatedTodo: TodoUpdateDb
  ) => EitherAsync<Error, Maybe<Todo>>;
}

export const createTodoService = (
  logger: Logger,
  db: Kysely<Database>,
  cache: Cache
): TodoService => {
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
        return throwE(handleUnknownError(error));
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
            logger.debug(todo);
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
            logger.info("Todo fetched from database", todo);
            logger.info(todo);
            return Just(todo);
          },
        });
        return liftEither(Right(result));
      } catch (error) {
        return throwE(handleUnknownError(error));
      }
    });
  };

  const createTodo = (newTodo: NewTodo) => {
    logger.info("Creating a new todo");
    return EitherAsync<Error, Todo>(async ({ liftEither, throwE }) => {
      const { title, completed } = newTodo;
      try {
        const todo = await db
          .insertInto("todos")
          .values({ title, completed })
          .returning(["id", "title", "completed", "createdAt"])
          .executeTakeFirst();
        if (!todo) {
          return throwE(new Error("Todo was not created"));
        }

        logger.info("Todo created");

        cache.invalidate("todos");
        cache.set(`todos:${todo.id}`, todo);
        return liftEither(Right(todo));
      } catch (error) {
        return throwE(handleUnknownError(error));
      }
    });
  };

  const deleteTodo = (id: number) => {
    logger.info("Deleting todo with id %d", id);
    return EitherAsync<Error, Maybe<number>>(async ({ liftEither, throwE }) => {
      try {
        const todoId = await db
          .deleteFrom("todos")
          .where("id", "=", id)
          .returning("id")
          .executeTakeFirst();

        if (!todoId) {
          return liftEither(Right(Nothing));
        }

        logger.info("Todo deleted");
        cache.invalidate("todos");
        cache.invalidate(`todos:${id}`);
        return liftEither(Right(Just(id)));
      } catch (error) {
        return throwE(handleUnknownError(error));
      }
    });
  };

  const updateTodo = (id: number, updateTodo: TodoUpdateDb) => {
    logger.info("Updating todo with id %d", id);
    return EitherAsync<Error, Maybe<Todo>>(async ({ liftEither, throwE }) => {
      const { title, completed } = updateTodo;
      try {
        const updatedTodo = await db
          .updateTable("todos")
          .set({ title, completed })
          .where("id", "=", id)
          .returning(["id", "title", "completed", "createdAt"])
          .executeTakeFirst();

        if (!updatedTodo) {
          return liftEither(Right(Nothing));
        }

        logger.info("Todo updated");
        cache.invalidate("todos");
        cache.set(`todos:${updatedTodo.id}`, updatedTodo);
        return liftEither(Right(Just(updatedTodo)));
      } catch (error) {
        return throwE(handleUnknownError(error));
      }
    });
  };

  return { listTodos, findTodoById, createTodo, deleteTodo, updateTodo };
};
