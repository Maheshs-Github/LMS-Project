
import { logout } from "../redux/AuthSlice";
import { store } from "../store";
import BASE_URL from "./BASE_URL";

let refreshPromise = null;

export const refreshSession = async () => {
  if (!refreshPromise) {
    console.log("In refresh fun");
    refreshPromise = fetch(`${BASE_URL}user/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Session refresh failed");
        }

        return res.json();
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const apiClient = async (url, options = {}, hasRetried = false) => {
const { responseType, ...fetchOptions } = options;

const res = await fetch(`${BASE_URL}${url}`, {
  ...fetchOptions,
  credentials: "include",
  headers: {
    ...(fetchOptions.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...fetchOptions.headers,
  },
});

 let data;

if (options.responseType === "blob") {
  data = await res.blob();
} else {
  try {
    data = await res.json();
  } catch {
    data = null;
  }
}

  console.log("API response:", url, res.status, "Retried:", hasRetried);
  if (res.status === 401 && !hasRetried) {
    // Don't refresh recursively when login or refresh itself fails.
    const isAuthEndpoint =
      url.includes("/api/v1/user/login") ||
      url.includes("/api/v1/user/register") ||
      url.includes("/api/v1/user/refresh") ||
      url.includes("/api/v1/user/logout");

    if (!isAuthEndpoint) {
      try {
        await refreshSession();

        // Retry the original request once using the updated cookies.
        return apiClient(url, options, true);
      } catch {
        store.dispatch(logout());

        throw {
          status: 401,
          message: "Your session has expired. Please log in again.",
        };
      }
    }
  }

  if (!res.ok) {
    throw {
      status: res.status,
      message: data?.message,
      data,
    };
  }

  return data;
};
