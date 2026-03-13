// src/authProvider.ts

import {
  clearStoredAuth,
  ensureValidStoredAuth,
} from "./token";

const ensureTrailingSlash = (url: string) => (url.endsWith("/") ? url : `${url}/`);
const USER_STORAGE_KEY = "user";

const pickToken = (auth: any) =>
  auth?.token ??
  auth?.accessToken ??
  auth?.access_token ??
  auth?.jwt ??
  auth?.idToken ??
  null;

const parseJsonSafely = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const extractFirstRecord = (payload: any) => {
  if (Array.isArray(payload)) {
    return payload[0] ?? null;
  }
  if (Array.isArray(payload?.data)) {
    return payload.data[0] ?? null;
  }
  if (payload?.data && typeof payload.data === "object") {
    return payload.data;
  }
  if (payload && typeof payload === "object") {
    return payload;
  }
  return null;
};

const fetchUserByEmail = async ({
  baseUrl,
  service,
  email,
  token,
}: {
  baseUrl: string;
  service: string;
  email: string;
  token: string | null;
}) => {
  const params = new URLSearchParams({
    filter: JSON.stringify({ email }),
    range: JSON.stringify([0, 0]),
    sort: JSON.stringify(["id", "ASC"]),
  });
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${service}/sales?${params.toString()}`, {
    headers,
  });
  if (!response.ok) {
    return null;
  }

  const payload = await parseJsonSafely(response);
  return extractFirstRecord(payload);
};

export const authProvider = {
  // POST your credentials, store tokens/user in storage or cookies
  async login({
    username,
    email,
    password,
    service,
  }: {
    username?: string;
    email?: string;
    password: string;
    service: string;
  }) {
    const swa = import.meta.env.VITE_SQLWEBAPI_URL ?? "";
    const baseUrl = ensureTrailingSlash(swa);
    const normalizedService = service.trim();
    const loginEmail = String(email ?? username ?? "").trim();
    const res = await fetch(`${baseUrl}${normalizedService}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username ?? email, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    const rawAuth = await res.json();
    const auth = { ...rawAuth, token: pickToken(rawAuth) };
    localStorage.setItem("auth", JSON.stringify(auth));
    localStorage.setItem("service", normalizedService);

    if (loginEmail) {
      try {
        const user = await fetchUserByEmail({
          baseUrl,
          service: normalizedService,
          email: loginEmail,
          token: auth.token,
        });
        if (user) {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } else {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
  },

  // Called on navigation to guard routes
  async checkAuth() {
    return ensureValidStoredAuth() ? Promise.resolve() : Promise.reject();
  },

  // Called when a dataProvider call returns an error
  async checkError(error: { status?: number }) {
    const s = error?.status;
    if (s === 401 || s === 403) {
      clearStoredAuth();
      return Promise.reject();
    }
    return Promise.resolve();
  },

  // Log out
  async logout() {
    clearStoredAuth();
  },

  // Optional: user identity for the app bar avatar/name
  async getIdentity() {
    ensureValidStoredAuth();
    const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || "null");
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    return {
      id: user?.id ?? auth.user?.id,
      fullName:
        user?.first_name && user?.last_name
          ? `${user.first_name} ${user.last_name}`
          : auth.user?.name,
      avatar: user?.avatar?.src ?? auth.user?.avatar,
    };
  },

  // Optional: roles/permissions
  async getPermissions() {
    ensureValidStoredAuth();
    const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || "null");
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    if (typeof user?.administrator === "boolean") {
      return user.administrator ? "admin" : "user";
    }
    return auth.user?.role ?? "user";
  },
};

export default authProvider;
