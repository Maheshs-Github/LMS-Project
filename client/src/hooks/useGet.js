import { apiClient } from "@/utils/apiClient";
import { useEffect, useState } from "react";

export const useGet = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!url) return null;

    try {
      setLoading(true);
      setError(null);
      const res = await apiClient(url);
      setData(res);
      return res;
    } catch (err) {
      setError(err);
      // throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!url) return;
    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
};
