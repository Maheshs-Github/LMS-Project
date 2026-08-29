import { useState } from "react";
import { apiClient } from "../utils/apiClient";

export const useMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const mutate = async ({
    url,
  method,
  body,
}) => {
  
  try {
    
    setLoading(true);
    setError(null);

    const res = await apiClient(
      `${url}`,
      {
        method: method.toUpperCase(),

        body:
          body instanceof FormData
            ? body
            : body
              ? JSON.stringify(body)
              : null,
      }
    );

    return res;

  } catch (err) {

    setError(err.message);
    throw err;

  } finally {

    setLoading(false);

  }
};

  return { mutate, loading, error };
};