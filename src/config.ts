import { config } from "dotenv";
import { Codec, Either, Right, string } from "purify-ts";

export interface Config {
  port: number;
  db: {
    name: string;
    user: string;
    password: string;
    host: string;
    port: number;
  };
}

const envCodec = Codec.interface({
  PORT: string,
  DB_NAME: string,
  DB_USER: string,
  DB_PASSWORD: string,
  DB_HOST: string,
  DB_PORT: string,
});

export const getConfig = (): Either<Error, Config> => {
  config();
  return envCodec
    .decode(process.env)
    .mapLeft((error) => new Error(error))
    .map((env) =>
      Right({
        port: parseInt(env.PORT, 10),
        db: {
          name: env.DB_NAME,
          user: env.DB_USER,
          password: env.DB_PASSWORD,
          host: env.DB_HOST,
          port: parseInt(env.DB_PORT, 10),
        },
      })
    )
    .join();
};
