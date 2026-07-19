import { useEffect, useState } from "react";

interface FetchState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export function useFetchJSON<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ao carregar dados: ${res.status}`);
        return res.json();
      })
      .then((json: T) => {
        if (!cancelled) setData(json);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, error, isLoading };
}