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

describe("SQLWebAPI tenant access", () => {
  afterEach(() => localStorage.clear());

  it.each([
    ["admin", false, true],
    ["admin", true, true],
    ["example", true, false],
    ["example", false, false],
    [undefined, true, false],
  ])(
    "checks tenant %s with administrator=%s",
    async (tenant, administrator, allowed) => {
      const token = `header.${btoa(JSON.stringify({ exp: 4102444800, tenant }))}.signature`;
      localStorage.setItem("auth", JSON.stringify({ token, tenant: "admin" }));
      localStorage.setItem("tenant", "admin");
      localStorage.setItem(
        "user",
        JSON.stringify({ administrator, tenant: "admin" }),
      );

      for (const action of ["list", "show", "create", "edit", "delete"]) {
        await expect(
          authProvider.canAccess({ resource: "tenants", action }),
        ).resolves.toBe(allowed);
      }
      await expect(
        authProvider.canAccess({ resource: "sales", action: "list" }),
      ).resolves.toBe(administrator);
    },
  );

  it("rejects an expired admin tenant session", async () => {
    const token = `header.${btoa(JSON.stringify({ exp: 1, tenant: "admin" }))}.signature`;
    localStorage.setItem("auth", JSON.stringify({ token }));
    await expect(
      authProvider.canAccess({ resource: "tenants", action: "list" }),
    ).resolves.toBe(false);
  });

  it("rejects a missing session", async () => {
    localStorage.clear();
    await expect(
      authProvider.canAccess({ resource: "tenants", action: "list" }),
    ).resolves.toBe(false);
  });
});
