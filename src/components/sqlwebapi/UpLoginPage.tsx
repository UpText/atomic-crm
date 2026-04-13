import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { FieldValues } from "react-hook-form";
import { LoginPage } from "@/components/atomic-crm/login/LoginPage";
import { BooleanInput } from "@/components/admin/boolean-input";

type UpLoginPageProps = {
  redirectTo?: string;
};

const TENANT_STORAGE_KEY = "up.login.tenant";
const EMAIL_STORAGE_KEY = "up.login.email";
const REMEMBER_STORAGE_KEY = "up.login.remember";

export const UpLoginPage = (props: UpLoginPageProps) => {
  const queryClient = useQueryClient();
  const defaultValues = useMemo<FieldValues>(() => {
    if (typeof window === "undefined") {
      return {};
    }

    return {
      rememberMe: localStorage.getItem(REMEMBER_STORAGE_KEY) !== "false",
      tenant: localStorage.getItem(TENANT_STORAGE_KEY) ?? "",
      email: localStorage.getItem(EMAIL_STORAGE_KEY) ?? "",
    };
  }, []);

  return (
    <LoginPage
      {...props}
      showTenantField
      defaultValues={defaultValues}
      additionalFields={
        <BooleanInput
          source="rememberMe"
          label="Remember tenant and email"
          helperText={false}
        />
      }
      onLoginSuccess={() =>
        queryClient.invalidateQueries({
          queryKey: ["auth", "getIdentity"],
        })
      }
      transformSubmitValues={(values) => {
        const rememberMe = Boolean(values.rememberMe);
        const tenant = String(values.tenant ?? "").trim();
        const email = String(values.email ?? "").trim();

        if (typeof window !== "undefined") {
          localStorage.setItem(REMEMBER_STORAGE_KEY, String(rememberMe));
          if (rememberMe) {
            localStorage.setItem(TENANT_STORAGE_KEY, tenant);
            localStorage.setItem(EMAIL_STORAGE_KEY, email);
          } else {
            localStorage.removeItem(TENANT_STORAGE_KEY);
            localStorage.removeItem(EMAIL_STORAGE_KEY);
          }
        }

        return {
          ...values,
          tenant,
          email,
        };
      }}
    />
  );
};
