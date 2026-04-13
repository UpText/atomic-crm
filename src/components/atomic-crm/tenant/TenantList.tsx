import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { List } from "@/components/admin/list";
import { SearchInput } from "@/components/admin/search-input";

import { TopToolbar } from "../layout/TopToolbar";

const TenantListActions = () => (
  <TopToolbar>
    <CreateButton label="resources.tenants.action.new" />
  </TopToolbar>
);

const filters = [<SearchInput source="q" alwaysOn />];

export function TenantList() {
  return (
    <List
      filters={filters}
      actions={<TenantListActions />}
      sort={{ field: "name", order: "ASC" }}
    >
      <DataTable>
        <DataTable.Col source="name" />
        <DataTable.Col source="display_name" />
        <DataTable.Col
          source="active"
          render={(record) => (record.active ? "Yes" : "No")}
        />
        <DataTable.Col source="admin_email" />
      </DataTable>
    </List>
  );
}
