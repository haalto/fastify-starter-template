import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";

export interface Database {
  todos: TodoTable;
}

export interface TodoTable {
  id: Generated<number>;
  title: string;
  completed: boolean;
  createdAt: ColumnType<Date, string | undefined, never>;
}

export type TodoDb = Selectable<TodoTable>;
export type NewTodoDb = Insertable<TodoTable>;
export type TodoUpdateDb = Updateable<TodoTable>;
