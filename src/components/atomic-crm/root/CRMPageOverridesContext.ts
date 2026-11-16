import { createContext } from "react";
import type { ComponentType } from "react";

/** Optional entry-point-specific pages. The shared CRM has no provider-specific defaults. */
export const CRMPageOverridesContext = createContext<{
  settingsPage?: ComponentType;
  mobileSettingsPage?: ComponentType;
  tenantLoginPage?: ComponentType;
}>({});
