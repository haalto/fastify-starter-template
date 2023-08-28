import * as path from "path";
import { Pool } from "pg";
import { promises as fs } from "fs";
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
} from "kysely";
import { Config } from "./config";
import { Logger } from "pino";

/**
 * From https://kysely.dev/docs/migrations
 */
export async function migrateToLatest(logger: Logger, config: Config) {
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

  const db = new Kysely({
    dialect,
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, "./migrations"),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      logger.info(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      logger.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    logger.error("failed to migrate");
    logger.error(error);
    process.exit(1);
  }

  await db.destroy();
}
