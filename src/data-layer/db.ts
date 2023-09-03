import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { Database } from "./dbTypes";
import { DbConfig } from "../config";

export const createDb = (config: DbConfig) => {
  const dialect = new PostgresDialect({
    pool: new Pool({
      database: config.name,
      host: config.host,
      user: config.user,
      password: config.password,
      port: config.port,
      max: 10,
    }),
  });

  const db = new Kysely<Database>({
    dialect,
    plugins: [new CamelCasePlugin()],
  });

  return db;
};
