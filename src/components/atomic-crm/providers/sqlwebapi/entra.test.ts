import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildEntraUrl,
  completeEntraLogin,
  defaultEntraSettings,
} from "./entra";

const transaction = {
  tenant: "customer-a",
  verifier: "a".repeat(43),
  created: Date.now(),
};
describe("SQLWebAPI Entra login", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.stubGlobal("__APP_CONFIG__", {
      VITE_SQLWEBAPI_URL: "https://api.example/",
      VITE_SQLWEBAPI_SERVICE: "crmapi",
    });
    sessionStorage.setItem("up.entra.transaction", JSON.stringify(transaction));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    sessionStorage.clear();
  });
  it("defaults to disabled, invite-only access", () => {
    expect(defaultEntraSettings).toMatchObject({
      enabled: false,
      provisioningMode: "invite_only",
    });
    expect(buildEntraUrl("complete").toString()).toBe(
      "https://api.example/auth/entra/complete",
    );
  });
  it("exchanges the single-use code with the browser verifier and stores server identity", async () => {
    const user = { id: 42, email: "new@example.com", administrator: false };
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        Response.json({ token: "app-jwt", tenant: "customer-a", user }),
      );
    vi.stubGlobal("fetch", fetchMock);
    await completeEntraLogin("one-time-code");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      code: "one-time-code",
      verifier: transaction.verifier,
    });
    expect(JSON.parse(localStorage.getItem("user")!)).toEqual(user);
    expect(JSON.parse(localStorage.getItem("auth")!)).toEqual({
      token: "app-jwt",
      tenant: "customer-a",
    });
    expect(sessionStorage.getItem("up.entra.transaction")).toBeNull();
  });
  it("rejects a session returned for a different CRM tenant", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json({
          token: "app-jwt",
          tenant: "customer-b",
          user: { id: 42 },
        }),
      ),
    );
    await expect(completeEntraLogin("code")).rejects.toThrow(
      "Invalid login response",
    );
    expect(localStorage.getItem("auth")).toBeNull();
  });
  it("rejects expired or missing browser transactions without calling the API", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    sessionStorage.setItem(
      "up.entra.transaction",
      JSON.stringify({ ...transaction, created: Date.now() - 7 * 60 * 1000 }),
    );
    await expect(completeEntraLogin("code")).rejects.toThrow("expired");
    await expect(completeEntraLogin("code")).rejects.toThrow("expired");
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("reports an API timeout without storing a session", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockRejectedValue(
          new DOMException("Request timed out", "TimeoutError"),
        ),
    );
    await expect(completeEntraLogin("code")).rejects.toThrow(
      "API did not respond in time",
    );
    expect(localStorage.getItem("auth")).toBeNull();
  });
  it("never stores authentication after an unsuccessful exchange", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("", { status: 401 })),
    );
    await expect(completeEntraLogin("code")).rejects.toThrow();
    expect(localStorage.getItem("auth")).toBeNull();
  });
});
