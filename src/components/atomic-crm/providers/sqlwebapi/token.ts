const AUTH_STORAGE_KEY = "auth";
const USER_STORAGE_KEY = "user";

type JwtPayload = {
  exp?: number;
};

const decodeBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  const padded =
    padding === 0 ? normalized : normalized + "=".repeat(4 - padding);
  return atob(padded);
};

const parseJwtPayload = (token: string): JwtPayload | null => {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(parts[1])) as JwtPayload;
  } catch {
    return null;
  }
};

export const getStoredAuth = () => {
  const rawAuth = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawAuth) {
    return null;
  }

  try {
    return JSON.parse(rawAuth);
  } catch {
    return null;
  }
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};

export const isTokenExpired = (token: string | null | undefined) => {
  if (!token) {
    return true;
  }

  const payload = parseJwtPayload(token);
  if (!payload?.exp) {
    return false;
  }

  return payload.exp <= Math.floor(Date.now() / 1000);
};

export const ensureValidStoredAuth = () => {
  const auth = getStoredAuth();
  const token = auth?.token;

  if (isTokenExpired(token)) {
    clearStoredAuth();
    return null;
  }

  return auth;
};
