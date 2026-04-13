import { required } from "ra-core";
import { BooleanInput } from "@/components/admin/boolean-input";
import { TextInput } from "@/components/admin/text-input";

type TenantInputsProps = {
  isCreate?: boolean;
};

export function TenantInputs({ isCreate = false }: TenantInputsProps) {
  return (
    <div className="space-y-4 w-full">
      <TextInput
        source={isCreate ? "tenant" : "name"}
        validate={required()}
        helperText={false}
        readOnly={!isCreate}
      />
      <TextInput source="display_name" helperText={false} />
      {isCreate ? (
        <>
          <TextInput
            source="admin_email"
            label="resources.tenants.fields.admin_email"
            type="email"
            validate={required()}
            helperText={false}
          />
          <TextInput
            source="password"
            label="resources.tenants.fields.password"
            validate={required()}
            helperText={false}
          />
        </>
      ) : (
        <BooleanInput source="active" helperText={false} />
      )}
    </div>
  );
}
