import { useState } from "react";
import { useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  buildEntraUrl,
  startEntraLogin,
} from "@/components/atomic-crm/providers/sqlwebapi/entra";

export function EntraSignInButton() {
  const tenant = String(useWatch({ name: "tenant" }) ?? "").trim();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const { data } = useQuery({
    queryKey: ["entra-options", tenant],
    enabled: !!tenant,
    retry: false,
    queryFn: async ({ signal }) => {
      const url = buildEntraUrl("options");
      url.searchParams.set("tenant", tenant);
      const response = await fetch(url, { signal });
      if (!response.ok) return { enabled: false };
      return response.json() as Promise<{ enabled: boolean }>;
    },
  });
  if (!data?.enabled) return null;
  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setError("");
          try {
            await startEntraLogin(tenant);
          } catch (e) {
            setError(
              e instanceof Error
                ? e.message
                : "Unable to start Microsoft login.",
            );
            setPending(false);
          }
        }}
      >
        {pending ? "Opening Microsoft…" : "Sign in with Microsoft"}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
