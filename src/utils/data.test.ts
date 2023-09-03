import { getNonEmptyKeyValuePairs } from "./data";

describe.only("data utils tests", () => {
  it("should return object with non empty key value pairs filtered out", () => {
    const obj = {
      foo: "bar",
      bar: undefined,
      baz: null,
    };
    const result = getNonEmptyKeyValuePairs<typeof obj>(obj);
    expect(result).toEqual({ foo: "bar" });
  });
});
