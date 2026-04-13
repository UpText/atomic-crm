import { useMutation } from "@tanstack/react-query";
import {
  useDataProvider,
  useEditController,
  useNotify,
  useRecordContext,
  useRedirect,
} from "ra-core";
import type { SubmitHandler } from "react-hook-form";
import { SimpleForm } from "@/components/admin/simple-form";
import { CancelButton } from "@/components/admin/cancel-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { SaveButton } from "@/components/admin/form";
import { Card, CardContent } from "@/components/ui/card";

import type { CrmDataProvider } from "../providers/types";
import type { Tenant, TenantFormData } from "../types";
import { TenantInputs } from "./TenantInputs";

function EditToolbar() {
  const record = useRecordContext<Tenant>();

  return (
    <div className="flex justify-end gap-4">
      {record?.active ? null : <DeleteButton />}
      <CancelButton />
      <SaveButton />
    </div>
  );
}

export function TenantEdit() {
  const { record } = useEditController<Tenant>();
  const dataProvider = useDataProvider<CrmDataProvider>();
  const notify = useNotify();
  const redirect = useRedirect();

  const { mutate } = useMutation({
    mutationKey: ["tenantUpdate", record?.id],
    mutationFn: async (data: TenantFormData) => {
      if (!record) {
        throw new Error("Record not found");
      }
      return dataProvider.update("tenants", {
        id: record.id,
        data,
        previousData: record,
      });
    },
    onSuccess: () => {
      redirect("/tenants");
      notify("resources.tenants.action.edit", {
        messageArgs: { _: "Tenant updated successfully." },
      });
    },
    onError: () => {
      notify("An error occurred. Please try again.", {
        type: "error",
      });
    },
  });

  const onSubmit: SubmitHandler<TenantFormData> = async (data) => {
    mutate(data);
  };

  return (
    <div className="max-w-lg w-full mx-auto mt-8">
        <Card>
          <CardContent>
            <SimpleForm
              toolbar={<EditToolbar />}
              onSubmit={onSubmit as SubmitHandler<any>}
              record={record}
            >
              <TenantInputs />
            </SimpleForm>
          </CardContent>
        </Card>
    </div>
  );
}
