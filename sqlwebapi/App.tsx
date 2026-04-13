import { CRM } from "@/components/atomic-crm/root/CRM";
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
  />
);

export default App;
