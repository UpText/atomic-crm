import { useMutation } from "@tanstack/react-query";
import {
  useDataProvider,
  useNotify,
  useRedirect,
  useTranslate,
} from "ra-core";
import type { SubmitHandler } from "react-hook-form";
import { SimpleForm } from "@/components/admin/simple-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { CrmDataProvider } from "../providers/types";
import type { TenantFormData } from "../types";
import { TenantInputs } from "./TenantInputs";

export function TenantCreate() {
  const dataProvider = useDataProvider<CrmDataProvider>();
  const notify = useNotify();
  const translate = useTranslate();
  const redirect = useRedirect();

  const { mutate } = useMutation({
    mutationKey: ["tenantCreate"],
    mutationFn: async (data: TenantFormData) =>
      dataProvider.create("tenants", { data }),
    onSuccess: () => {
      notify("resources.tenants.action.create", {
        messageArgs: { _: "Tenant created successfully." },
      });
      redirect("/tenants");
    },
    onError: (error) => {
      notify(
        error.message ||
          translate("resources.tenants.action.create", {
            _: "An error occurred while creating the tenant.",
          }),
        {
          type: "error",
        },
      );
    },
  });

  const onSubmit: SubmitHandler<TenantFormData> = async (data) => {
    mutate(data);
  };

  return (
    <div className="max-w-lg w-full mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {translate("resources.tenants.action.create", {
              _: "Create tenant",
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleForm onSubmit={onSubmit as SubmitHandler<any>}>
            <TenantInputs isCreate />
          </SimpleForm>
        </CardContent>
      </Card>
    </div>
  );
}
