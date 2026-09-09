import { useState, useCallback, useEffect } from 'react';

interface UseLoadingState {
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export function useLoadingState(): UseLoadingState {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    loading,
    error,
    setLoading,
    setError,
  };
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setValue(null);
    setError(null);
    try {
      const response = await asyncFunction();
      setValue(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
      setStatus('error');
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
}
