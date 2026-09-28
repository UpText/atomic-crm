import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { authProvider } from "./authProvider";

const token = `eyJhbGciOiJub25lIn0.${btoa(JSON.stringify({ exp: 4102444800 }))}.signature`;
const credentials = {
  email: "test@example.com",
  password: "password",
  tenant: "example",
};

describe("SQLWebAPI login", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("__APP_CONFIG__", {
      VITE_SQLWEBAPI_URL: "http://localhost:8081",
      VITE_SQLWEBAPI_SERVICE: "crmapi",
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it.each([
    ["plain text", `  ${token}\n`],
    ["JSON string", JSON.stringify(token)],
    ["legacy JSON object", JSON.stringify({ access_token: token })],
  ])("authenticates with a %s response", async (_format, body) => {
    const user = { id: 1, first_name: "Test", last_name: "User" };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(body))
      .mockResolvedValueOnce(Response.json([user]));
    vi.stubGlobal("fetch", fetchMock);

    await authProvider.login(credentials);

    expect(JSON.parse(localStorage.getItem("auth")!)).toMatchObject({
      token,
      tenant: "example",
    });
    expect(fetchMock.mock.calls[1][1].headers.Authorization).toBe(
      `Bearer ${token}`,
    );
    await expect(authProvider.checkAuth()).resolves.toBeUndefined();
    await expect(authProvider.getIdentity()).resolves.toMatchObject({
      id: 1,
      fullName: "Test User",
    });
  });

  it.each(["", "{}", "null"])("rejects a missing token (%s)", async (body) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(body)));

    await expect(authProvider.login(credentials)).rejects.toThrow(
      "Missing token",
    );
    expect(localStorage.getItem("auth")).toBeNull();
  });

  it("rejects invalid credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("Unauthorized", { status: 401 })),
    );

    await expect(authProvider.login(credentials)).rejects.toThrow(
      "Invalid credentials",
    );
    expect(localStorage.getItem("auth")).toBeNull();
  });
});
