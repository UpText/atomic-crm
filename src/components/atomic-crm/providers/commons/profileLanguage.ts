import type { AuthProvider, I18nProvider, Store, UserIdentity } from "ra-core";
import type { CrmDataProvider } from "../types";
import type { Sale } from "../../types";
import { getInitialLocale } from "./i18nProvider";

/** The database profile is authoritative; the store only caches the active locale. */
export const withProfileLanguage = (
  authProvider: AuthProvider,
  dataProvider: CrmDataProvider,
  i18nProvider: I18nProvider,
  store: Store,
): AuthProvider => {
  let session = 0;
  let request = 0;
  let loadedIdentity: UserIdentity["id"] | undefined;
  const initialLocale = i18nProvider.getLocale();
  const resolveLocale = (language?: string | null) => {
    const locales = i18nProvider.getLocales?.();
    const supported = (locale: string) =>
      !locales || locales.some((entry) => entry.locale === locale);
    return [
      language,
      getInitialLocale(),
      "en",
      locales?.[0]?.locale,
      initialLocale,
    ].find((locale): locale is string => !!locale && supported(locale))!;
  };
  const applyLocale = async (language?: string | null) => {
    const locale = resolveLocale(language);
    // Let I18nContextProvider change the catalog and rerender translated content.
    store.setItem("locale", locale);
  };
  const loadLanguage = async (identity: UserIdentity) => {
    if (identity.id == null) {
      await applyLocale();
      return;
    }
    if (loadedIdentity === identity.id) return;
    const currentSession = session;
    const currentRequest = ++request;
    let language: string | null | undefined;
    try {
      const { data } = await dataProvider.getOne<Sale>("sales", {
        id: identity.id,
      });
      language = data.language;
    } catch {
      // A profile lookup failure must not prevent login or reuse another user's locale.
    }
    if (session === currentSession && request === currentRequest) {
      loadedIdentity = identity.id;
      await applyLocale(language);
    }
  };
  const getIdentity: AuthProvider["getIdentity"] = authProvider.getIdentity
    ? async (params) => {
        const currentSession = session;
        const identity = await authProvider.getIdentity!(params);
        if (session === currentSession) await loadLanguage(identity);
        return identity;
      }
    : undefined;

  return {
    ...authProvider,
    getIdentity,
    login: async (params) => {
      ++session;
      loadedIdentity = undefined;
      const result = await authProvider.login(params);
      if (getIdentity) await getIdentity();
      else await applyLocale();
      return result;
    },
    ...(authProvider.handleCallback && {
      handleCallback: async (params: any) => {
        ++session;
        loadedIdentity = undefined;
        const result = await authProvider.handleCallback!(params);
        if (getIdentity) await getIdentity();
        else await applyLocale();
        return result;
      },
    }),
    logout: async (params) => {
      ++session;
      loadedIdentity = undefined;
      const result = await authProvider.logout(params);
      // Logout resets the store, so also reset the catalog retained in memory.
      await i18nProvider.changeLocale(resolveLocale());
      await applyLocale();
      return result;
    },
  };
};
