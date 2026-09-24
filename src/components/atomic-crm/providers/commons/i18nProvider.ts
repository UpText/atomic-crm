import { mergeTranslations } from "ra-core";
import polyglotI18nProvider from "ra-i18n-polyglot";
import englishMessages from "ra-language-english";
import frenchMessages from "ra-language-french";
import { raSupabaseEnglishMessages } from "ra-supabase-language-english";
import { raSupabaseFrenchMessages } from "ra-supabase-language-french";
import { englishCrmMessages } from "./englishCrmMessages";
import { frenchCrmMessages } from "./frenchCrmMessages";
import { norwegianCrmMessages } from "./norwegianCrmMessages";
import {
  norwegianAdminMessages,
  norwegianSupabaseMessages,
} from "./norwegianMessages";

import { nynorskCrmMessages } from "./nynorskCrmMessages";
import {
  nynorskAdminMessages,
  nynorskSupabaseMessages,
} from "./nynorskMessages";
import { swedishCrmMessages } from "./swedishCrmMessages";
import {
  swedishAdminMessages,
  swedishSupabaseMessages,
} from "./swedishMessages";
import { danishCrmMessages } from "./danishCrmMessages";
import { danishAdminMessages, danishSupabaseMessages } from "./danishMessages";
import { germanCrmMessages } from "./germanCrmMessages";
import { germanAdminMessages, germanSupabaseMessages } from "./germanMessages";

const raSupabaseEnglishMessagesOverride = {
  "ra-supabase": {
    auth: {
      password_reset: "Check your emails for a Reset Password message.",
    },
  },
};

const raSupabaseFrenchMessagesOverride = {
  "ra-supabase": {
    auth: {
      password_reset:
        "Consultez vos emails pour trouver le message de reinitialisation du mot de passe.",
    },
  },
};

const englishCatalog = mergeTranslations(
  englishMessages,
  raSupabaseEnglishMessages,
  raSupabaseEnglishMessagesOverride,
  englishCrmMessages,
);

const frenchCatalog = mergeTranslations(
  englishCatalog,
  frenchMessages,
  raSupabaseFrenchMessages,
  raSupabaseFrenchMessagesOverride,
  frenchCrmMessages,
);

const norwegianCatalog = mergeTranslations(
  englishCatalog,
  norwegianAdminMessages,
  norwegianSupabaseMessages,
  norwegianCrmMessages,
);

const catalogs = {
  en: englishCatalog,
  fr: frenchCatalog,
  nb: norwegianCatalog,
  nn: mergeTranslations(
    englishCatalog,
    nynorskAdminMessages,
    nynorskSupabaseMessages,
    nynorskCrmMessages,
  ),
  sv: mergeTranslations(
    englishCatalog,
    swedishAdminMessages,
    swedishSupabaseMessages,
    swedishCrmMessages,
  ),
  da: mergeTranslations(
    englishCatalog,
    danishAdminMessages,
    danishSupabaseMessages,
    danishCrmMessages,
  ),
  de: mergeTranslations(
    englishCatalog,
    germanAdminMessages,
    germanSupabaseMessages,
    germanCrmMessages,
  ),
};

type SupportedLocale = keyof typeof catalogs;

const isSupportedLocale = (locale: string): locale is SupportedLocale =>
  Object.prototype.hasOwnProperty.call(catalogs, locale);

export const getInitialLocale = (): SupportedLocale => {
  if (typeof navigator === "undefined") return "en";

  const browserLocale = navigator.languages?.[0] ?? navigator.language;
  const language = browserLocale?.toLowerCase().split("-")[0] ?? "en";
  if (language === "no") return "nb";
  return isSupportedLocale(language) ? language : "en";
};

export const i18nProvider = polyglotI18nProvider(
  (locale) => (isSupportedLocale(locale) ? catalogs[locale] : englishCatalog),
  getInitialLocale(),
  [
    { locale: "en", name: "English" },
    { locale: "fr", name: "Français" },
    { locale: "nb", name: "Norsk bokmål" },
    { locale: "nn", name: "Norsk nynorsk" },
    { locale: "sv", name: "Svenska" },
    { locale: "da", name: "Dansk" },
    { locale: "de", name: "Deutsch" },
  ],
  { allowMissing: true },
);

export const testI18nProvider = polyglotI18nProvider(
  () => englishCatalog,
  "en",
  [{ locale: "en", name: "English" }],
  { allowMissing: true },
);
