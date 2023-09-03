import { createFakeCache } from "./cache";

describe("Cache tests", () => {
  it("should set and get a value", async () => {
    const cache = createFakeCache();
    const key = "test";
    const value = { foo: "bar" };
    cache.set(key, value);
    const result = await cache.get(key);
    expect(result).toEqual(value);
  });

  it("should return null if key does not exist", async () => {
    const cache = createFakeCache();
    const key = "test";
    const result = await cache.get(key);
    expect(result).toEqual(null);
  });

  it("should invalidate a key", async () => {
    const cache = createFakeCache();
    const key = "test";
    const value = { foo: "bar" };
    cache.set(key, value);
    cache.invalidate(key);
    const result = await cache.get(key);
    expect(result).toEqual(null);
  });
});
