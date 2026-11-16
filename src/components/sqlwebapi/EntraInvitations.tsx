import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotify, useDataProvider } from "ra-core";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CrmDataProvider } from "@/components/atomic-crm/providers/sqlwebapi/dataProvider";

type Identity = {
  id: number;
  object_id: string;
  directory_id: string;
  email: string;
  activated_at: string | null;
  revoked_at: string | null;
  expires_at: string;
};
export function EntraInvitations() {
  const provider = useDataProvider<CrmDataProvider>();
  const notify = useNotify();
  const cache = useQueryClient();
  const { getValues } = useFormContext();
  const [oid, setOid] = useState("");
  const [email, setEmail] = useState("");
  const [salesId, setSalesId] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const { data = [], error } = useQuery<Identity[]>({
    queryKey: ["entra-invitations"],
    enabled: show,
    queryFn: () => provider.getEntraInvitations(),
    retry: false,
  });
  const refresh = () => {
    cache.invalidateQueries({ queryKey: ["entra-invitations"] });
    cache.invalidateQueries({ queryKey: ["sales"] });
  };
  return (
    <section className="space-y-3 border-t pt-4">
      <h3 className="font-semibold">Entra invitations</h3>
      <p className="text-sm text-muted-foreground">
        Save the Entra directory and client settings first. Invitations expire
        after seven days if unused. Give the user their CRM tenant name and
        login address; no invitation email is sent.
      </p>
      <Label htmlFor="entra-object-id">User's Entra object ID</Label>
      <Input
        id="entra-object-id"
        value={oid}
        onChange={(e) => setOid(e.target.value)}
        placeholder="Object ID from Entra Users"
      />
      <Label htmlFor="entra-invite-email">CRM email</Label>
      <Input
        id="entra-invite-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Label htmlFor="entra-sales-id">Existing CRM user ID (optional)</Label>
      <Input
        id="entra-sales-id"
        type="number"
        min="1"
        value={salesId}
        onChange={(e) => setSalesId(e.target.value)}
        placeholder="Leave empty to create a standard user"
      />
      <Button
        type="button"
        variant="outline"
        disabled={busy || !oid || !email}
        onClick={async () => {
          setBusy(true);
          try {
            // Read-only: invitations use the saved configuration, never unsaved form values.
            if (!getValues("authentication.entra.directoryId"))
              throw new Error("Configure and save Entra first.");
            await provider.inviteEntraUser({
              objectId: oid.trim(),
              email: email.trim(),
              salesId: salesId ? Number(salesId) : null,
            });
            setOid("");
            setEmail("");
            setSalesId("");
            setShow(true);
            refresh();
            notify("Entra identity invited.");
          } catch (e) {
            notify(e instanceof Error ? e.message : "Invitation failed", {
              type: "error",
            });
          } finally {
            setBusy(false);
          }
        }}
      >
        Invite Entra user
      </Button>
      <Button type="button" variant="ghost" onClick={() => setShow(!show)}>
        {show ? "Hide identities" : "Show identities"}
      </Button>
      {error && (
        <p role="alert">
          Unable to load identities. Check administrator access.
        </p>
      )}
      {show && (
        <ul className="space-y-3">
          {data.map((identity) => (
            <li
              key={`${identity.directory_id}:${identity.object_id}`}
              className="border rounded p-3 text-sm space-y-1"
            >
              <p>
                {identity.email} (CRM ID {identity.id})
              </p>
              <p className="break-all">{identity.object_id}</p>
              <p>
                {identity.revoked_at
                  ? "Revoked"
                  : identity.activated_at
                    ? "Linked"
                    : new Date(identity.expires_at) < new Date()
                      ? "Expired"
                      : "Invited"}
              </p>
              {!identity.revoked_at && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      await provider.revokeEntraIdentity(
                        identity.object_id,
                        identity.directory_id,
                      );
                      refresh();
                    } catch (e) {
                      notify(
                        e instanceof Error ? e.message : "Revocation failed",
                        { type: "error" },
                      );
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Revoke Entra access
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
