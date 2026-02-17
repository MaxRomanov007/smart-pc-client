import { useCallback, useEffect, useRef, useState } from "react";
import type { Data } from "@/@types/services/data";

interface UseServiceQueryOptions<T> {
  enabled?: boolean;
  initialData?: T;
}

export default function useServiceQuery<T>(
  queryFn: () => Promise<Data<T>>,
  options: UseServiceQueryOptions<T> = {},
) {
  const { enabled = true, initialData } = options;
  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const ignoreRef = useRef(false);

  const execute = useCallback(async () => {
    if (!enabled) return;

    ignoreRef.current = false;
    setLoading(true);
    setError(null);

    try {
      const result = await queryFn();
      if (ignoreRef.current) return;

      if (result.error) {
        setError(result.error);
        setData(undefined);
        return;
      }

      setData(result.data);
    } catch (err) {
      if (ignoreRef.current) return;
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setData(undefined);
    } finally {
      if (!ignoreRef.current) setLoading(false);
    }
  }, [enabled, queryFn]);

  useEffect(() => {
    execute();

    return () => {
      ignoreRef.current = true;
    };
  }, [execute]);

  return {
    data,
    error,
    loading,
    refetch: execute,
    isSuccess: !loading && !error && data !== undefined,
    isError: !!error,
  } as const;
}
