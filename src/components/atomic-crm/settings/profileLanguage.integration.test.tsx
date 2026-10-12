vi.mock("../providers/sqlwebapi/runtimeConfig", () => ({
  hasSqlWebApiUrl: () => true,
}));

import { describe, expect, it, vi } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import {
  CoreAdminContext,
  memoryStore,
  useGetIdentity,
  useTranslate,
  type AuthProvider,
} from "ra-core";
import englishMessages from "ra-language-english";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { render } from "vitest-browser-react";
import { useProfileLanguage } from "./useProfileLanguage";
import type { CrmDataProvider } from "../providers/types";
import { withProfileLanguage } from "../providers/commons/profileLanguage";

function Harness() {
  const { locale, setLocale, isPending } = useProfileLanguage();
  const { identity } = useGetIdentity();
  const translate = useTranslate();
  return (
    <button disabled={isPending || !identity} onClick={() => setLocale("nb")}>
      {locale}: {translate("language")}
    </button>
  );
}

function setup(salesUpdate: ReturnType<typeof vi.fn>) {
  const store = memoryStore();
  const queryClient = new QueryClient();
  const i18nProvider = polyglotI18nProvider(
    (locale) => ({
      ...englishMessages,
      language: locale === "nb" ? "Språk" : "Language",
    }),
    "en",
    [
      { locale: "en", name: "English" },
      { locale: "nb", name: "Norsk" },
    ],
  );
  const provider = {
    getOne: vi.fn(async () => ({ data: { id: 42, language: "en" } })),
    salesUpdate,
  } as unknown as CrmDataProvider;
  const authProvider = withProfileLanguage(
    {
      getIdentity: async () => ({ id: 42 }),
      login: async () => {},
      checkAuth: async () => {},
      checkError: async () => {},
      logout: async () => {},
    } as AuthProvider,
    provider,
    i18nProvider,
    store,
  );
  const App = () => (
    <CoreAdminContext
      queryClient={queryClient}
      store={store}
      i18nProvider={i18nProvider}
      dataProvider={provider}
      authProvider={authProvider}
    >
      <Harness />
    </CoreAdminContext>
  );
  return { App, store, provider };
}

describe("profile language with React Admin", () => {
  it("keeps the selector disabled through the locale remount and saves to the profile", async () => {
    let finish!: () => void;
    const salesUpdate = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    const { App, store } = setup(salesUpdate);
    const screen = await render(<App />);
    await expect
      .element(screen.getByRole("button", { name: "en: Language" }))
      .toBeEnabled();
    await screen.getByRole("button", { name: "en: Language" }).click();
    await expect
      .element(screen.getByRole("button", { name: "nb: Språk" }))
      .toBeDisabled();
    expect(salesUpdate).toHaveBeenCalledWith(42, { language: "nb" });
    finish();
    await expect
      .element(screen.getByRole("button", { name: "nb: Språk" }))
      .toBeEnabled();
    expect(store.getItem("locale")).toBe("nb");
  });

  it("rolls back both the locale and translated content after a failed save", async () => {
    let fail!: (error: Error) => void;
    const salesUpdate = vi.fn(
      () =>
        new Promise<void>((_resolve, reject) => {
          fail = reject;
        }),
    );
    const { App } = setup(salesUpdate);
    const screen = await render(<App />);
    await expect
      .element(screen.getByRole("button", { name: "en: Language" }))
      .toBeEnabled();
    await screen.getByRole("button", { name: "en: Language" }).click();
    await expect
      .element(screen.getByRole("button", { name: "nb: Språk" }))
      .toBeDisabled();
    fail(new Error("Save failed"));
    await expect
      .element(screen.getByRole("button", { name: "en: Language" }))
      .toBeEnabled();
  });
});
