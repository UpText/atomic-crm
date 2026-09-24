import { afterEach, describe, expect, it, vi } from "vitest";
import { getInitialLocale, i18nProvider } from "./i18nProvider";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("i18nProvider", () => {
  it("registers all supported locales", () => {
    expect(i18nProvider.getLocales?.()).toEqual([
      { locale: "en", name: "English" },
      { locale: "fr", name: "Français" },
      { locale: "nb", name: "Norsk bokmål" },
      { locale: "nn", name: "Norsk nynorsk" },
      { locale: "sv", name: "Svenska" },
      { locale: "da", name: "Dansk" },
      { locale: "de", name: "Deutsch" },
    ]);
  });

  it("translates the language key in french", async () => {
    await i18nProvider.changeLocale("fr");

    expect(i18nProvider.translate("crm.language")).toBe("Langue");
  });

  it("falls back to english for unknown locales", async () => {
    await i18nProvider.changeLocale("es");

    expect(i18nProvider.translate("crm.language")).toBe("Language");
  });

  it("uses customized password reset overrides for en and fr", async () => {
    await i18nProvider.changeLocale("en");
    expect(i18nProvider.translate("ra-supabase.auth.password_reset")).toBe(
      "Check your emails for a Reset Password message.",
    );

    await i18nProvider.changeLocale("fr");
    expect(i18nProvider.translate("ra-supabase.auth.password_reset")).toBe(
      "Consultez vos emails pour trouver le message de reinitialisation du mot de passe.",
    );
  });

  it("translates recently added fr crm keys", async () => {
    await i18nProvider.changeLocale("fr");

    expect(i18nProvider.translate("resources.deals.empty.title")).toBe(
      "Aucune affaire trouvée",
    );
  });

  it("uses browser french locale when available", () => {
    vi.stubGlobal("navigator", {
      language: "fr-FR",
      languages: ["fr-FR", "en-US"],
    });

    expect(getInitialLocale()).toBe("fr");
  });

  it("falls back to english when browser locale is unsupported", () => {
    vi.stubGlobal("navigator", {
      language: "es-ES",
      languages: ["es-ES", "pt-BR"],
    });

    expect(getInitialLocale()).toBe("en");
  });
});

describe("Norwegian Bokmål", () => {
  it.each(["nb", "nb-NO", "no", "no-NO", "NB-no"])(
    "detects browser locale %s",
    (language) => {
      vi.stubGlobal("navigator", { language, languages: [language] });
      expect(getInitialLocale()).toBe("nb");
    },
  );

  it("uses navigator.language when the preferred language list is empty", () => {
    vi.stubGlobal("navigator", { language: "nb-NO", languages: [] });
    expect(getInitialLocale()).toBe("nb");
  });

  it("translates CRM, admin and authentication messages", async () => {
    await i18nProvider.changeLocale("nb");
    expect(i18nProvider.translate("crm.language")).toBe("Språk");
    expect(i18nProvider.translate("ra.action.save")).toBe("Lagre");
    expect(i18nProvider.translate("ra-supabase.auth.forgot_password")).toBe(
      "Glemt passord?",
    );
    expect(
      i18nProvider.translate("resources.contacts.position_at_company", {
        title: "Daglig leder",
        company: "UpText",
      }),
    ).toBe("Daglig leder hos UpText");
    expect(
      i18nProvider.translate("crm.common.task_count", { smart_count: 1 }),
    ).toBe("1 oppgave");
    expect(
      i18nProvider.translate("crm.common.task_count", { smart_count: 3 }),
    ).toBe("3 oppgaver");
    await i18nProvider.changeLocale("en");
    expect(i18nProvider.translate("ra.action.save")).toBe("Save");
  });
});

describe("additional languages", () => {
  it.each([
    ["nn", "nn"],
    ["nn-NO", "nn"],
    ["sv", "sv"],
    ["sv-SE", "sv"],
    ["sv-FI", "sv"],
    ["da", "da"],
    ["da-DK", "da"],
    ["de", "de"],
    ["de-DE", "de"],
    ["de-AT", "de"],
    ["DE-ch", "de"],
  ])("detects browser locale %s as %s", (language, expected) => {
    vi.stubGlobal("navigator", { language, languages: [language] });
    expect(getInitialLocale()).toBe(expected);
  });

  it("defaults to English without a browser", () => {
    vi.stubGlobal("navigator", undefined);
    expect(getInitialLocale()).toBe("en");
  });

  it.each([
    ["nn", "Språk", "Lagre", "Gløymt passord?", "1 oppgåve", "3 oppgåver"],
    ["sv", "Språk", "Spara", "Glömt lösenordet?", "1 uppgift", "3 uppgifter"],
    ["da", "Sprog", "Gem", "Glemt adgangskode?", "1 opgave", "3 opgaver"],
    [
      "de",
      "Sprache",
      "Speichern",
      "Passwort vergessen?",
      "1 Aufgabe",
      "3 Aufgaben",
    ],
  ])(
    "switches to %s with working messages and plurals",
    async (locale, language, save, forgot, singular, plural) => {
      await i18nProvider.changeLocale(locale);
      expect(i18nProvider.translate("crm.language")).toBe(language);
      expect(i18nProvider.translate("ra.action.save")).toBe(save);
      expect(i18nProvider.translate("ra-supabase.auth.forgot_password")).toBe(
        forgot,
      );
      expect(
        i18nProvider.translate("crm.common.task_count", { smart_count: 1 }),
      ).toBe(singular);
      expect(
        i18nProvider.translate("crm.common.task_count", { smart_count: 3 }),
      ).toBe(plural);
      expect(
        i18nProvider.translate("resources.companies.added_on", {
          date: "23/09/2026",
        }),
      ).toContain("23/09/2026");
      await i18nProvider.changeLocale("en");
      expect(i18nProvider.translate("ra.action.save")).toBe("Save");
    },
  );
});
