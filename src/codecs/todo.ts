import {
  array,
  boolean,
  Codec,
  date,
  GetType,
  number,
  string,
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

export type NewTodo = GetType<typeof newTodoCodec>;

export type Todo = GetType<typeof todoCodec>;

export const todoListCodec = array(todoCodec);
