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
