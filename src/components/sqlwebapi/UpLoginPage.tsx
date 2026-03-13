import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { FieldValues } from "react-hook-form";
import { LoginPage } from "@/components/atomic-crm/login/LoginPage";
import { BooleanInput } from "@/components/admin/boolean-input";

type UpLoginPageProps = {
  redirectTo?: string;
};

const SERVICE_STORAGE_KEY = "up.login.service";
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
      service:
        localStorage.getItem(SERVICE_STORAGE_KEY) ??
        import.meta.env.VITE_SERVICE ??
        "",
      email: localStorage.getItem(EMAIL_STORAGE_KEY) ?? "",
    };
  }, []);

  return (
    <LoginPage
      {...props}
      showServiceField
      defaultValues={defaultValues}
      additionalFields={
        <BooleanInput
          source="rememberMe"
          label="Remember service and email"
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
        const service = String(values.service ?? "").trim();
        const email = String(values.email ?? "").trim();

        if (typeof window !== "undefined") {
          localStorage.setItem(REMEMBER_STORAGE_KEY, String(rememberMe));
          if (rememberMe) {
            localStorage.setItem(SERVICE_STORAGE_KEY, service);
            localStorage.setItem(EMAIL_STORAGE_KEY, email);
          } else {
            localStorage.removeItem(SERVICE_STORAGE_KEY);
            localStorage.removeItem(EMAIL_STORAGE_KEY);
          }
        }

        return {
          ...values,
          service,
          email,
        };
      }}
    />
  );
};
