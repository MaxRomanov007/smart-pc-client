export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  ms: number,
): (...args: T) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args) => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function debouncedProvider<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  fallback: TResult,
  ms: number,
): (...args: TArgs) => Promise<TResult> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let reject: (() => void) | null = null;

  return (...args) =>
    new Promise((resolve, _) => {
      if (timer !== null) clearTimeout(timer);
      reject?.();
      reject = () => resolve(fallback);

      timer = setTimeout(async () => {
        reject = null;
        try {
          resolve(await fn(...args));
        } catch {
          resolve(fallback);
        }
      }, ms);
    });
}
