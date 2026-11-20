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
      return response.json() as Promise<{
        enabled: boolean;
        organizationDisplayName?: string;
      }>;
    },
  });
  if (!data?.enabled) return null;
  const organizationName = data.organizationDisplayName?.trim();
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
        <svg viewBox="0 0 21 21" aria-hidden="true" className="size-4 shrink-0">
          <path fill="#f25022" d="M0 0h10v10H0z" />
          <path fill="#7fba00" d="M11 0h10v10H11z" />
          <path fill="#00a4ef" d="M0 11h10v10H0z" />
          <path fill="#ffb900" d="M11 11h10v10H11z" />
        </svg>
        {pending
          ? "Opening Microsoft…"
          : `Sign in with ${organizationName || "Microsoft"}`}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
