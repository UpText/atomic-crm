import { CRM } from "@/components/atomic-crm/root/CRM";
import { Dashboard } from "@/components/atomic-crm/dashboard/Dashboard";
import {
  authProvider,
  dataProvider,
} from "@/components/atomic-crm/providers/sqlwebapi";
import { UpLoginPage } from "@/components/sqlwebapi/UpLoginPage";

const App = () => (
  <CRM
    dataProvider={dataProvider}
    authProvider={authProvider}
    loginPage={UpLoginPage}
    dashboard={() => (
      <Dashboard
        welcome={{
          title: "UpCRM",
          children: (
            <p className="text-sm">
              <a
                href="https://www.uptext.com"
                className="underline hover:no-underline"
              >
                UpCRM
              </a>{" "}
              is a complete CRM system with a SQL Server backend. It is derived
              from{" "}
              <a
                href="https://marmelab.com/atomic-crm"
                className="underline hover:no-underline"
              >
                Atomic CRM
              </a>
              .
            </p>
          ),
        }}
      />
    )}
  />
);

export default App;
