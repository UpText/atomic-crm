import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { memoryStore, type AuthProvider, type I18nProvider } from "ra-core";
import type { CrmDataProvider } from "../types";
import { withProfileLanguage } from "./profileLanguage";

beforeEach(() => {
  vi.stubGlobal("navigator", { language: "nb-NO", languages: ["nb-NO"] });
});
afterEach(() => vi.unstubAllGlobals());

function setup() {
  let userId = 1;
  let locale = "de";
  const store = memoryStore({ locale: "de" });
  store.setup();
  const profiles: Record<number, string | null> = { 1: "fr", 2: "sv", 3: null };
  const getOne = vi.fn(async (_resource: string, { id }: { id: number }) => ({
    data: { id, language: profiles[id] },
  }));
  const authProvider = {
    login: vi.fn(async ({ id }) => {
      userId = id;
    }),
    handleCallback: vi.fn(async () => {
      userId = 2;
    }),
    logout: vi.fn(async () => {}),
    getIdentity: vi.fn(async () => ({
      id: userId,
      fullName: `User ${userId}`,
    })),
  } as unknown as AuthProvider;
  const i18nProvider = {
    getLocale: () => locale,
    getLocales: () =>
      ["en", "nb", "fr", "sv", "de"].map((locale) => ({
        locale,
        name: locale,
      })),
    changeLocale: vi.fn(async (next: string) => {
      locale = next;
    }),
  } as unknown as I18nProvider;
  const wrapped = withProfileLanguage(
    authProvider,
    { getOne } as unknown as CrmDataProvider,
    i18nProvider,
    store,
  );
  return { wrapped, store, profiles, getOne, i18nProvider, authProvider };
}

describe("profile language", () => {
  it("loads the profile on an existing session, overriding a browser-local choice", async () => {
    const { wrapped, store, getOne } = setup();
    expect(await wrapped.getIdentity!()).toEqual({ id: 1, fullName: "User 1" });
    expect(getOne).toHaveBeenCalledWith("sales", { id: 1 });
    expect(store.getItem("locale")).toBe("fr");
  });

  it("switches users and falls back to the browser for a user without a preference", async () => {
    const { wrapped, store } = setup();
    await wrapped.login({ id: 1 });
    expect(store.getItem("locale")).toBe("fr");
    await wrapped.logout({});
    expect(store.getItem("locale")).toBe("nb");
    await wrapped.login({ id: 2 });
    expect(store.getItem("locale")).toBe("sv");
    await wrapped.login({ id: 3 });
    expect(store.getItem("locale")).toBe("nb");
  });

  it("uses English when both the profile and browser language are unsupported", async () => {
    vi.stubGlobal("navigator", { language: "es-ES", languages: ["es-ES"] });
    const { wrapped, profiles, store } = setup();
    profiles[1] = "es";
    await wrapped.login({ id: 1 });
    expect(store.getItem("locale")).toBe("en");
  });

  it("loads preferences after an OAuth callback", async () => {
    const { wrapped, store } = setup();
    await wrapped.handleCallback!({});
    expect(store.getItem("locale")).toBe("sv");
  });

  it("does not keep another user's language when the profile lookup fails", async () => {
    const { wrapped, store, getOne } = setup();
    getOne.mockRejectedValue(new Error("Offline"));
    await wrapped.login({ id: 2 });
    expect(store.getItem("locale")).toBe("nb");
  });

  it("ignores a previous session's profile lookup after switching accounts", async () => {
    const { wrapped, store, getOne } = setup();
    let finish!: (value: { data: { id: number; language: string } }) => void;
    getOne.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const oldIdentity = wrapped.getIdentity!();
    await vi.waitFor(() => expect(getOne).toHaveBeenCalled());
    await wrapped.logout({});
    await wrapped.login({ id: 2 });
    finish({ data: { id: 1, language: "fr" } });
    await oldIdentity;
    expect(store.getItem("locale")).toBe("sv");
  });

  it("does not reload the profile while an immediate language change is being saved", async () => {
    const { wrapped, store, getOne } = setup();
    await wrapped.getIdentity!();
    store.setItem("locale", "de");
    await wrapped.getIdentity!();
    expect(store.getItem("locale")).toBe("de");
    expect(getOne).toHaveBeenCalledTimes(1);
  });
  it("uses the browser default if authentication cannot resolve a profile ID", async () => {
    const { wrapped, authProvider, store, getOne } = setup();
    vi.mocked(authProvider.getIdentity!).mockResolvedValue({ id: undefined! });
    await wrapped.login({ id: 2 });
    expect(store.getItem("locale")).toBe("nb");
    expect(getOne).not.toHaveBeenCalled();
  });
});
