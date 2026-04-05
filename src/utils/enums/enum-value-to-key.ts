export function enumValueToKey<T extends Record<string, string | number>>(
  enumObj: T,
  value: string | number,
): keyof T | undefined {
  return (Object.keys(enumObj) as (keyof T)[]).find(
    (key) => enumObj[key] === value,
  );
}
