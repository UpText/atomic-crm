// src/authProvider.ts

import { canAccess } from "../commons/canAccess";
import {
  clearStoredAuth,
  ensureValidStoredAuth,
} from "./token";
import {
  getSqlWebApiService,
  getSqlWebApiUrl,
} from "./runtimeConfig";

const ensureTrailingSlash = (url: string) => (url.endsWith("/") ? url : `${url}/`);
const USER_STORAGE_KEY = "user";
const TENANT_STORAGE_KEY = "tenant";

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

const isAdministrator = (value: unknown) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();
    if (normalizedValue === "true") {
      return true;
    }
    if (normalizedValue === "false") {
      return false;
    }
  }

  return false;
};

const getStoredUser = () =>
  JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || "null");

const getStoredAuth = () => JSON.parse(localStorage.getItem("auth") || "{}");

const getConfiguredService = () => {
  const service = getSqlWebApiService()?.trim();
  if (!service) {
    throw new Error("Missing SQLWebAPI service configuration");
  }
  return service;
};

const fetchUserByEmail = async ({
  baseUrl,
  email,
  token,
}: {
  baseUrl: string;
  email: string;
  token: string | null;
}) => {
  const service = getConfiguredService();
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
    tenant,
  }: {
    username?: string;
    email?: string;
    password: string;
    tenant: string;
  }) {
    const swa = getSqlWebApiUrl() ?? "";
    const baseUrl = ensureTrailingSlash(swa);
    const service = getConfiguredService();
    const loginEmail = String(email ?? username ?? "").trim();
    const normalizedTenant = String(tenant ?? "").trim();
    const res = await fetch(`${baseUrl}${service}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username ?? email,
        password,
        tenant: normalizedTenant,
      }),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    const rawAuth = await res.json();
    const auth = { ...rawAuth, token: pickToken(rawAuth), tenant: normalizedTenant };
    localStorage.setItem("auth", JSON.stringify(auth));
    localStorage.setItem(TENANT_STORAGE_KEY, normalizedTenant);

    if (loginEmail) {
      try {
        const user = await fetchUserByEmail({
          baseUrl,
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
    localStorage.removeItem(TENANT_STORAGE_KEY);
  },

  // Optional: user identity for the app bar avatar/name
  async getIdentity() {
    ensureValidStoredAuth();
    const user = getStoredUser();
    const auth = getStoredAuth();
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
    const user = getStoredUser();
    const auth = getStoredAuth();
    if (user != null) {
      return isAdministrator(user.administrator) ? "admin" : "user";
    }
    return auth.user?.role ?? "user";
  },

  async canAccess(params: any) {
    ensureValidStoredAuth();
    const role = await this.getPermissions();
    return canAccess(role, params);
  },
};

export default authProvider;
