import { BooleanInput } from "@/components/admin/boolean-input";
import { TextInput } from "@/components/admin/text-input";
import { SelectInput } from "@/components/admin/select-input";
import { Card, CardContent } from "@/components/ui/card";
import { EntraConnect } from "./EntraConnect";
import { EntraInvitations } from "./EntraInvitations";

export function EntraSettingsFields() {
  return (
    <Card id="authentication">
      <CardContent className="space-y-4">
        <h2 className="text-xl font-semibold">Microsoft Entra login</h2>
        <EntraConnect />
        <BooleanInput
          source="authentication.entra.enabled"
          label="Enable Microsoft login"
        />
        <details className="space-y-3">
          <summary className="cursor-pointer">
            Advanced: use your own app registration
          </summary>
          <TextInput
            source="authentication.entra.directoryId"
            label="Entra directory (tenant) ID"
          />
          <TextInput
            source="authentication.entra.clientId"
            label="Application (client) ID"
          />
          <TextInput
            source="authentication.entra.clientSecretUri"
            label="Key Vault secret URI"
            helperText="Use a secret URI from a vault approved by your API administrator. Never enter a secret value."
          />
        </details>
        <SelectInput
          source="authentication.entra.provisioningMode"
          label="New users"
          choices={[
            { id: "invite_only", name: "Invite only (default)" },
            { id: "automatic", name: "Automatically create standard users" },
          ]}
        />
        <p className="text-sm text-muted-foreground">
          Invite-only requires an administrator to approve the user's Entra
          object ID. Automatic provisioning never links an existing account by
          email or grants administrator access.
        </p>
        <EntraInvitations />
      </CardContent>
    </Card>
  );
}
