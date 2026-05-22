export const apiClient = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  let data;

  try {
    data = await res.json(); // ✅ always try to read response
  } catch {
    data = null;
  }

  if (!res.ok) {
    // ✅ use backend message if available
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
};