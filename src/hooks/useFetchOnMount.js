import { useCallback, useEffect, useRef, useState } from "react";

function useFetchOnMount(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetcherRef.current();
      setData(result);

      return result;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []); // 🔥 IMPORTANT: NEVER depend on fetcher directly

  useEffect(() => {
    execute();
  }, deps); // 🔥 ONLY REAL DEPENDENCIES (language, etc)

  return {
    data,
    loading,
    error,
    refetch: execute,
    setData,
  };
}

export default useFetchOnMount;
