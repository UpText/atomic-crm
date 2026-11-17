import { useTranslate } from "ra-core";
import { CRM } from "@/components/atomic-crm/root/CRM";
import { Dashboard } from "@/components/atomic-crm/dashboard/Dashboard";
import {
  authProvider,
  dataProvider,
} from "@/components/atomic-crm/providers/sqlwebapi";
import { UpLoginPage } from "@/components/sqlwebapi/UpLoginPage";

import { CRMPageOverridesContext } from "@/components/atomic-crm/root/CRMPageOverridesContext";
import {
  SqlWebApiSettingsPage,
  SqlWebApiMobileSettingsPage,
} from "@/components/sqlwebapi/SqlWebApiSettingsPage";
import { EntraCallback } from "@/components/sqlwebapi/EntraCallback";

import { EntraConnectionCallback } from "@/components/sqlwebapi/EntraConnectionCallback";

const callbackParams = new URLSearchParams(window.location.search);
const callbackCode = callbackParams.get("entra_code");
const callbackError = callbackParams.get("entra_error");
const connectionCode = callbackParams.get("entra_connection");
const connectionError = callbackParams.get("entra_connection_error");
const App = () =>
  connectionCode || connectionError ? (
    <EntraConnectionCallback code={connectionCode} error={connectionError} />
  ) : callbackCode || callbackError ? (
    <EntraCallback code={callbackCode} error={callbackError} />
  ) : (
    <CRMPageOverridesContext.Provider
      value={{
        settingsPage: SqlWebApiSettingsPage,
        mobileSettingsPage: SqlWebApiMobileSettingsPage,
        tenantLoginPage: UpLoginPage,
      }}
    >
      <CRM
        dataProvider={dataProvider}
        authProvider={authProvider}
        loginPage={UpLoginPage}
        dashboard={() => (
          <Dashboard
            welcome={{
              title: "UpTextCrm",
              children: (
                <p className="text-sm">
                  <a
                    href="https://www.uptext.com"
                    className="underline hover:no-underline"
                  >
                    UpTextCrm
                  </a>{" "}
                  <WelcomeDescription />
                </p>
              ),
            }}
          />
        )}
      />
    </CRMPageOverridesContext.Provider>
  );

const WelcomeDescription = () => {
  const translate = useTranslate();
  return <>{translate("crm.dashboard.sqlwebapi_description")}</>;
};

export default App;
