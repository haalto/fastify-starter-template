import { Config } from "../config";
import Redis from "ioredis";

export interface Cache {
  set: <T extends object>(key: string, value: T) => void;
  invalidate: (key: string) => void;
  get: (key: string) => Promise<string | null>;
}

export const createCache = (config: Config): Cache => {
  const redis = new Redis({
    host: config.redis.host,
    port: config.redis.port,
  });

  const set = <T extends object>(key: string, value: T | Array<T>) => {
    const valueString = JSON.stringify(value);
    redis.set(key, valueString);
  };

  const invalidate = (key: string) => {
    redis.del(key);
  };

  const get = async (key: string) => {
    const value = await redis.get(key);

    if (!value) {
      return null;
    }

    const parsed = JSON.parse(value);
    return parsed;
  };

  return { set, invalidate, get };
};

/**
 * This is a fake cache implementation that uses a Map instead of Redis.
 */
export const createFakeCache = (): Cache => {
  const map = new Map<string, string>();

  const get = async (key: string) => {
    const value = map.get(key);

    if (!value) {
      return null;
    }

    const parsed = JSON.parse(value);
    return parsed;
  };

  const set = async <T extends object>(key: string, value: T | Array<T>) => {
    const valueString = JSON.stringify(value);
    map.set(key, valueString);
  };

  const invalidate = async (key: string) => {
    map.delete(key);
  };

  return {
    get,
    set,
    invalidate,
  };
};
