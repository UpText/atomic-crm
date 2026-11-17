import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDataProvider, useNotify } from "ra-core";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import type { CrmDataProvider } from "@/components/atomic-crm/providers/sqlwebapi/dataProvider";

export function EntraConnect() {
  const provider = useDataProvider<CrmDataProvider>();
  const notify = useNotify();
  const {
    formState: { isDirty },
  } = useFormContext();
  const [busy, setBusy] = useState(false);
  const { data, error } = useQuery({
    queryKey: ["entra-connection-options"],
    queryFn: () => provider.getEntraConnectionOptions(),
    retry: false,
  });
  return (
    <section className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Connect your Microsoft organization using an account authorized to grant
        administrator consent. No app registration or client secret is needed.
        Connecting enables Microsoft login and preserves your new-user policy.
        Existing CRM accounts still require an explicit invitation and account
        link.
      </p>
      <Button
        type="button"
        disabled={busy || isDirty || !data?.available}
        onClick={async () => {
          setBusy(true);
          try {
            await provider.connectEntraOrganization();
          } catch (e) {
            notify(
              e instanceof Error ? e.message : "Unable to connect Microsoft.",
              { type: "error" },
            );
            setBusy(false);
          }
        }}
      >
        {busy ? "Opening Microsoft…" : "Connect Microsoft organization"}
      </Button>
      {isDirty && (
        <p className="text-sm">
          Save your settings before connecting Microsoft.
        </p>
      )}
      {(error || data?.available === false) && (
        <p className="text-sm">
          Self-service Microsoft connections are unavailable. Contact your API
          administrator.
        </p>
      )}
    </section>
  );
}
