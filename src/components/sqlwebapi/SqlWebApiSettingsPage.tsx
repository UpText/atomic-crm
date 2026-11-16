import { Link } from "react-router";
import { useGetIdentity, useGetOne } from "ra-core";
import { SettingsPage } from "@/components/atomic-crm/settings/SettingsPage";
import { SettingsPageMobile } from "@/components/atomic-crm/settings/SettingsPageMobile";
import {
  SettingsExtensionContext,
  type SettingsExtension,
} from "@/components/atomic-crm/settings/SettingsExtensionContext";
import type { ConfigurationContextValue } from "@/components/atomic-crm/root/ConfigurationContext";
import {
  defaultEntraSettings,
  type EntraSettings,
} from "@/components/atomic-crm/providers/sqlwebapi/entra";
import { EntraSettingsFields } from "./EntraSettingsFields";

type SqlConfiguration = ConfigurationContextValue & {
  authentication?: { entra?: EntraSettings };
};
const sqlWebApiSettingsExtension: SettingsExtension = {
  fields: <EntraSettingsFields />,
  sections: [
    {
      id: "authentication",
      label: "crm.settings.sections.authentication",
      fallback: "Microsoft Entra login",
    },
  ],
  defaults: (config) => {
    const authentication = (config as SqlConfiguration).authentication;
    return {
      authentication: {
        ...authentication,
        entra: { ...defaultEntraSettings, ...authentication?.entra },
      },
    };
  },
  transform: (values) => ({ authentication: values.authentication }),
  preserveOnReset: (values) => ({ authentication: values.authentication }),
};

export function SqlWebApiSettingsPage() {
  return (
    <SettingsExtensionContext.Provider value={sqlWebApiSettingsExtension}>
      <SettingsPage />
    </SettingsExtensionContext.Provider>
  );
}
export function SqlWebApiMobileSettingsPage() {
  return <SettingsPageMobile additionalSections={<TenantSettingsLink />} />;
}
function TenantSettingsLink() {
  const { identity } = useGetIdentity();
  const { data } = useGetOne(
    "sales",
    { id: identity?.id },
    { enabled: !!identity?.id },
  );
  return data?.administrator ? (
    <Link className="underline" to="/tenant-settings">
      Tenant settings and Entra login
    </Link>
  ) : null;
}
