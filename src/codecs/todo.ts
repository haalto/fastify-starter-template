import {
  array,
  boolean,
  Codec,
  date,
  GetType,
  number,
  string,
  optional,
} from "purify-ts/Codec";

export const todoCodec = Codec.interface({
  id: number,
  title: string,
  completed: boolean,
  createdAt: date,
});

export const newTodoCodec = Codec.interface({
  title: string,
  completed: boolean,
});

export const todoPartialUpdateCodec = Codec.interface({
  title: optional(string),
  completed: optional(boolean),
});

export type NewTodo = GetType<typeof newTodoCodec>;

export type TodoPartialUpdate = GetType<typeof todoPartialUpdateCodec>;

export type Todo = GetType<typeof todoCodec>;

export const todoListCodec = array(todoCodec);

export const todoResponseSchema = todoCodec.schema();

export const todosResponseSchema = array(todoCodec).schema();

export const newTodoBodySchema = newTodoCodec.schema();

export const todoPartialUpdateBodySchema = todoPartialUpdateCodec.schema();
