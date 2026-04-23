import { useCallback, useEffect, useState } from "react";

export default function useAdminResource(resourceConfig) {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState({
    loading: true,
    error: "",
    data: {
      content: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
    },
  });

  const load = useCallback(async () => {
    setResult((current) => ({ ...current, loading: true, error: "" }));

    try {
      const response = await resourceConfig.service.list({
        page,
        size,
        search: search.trim() || undefined,
      });

      setResult({
        loading: false,
        error: "",
        data: response,
      });
    } catch (error) {
      setResult((current) => ({
        ...current,
        loading: false,
        error: error.message,
      }));
    }
  }, [page, resourceConfig.service, search, size]);

  useEffect(() => {
    load();
  }, [load]);

  async function createItem(payload) {
    await resourceConfig.service.create(payload);
    await load();
  }

  async function updateItem(id, payload) {
    await resourceConfig.service.update(id, payload);
    await load();
  }

  async function deleteItem(id) {
    await resourceConfig.service.remove(id);
    await load();
  }

  async function getItem(id) {
    return resourceConfig.service.getById(id);
  }

  return {
    page,
    setPage,
    size,
    setSize,
    search,
    setSearch,
    result,
    load,
    createItem,
    updateItem,
    deleteItem,
    getItem,
  };
}
