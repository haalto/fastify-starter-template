import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { app } from "../../src/app";
import { createTodoService } from "../../src/services/todoService";

import { createDb } from "../../src/data-layer/db";
import pino from "pino";
import { migrateToLatest } from "../../src/migrator";
import { createFakeCache } from "../../src/data-layer/cache";

const extractDbConfigFromContainer = (
  container: StartedPostgreSqlContainer
) => {
  return {
    host: container.getHost(),
    port: container.getFirstMappedPort(),
    name: container.getDatabase(),
    password: container.getPassword(),
    user: container.getUsername(),
  };
};

export const createTestAppWithDb = async () => {
  const container = await new PostgreSqlContainer()
    .withDatabase("testDb")
    .start();
  const dbConfig = extractDbConfigFromContainer(container);
  await migrateToLatest(pino(), dbConfig);
  const logger = pino();
  const db = createDb(dbConfig);
  const cache = createFakeCache();
  const todoService = createTodoService(logger, db, cache);

  const testComponents = {
    todoService,
  };
  const testApp = await app(testComponents, { logger: logger });
  const close = async () => {
    await db.destroy();
    await container.stop();
    await testApp.close();
  };

  return { testApp, close };
};
