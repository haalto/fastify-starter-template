import axios from "axios";
import { EitherAsync, Right } from "purify-ts";

export const get = (url: string) => {
  return EitherAsync(async ({ liftEither, throwE }) => {
    try {
      const response = await axios.get(url, {
        validateStatus: (status) => status === 200 || status === 404,
      });
      return liftEither(Right(response));
    } catch (error) {
      return throwE(error);
    }
  });
};
