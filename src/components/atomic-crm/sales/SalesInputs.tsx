import {
  email,
  required,
  useGetIdentity,
  useLocales,
  useRecordContext,
} from "ra-core";
import { BooleanInput } from "@/components/admin/boolean-input";
import { SelectInput } from "@/components/admin/select-input";
import { TextInput } from "@/components/admin/text-input";

import { hasSqlWebApiUrl } from "../providers/sqlwebapi/runtimeConfig";
import type { Sale } from "../types";

export function SalesInputs() {
  const { identity } = useGetIdentity();
  const locales = useLocales();
  const record = useRecordContext<Sale>();
  return (
    <div className="space-y-4 w-full">
      <TextInput source="first_name" validate={required()} helperText={false} />
      <TextInput source="last_name" validate={required()} helperText={false} />
      <TextInput
        source="email"
        validate={[required(), email()]}
        helperText={false}
      />
      {hasSqlWebApiUrl() && (
        <SelectInput
          source="language"
          label="crm.language"
          choices={locales}
          optionValue="locale"
          optionText="name"
          translateChoice={false}
          emptyText="crm.language_browser_default"
          parse={(value) => value ?? ""}
          helperText={false}
        />
      )}
      <BooleanInput
        source="administrator"
        readOnly={record?.id === identity?.id}
        helperText={false}
      />
      <BooleanInput
        source="disabled"
        readOnly={record?.id === identity?.id}
        helperText={false}
      />
    </div>
  );
}
