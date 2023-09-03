import { FastifyInstance } from "fastify";
import { createTestAppWithDb } from "./setup";

describe("Todo API integration tests", () => {
  let app: FastifyInstance;
  let shutdown: () => Promise<void>;

  beforeAll(async () => {
    const { testApp, close } = await createTestAppWithDb();
    app = testApp;
    shutdown = close;
  });

  afterAll(async () => {
    await shutdown();
  });

  it("should respond with 200 and empty array when no todos", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/todos",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual([]);
  });

  it("should respond with 200 and todos when todos exist", async () => {
    await app.inject({
      method: "POST",
      url: "/api/todos",
      payload: {
        title: "test todo",
        completed: false,
      },
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/todos",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual([
      {
        id: expect.any(Number),
        title: "test todo",
        completed: false,
        createdAt: expect.any(String),
      },
    ]);
  });

  it("should respond with 200 and todo when todo exists", async () => {
    const createResponse = await app.inject({
      method: "POST",
      url: "/api/todos",
      payload: {
        title: "test todo",
        completed: false,
      },
    });

    const todoId = createResponse.json().id;

    const response = await app.inject({
      method: "GET",
      url: `/api/todos/${todoId}`,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual({
      id: todoId,
      title: "test todo",
      completed: false,
      createdAt: expect.any(String),
    });
  });

  it("should respond with 404 when todo does not exist", async () => {
    const response = await app.inject({
      method: "GET",
      url: `/api/todos/312341`,
    });

    expect(response.statusCode).toEqual(404);
  });

  it("should create a new todo", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/todos",
      payload: {
        title: "test todo",
        completed: false,
      },
    });

    expect(response.statusCode).toEqual(201);
    expect(response.json()).toEqual({
      id: expect.any(Number),
      title: "test todo",
      completed: false,
      createdAt: expect.any(String),
    });
  });

  it("should create a new todo with input with extra parameters", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/todos",
      payload: {
        title: "test todo",
        completed: false,
        extra: "extra",
      },
    });

    expect(response.statusCode).toEqual(201);
    expect(response.json()).toEqual({
      id: expect.any(Number),
      title: "test todo",
      completed: false,
      createdAt: expect.any(String),
    });
  });

  it("should respond with 400 with bad parameters", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/todos",
      payload: {
        title: "test todo",
      },
    });

    expect(response.statusCode).toEqual(400);
  });

  it("should respond with 400 with bad parameters", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/todos",
      payload: {
        title: "test todo",
        completed: "not a boolean",
      },
    });

    expect(response.statusCode).toEqual(400);
  });
});
