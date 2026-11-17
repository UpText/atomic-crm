import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { completeEntraConnection } from "./entra";

describe("Entra organization connection", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem(
      "auth",
      JSON.stringify({ token: "existing-crm-jwt", tenant: "a" }),
    );
    sessionStorage.setItem(
      "up.entra.connection",
      JSON.stringify({
        verifier: "v".repeat(43),
        tenant: "a",
        created: Date.now(),
      }),
    );
    vi.stubGlobal("__APP_CONFIG__", {
      VITE_SQLWEBAPI_URL: "https://api.example/",
    });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    sessionStorage.clear();
  });
  it("requires the original CRM tenant before exchanging a completion", async () => {
    localStorage.setItem(
      "auth",
      JSON.stringify({ token: "other-jwt", tenant: "b" }),
    );
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(completeEntraConnection("code")).rejects.toThrow(
      "tenant changed",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("preserves CRM authentication and sends the browser verifier with the authenticated completion", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        Response.json({ directoryId: "directory", objectId: "oid" }),
      );
    vi.stubGlobal("fetch", fetchMock);
    expect(await completeEntraConnection("code")).toEqual({
      directoryId: "directory",
      objectId: "oid",
    });
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(
      "Bearer existing-crm-jwt",
    );
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      code: "code",
      verifier: "v".repeat(43),
    });
    expect(JSON.parse(localStorage.getItem("auth")!).token).toBe(
      "existing-crm-jwt",
    );
    expect(sessionStorage.getItem("up.entra.connection")).toBeNull();
    await expect(completeEntraConnection("code")).rejects.toThrow("expired");
  });
  it("fails closed for an expired connection", async () => {
    sessionStorage.setItem(
      "up.entra.connection",
      JSON.stringify({
        verifier: "v",
        tenant: "a",
        created: Date.now() - 18 * 60 * 1000,
      }),
    );
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(completeEntraConnection("code")).rejects.toThrow("expired");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
