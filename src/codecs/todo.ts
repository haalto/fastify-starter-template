import {
  array,
  boolean,
  Codec,
  GetType,
  number,
  string,
} from "purify-ts/Codec";

export const todoCodec = Codec.interface({
  userId: number,
  id: number,
  title: string,
  completed: boolean,
});

export type Todo = GetType<typeof todoCodec>;

export const todoListCodec = array(todoCodec);
