import { describe, expect, it } from "vitest";
import englishAdminMessages from "ra-language-english";
import { raSupabaseEnglishMessages } from "ra-supabase-language-english";
import { englishCrmMessages } from "./englishCrmMessages";
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

const flatten = (messages: object, prefix = ""): Record<string, string> =>
  Object.fromEntries(
    Object.entries(messages).flatMap(([key, value]) => {
      const path = `${prefix}${key}`;
      return typeof value === "string"
        ? [[path, value]]
        : Object.entries(flatten(value, `${path}.`));
    }),
  );

describe("Translation catalogs", () => {
  it.each([
    ["CRM", englishCrmMessages, norwegianCrmMessages],
    ["admin", englishAdminMessages, norwegianAdminMessages],
    ["authentication", raSupabaseEnglishMessages, norwegianSupabaseMessages],
    ["nynorsk CRM", englishCrmMessages, nynorskCrmMessages],
    ["nynorsk admin", englishAdminMessages, nynorskAdminMessages],
    [
      "nynorsk authentication",
      raSupabaseEnglishMessages,
      nynorskSupabaseMessages,
    ],
    ["swedish CRM", englishCrmMessages, swedishCrmMessages],
    ["swedish admin", englishAdminMessages, swedishAdminMessages],
    [
      "swedish authentication",
      raSupabaseEnglishMessages,
      swedishSupabaseMessages,
    ],
    ["danish CRM", englishCrmMessages, danishCrmMessages],
    ["danish admin", englishAdminMessages, danishAdminMessages],
    [
      "danish authentication",
      raSupabaseEnglishMessages,
      danishSupabaseMessages,
    ],
    ["german CRM", englishCrmMessages, germanCrmMessages],
    ["german admin", englishAdminMessages, germanAdminMessages],
    [
      "german authentication",
      raSupabaseEnglishMessages,
      germanSupabaseMessages,
    ],
  ])(
    "preserves every %s key, placeholder and plural form",
    (_name, english, messages) => {
      const source = flatten(english);
      const translated = flatten(messages);
      expect(Object.keys(translated).sort()).toEqual(
        Object.keys(source).sort(),
      );
      for (const [key, value] of Object.entries(source)) {
        if (value.trim()) {
          expect(translated[key].trim(), key).not.toBe("");
        }
        expect(translated[key].match(/%\{[^}]+\}/g)?.sort() ?? [], key).toEqual(
          value.match(/%\{[^}]+\}/g)?.sort() ?? [],
        );
        expect(translated[key].split("||||").length, key).toBe(
          value.split("||||").length,
        );
      }
    },
  );
});
