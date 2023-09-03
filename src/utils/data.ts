export const getNonEmptyKeyValuePairs = <T extends Record<string, unknown>>(
  obj: T
): { [K in keyof T]: NonNullable<T[K]> } => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null)
  ) as { [K in keyof T]: NonNullable<T[K]> };
};
