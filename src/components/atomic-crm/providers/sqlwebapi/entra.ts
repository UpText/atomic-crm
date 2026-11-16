import { getSqlWebApiUrl } from "./runtimeConfig";
import { getStoredAuth, clearStoredAuth } from "./token";

export type EntraSettings = {
  enabled: boolean;
  directoryId: string;
  clientId: string;
  clientSecretUri: string;
  provisioningMode: "invite_only" | "automatic";
};
export const defaultEntraSettings: EntraSettings = {
  enabled: false,
  directoryId: "",
  clientId: "",
  clientSecretUri: "",
  provisioningMode: "invite_only",
};
export const buildEntraUrl = (path: string) => {
  const base = getSqlWebApiUrl();
  if (!base) throw new Error("Missing API configuration");
  return new URL(`auth/entra/${path}`, `${base.replace(/\/+$/, "")}/`);
};
export const entraRequest = async (path: string, init: RequestInit = {}) => {
  const response = await fetch(buildEntraUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(getStoredAuth()?.token
        ? { Authorization: `Bearer ${getStoredAuth().token}` }
        : {}),
      ...init.headers,
    },
  });
  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    throw new Error(
      problem?.detail ??
        "Entra request failed. Check your configuration or contact your administrator.",
    );
  }
  return response.status === 204 ? null : response.json();
};
const base64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

export const startEntraLogin = async (tenant: string) => {
  const normalized = tenant.trim();
  if (!normalized) throw new Error("Enter your CRM tenant first.");
  const verifier = base64Url(crypto.getRandomValues(new Uint8Array(32)));
  const challenge = base64Url(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)),
    ),
  );
  sessionStorage.setItem(
    "up.entra.transaction",
    JSON.stringify({ verifier, tenant: normalized, created: Date.now() }),
  );
  clearStoredAuth();
  const url = buildEntraUrl("start");
  url.searchParams.set("tenant", normalized);
  url.searchParams.set("challenge", challenge);
  url.searchParams.set(
    "returnUri",
    window.location.origin + window.location.pathname,
  );
  window.location.assign(url);
};

export const completeEntraLogin = async (code: string) => {
  const raw = sessionStorage.getItem("up.entra.transaction");
  sessionStorage.removeItem("up.entra.transaction");
  const transaction = raw ? JSON.parse(raw) : null;
  if (
    !transaction?.verifier ||
    Date.now() - transaction.created > 6 * 60 * 1000
  )
    throw new Error("Login expired. Please try again.");
  let response: Response;
  try {
    response = await fetch(buildEntraUrl("complete"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, verifier: transaction.verifier }),
      signal: AbortSignal.timeout(20_000),
    });
  } catch (error) {
    if (
      error instanceof DOMException &&
      (error.name === "TimeoutError" || error.name === "AbortError")
    )
      throw new Error(
        "The API did not respond in time. Please restart sign-in when the API is available.",
      );
    throw error;
  }
  if (!response.ok)
    throw new Error("Login could not be completed. Please try again.");
  const auth = await response.json();
  if (!auth.token || auth.tenant !== transaction.tenant || !auth.user?.id)
    throw new Error("Invalid login response.");
  localStorage.setItem(
    "auth",
    JSON.stringify({ token: auth.token, tenant: auth.tenant }),
  );
  localStorage.setItem("tenant", auth.tenant);
  localStorage.setItem("user", JSON.stringify(auth.user));
};
