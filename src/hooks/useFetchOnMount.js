import { useCallback, useEffect, useState } from "react";

function useFetchOnMount(fetcher, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetcher();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute().catch(() => {});
  }, [execute]);

  return {
    data,
    loading,
    error,
    refetch: execute,
    setData,
  };
}

export default useFetchOnMount;
