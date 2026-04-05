export function enumEntries<T extends Record<number, string>>(
  e: T,
): [keyof T, T[keyof T]][] {
  return Object.entries(e).filter(([key]) => isNaN(Number(key))) as [
    keyof T,
    T[keyof T],
  ][];
}
