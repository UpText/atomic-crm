import type { Tenant } from "../types";
import { TenantCreate } from "./TenantCreate";
import { TenantEdit } from "./TenantEdit";
import { TenantList } from "./TenantList";

export default {
  list: TenantList,
  create: TenantCreate,
  edit: TenantEdit,
  recordRepresentation: (record: Tenant) => record.display_name || record.name,
};
