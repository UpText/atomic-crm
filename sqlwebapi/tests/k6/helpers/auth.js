import http from "k6/http";

export const apiUrl = (__ENV.API_URL || "http://localhost:5092/crmapi").replace(
  /\/+$/,
  "",
);

export function login() {
  for (const key of ["USERNAME", "PASSWORD", "TENANT"]) {
    if (!__ENV[key]) throw new Error(`Set ${key} before running k6`);
  }

  const response = http.post(
    `${apiUrl}/login`,
    JSON.stringify({
      username: __ENV.USERNAME,
      password: __ENV.PASSWORD,
      tenant: __ENV.TENANT,
    }),
    {
      headers: { "Content-Type": "application/json" },
      tags: { operation: "login" },
      timeout: "10s",
      redirects: 0,
    },
  );
  if (response.status !== 200) {
    throw new Error(
      `Login failed: HTTP ${response.status}; check API_URL and credentials`,
    );
  }

  let auth;
  try {
    auth = response.json();
  } catch {
    auth = response.body;
  }
  const token =
    typeof auth === "string"
      ? auth
      : (auth?.token ??
        auth?.accessToken ??
        auth?.access_token ??
        auth?.jwt ??
        auth?.idToken);
  if (typeof token !== "string" || !token.trim()) {
    throw new Error("Login returned no token");
  }
  return { token: token.trim() };
}
