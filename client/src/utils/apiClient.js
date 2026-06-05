import BASE_URL from "./BASE_URL";

export const apiClient = async (url, options = {}) => {
  console.log("Method:", options.method);
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,

    credentials: "include",

    // headers: {
    //   "Content-Type": "application/json",
    //   ...options.headers,
    // },
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : {
            "Content-Type": "application/json",
          }),

      ...options.headers,
    },
  });

  let data;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
};
