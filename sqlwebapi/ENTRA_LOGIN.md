# Microsoft Entra login

Tenant-admin editable provider settings are stored inside `crm.configuration.config.authentication.entra`:

```json
{
  "enabled": false,
  "organizationDisplayName": "UpText",
  "directoryId": "f05141e7-a3c7-4c6d-815e-4e98c8a70fd4",
  "clientId": "65cde3da-eada-4331-a6f8-c4dfdadb96da",
  "clientSecretUri": "https://uptextsecrets.vault.azure.net/secrets/uptext-crm-login-client-secret",
  "provisioningMode": "invite_only"
}
```

Open **Settings → Microsoft Entra login** to edit these settings and manage invitations. Mobile administrators use **Tenant settings and Entra login**. Never paste a secret value into CRM; provide an approved Key Vault URI only. Server checks enforce administrator permission.

Set **Organization display name** to label the login button **Sign in with {organization name}**. A blank name falls back to **Sign in with Microsoft**. The name is public login-page text returned by the API options endpoint; deploy the updated API and frontend together to enable it.

Invite-only is the default. An administrator enters the user's Entra object ID and email, optionally supplying an existing CRM user ID to explicitly link the account. Otherwise a standard CRM user without a local password is created. Invitations must be used within seven days. Share the CRM address and tenant name with the user; this workflow does not send email. Users enter the CRM tenant before clicking **Sign in with Microsoft**. Revocation is available in the identity list.

The alternative `automatic` policy creates standard users only after a successful login against the configured directory. It never links an existing account by email or grants administrator privileges. Revoked, expired, disabled, and cross-tenant identities remain denied.

Deploy the updated SQL project and API together before enabling this feature. The API SQL service identity needs EXECUTE on the internal `crmauth` schema (included in PostDeploy), and the runtime Azure identity needs read access to the approved Key Vault. No existing tenant is enabled automatically. Existing password login remains available.

Callback processing runs before the CRM router mounts. Only a short-lived, browser-bound completion code is returned in the URL. The API returns the existing UpText JWT and authoritative user record after verification. The CRM never receives Entra credentials or stores Entra tokens.

API configuration, callback URLs, Key Vault access, rotation, protocol details and rollout limitations are documented in **UpTextApi/docs/entra-login.md**.

SQL security regression test (uses a new disposable database in an existing local SQL container):

```sh
python3 sqlwebapi/tests/entra_auth_integration.py --container upapi-sqlserver
```

Frontend tests:

```sh
npm run typecheck
npm run test:unit:app -- --run src/components/atomic-crm/providers/sqlwebapi/entra.test.ts src/components/atomic-crm/providers/sqlwebapi/authProvider.test.ts
npm run build:sqlwebapi
```

Use a Node release supported by Vite and install the Playwright browser expected by the repository's test configuration, or configure its provider to launch installed Chrome with `launchOptions.channel = "chrome"`.

## Provider isolation

Entra login, callback handling, settings, invitations, and the mobile tenant-settings route are supplied only by `sqlwebapi/App.tsx`. Shared CRM pages expose optional generic extension points; Supabase and demo builds do not import the Entra implementation, even if SQLWebAPI environment variables are present.

Verify all three production bundles with:

```sh
node sqlwebapi/tests/check-build-isolation.mjs
```

The check builds into a disposable temporary directory and verifies that Entra login/invitation code is present only in the SQLWebAPI bundle.

## User names from Entra

New users receive `first_name` from the verified `given_name` ID-token claim and `last_name` from `family_name`. Login also fills missing name fields for invited or previously created Entra users, preserving any nonblank names maintained in CRM. Display names are not split to guess first/last names.

The UpText CRM Login registration requests `given_name` and `family_name` as optional ID-token claims. Customer-owned app registrations should enable these under Token configuration, and the Entra user profile must contain the corresponding names. The login flow already requests the `profile` scope; no additional Graph permissions are required.
