import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { Config } from "../config";
import { Pool } from "pg";
import { Database } from "./dbTypes";

export const createDb = (config: Config) => {
  const dialect = new PostgresDialect({
    pool: new Pool({
      database: config.db.name,
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      port: config.db.port,
      max: 10,
    }),
  });

  const db = new Kysely<Database>({
    dialect,
    plugins: [new CamelCasePlugin()],
  });

  return db;
};
