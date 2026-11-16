import { createContext } from "react";
import type { ReactNode } from "react";
import type { ConfigurationContextValue } from "../root/ConfigurationContext";

/** Entry points may extend settings without adding provider code to shared pages. */
export type SettingsExtension = {
  fields?: ReactNode;
  sections?: { id: string; label: string; fallback: string }[];
  defaults?: (config: ConfigurationContextValue) => Record<string, unknown>;
  transform?: (values: Record<string, unknown>) => Record<string, unknown>;
  preserveOnReset?: (
    values: Record<string, unknown>,
  ) => Record<string, unknown>;
};
export const SettingsExtensionContext = createContext<SettingsExtension>({});
