export const handleUnknownError = (error: unknown) => {
  if (error instanceof Error) {
    return error;
  } else {
    return new Error("Unknown error");
  }
};
