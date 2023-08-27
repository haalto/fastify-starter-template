import { config } from "dotenv";
import { Codec, Either, Right, string } from "purify-ts";

export interface Config {
  port: number;
}

const envCodec = Codec.interface({
  PORT: string,
});

export const getConfig = (): Either<Error, Config> => {
  config();
  return envCodec
    .decode(process.env)
    .mapLeft((error) => new Error(error))
    .map((env) =>
      Right({
        port: parseInt(env.PORT, 10),
      })
    )
    .join();
};
