import { useEffect, useRef, useState } from "react";
import { completeEntraConnection } from "@/components/atomic-crm/providers/sqlwebapi/entra";

export function EntraConnectionCallback({
  code,
  error,
}: {
  code: string | null;
  error: string | null;
}) {
  const started = useRef(false);
  const [message, setMessage] = useState(
    error
      ? "Microsoft connection was not completed. Your existing settings were kept. Restart from tenant settings with a Microsoft administrator account."
      : "Verifying your Microsoft organization…",
  );
  const [failed, setFailed] = useState(!!error);
  const [result, setResult] = useState<{
    directoryId: string;
    objectId: string;
  } | null>(null);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.hash,
    );
    if (!code || error) {
      sessionStorage.removeItem("up.entra.connection");
      return;
    }
    completeEntraConnection(code)
      .then((value) => {
        setResult(value);
        setMessage(
          "Microsoft login is enabled. Use tenant settings to invite users or choose automatic creation of standard users. Link existing accounts explicitly; connecting does not grant CRM administrator access.",
        );
      })
      .catch((e) => {
        setMessage(
          e instanceof Error ? e.message : "Unable to connect Microsoft.",
        );
        setFailed(true);
      });
  }, [code, error]);
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg space-y-4">
        <h1 className="text-xl font-semibold">
          Connect Microsoft organization
        </h1>
        <p role={failed ? "alert" : "status"}>{message}</p>
        {result && (
          <div className="space-y-2 text-sm break-all">
            <p>Connected directory: {result.directoryId}</p>
            <p>Your Microsoft object ID: {result.objectId}</p>
          </div>
        )}
        {(failed || result) && (
          <a
            className="underline"
            href={window.location.pathname + "#/tenant-settings"}
            onClick={(e) => {
              e.preventDefault();
              window.location.assign(
                window.location.pathname + "#/tenant-settings",
              );
              window.location.reload();
            }}
          >
            Return to tenant settings
          </a>
        )}
      </div>
    </main>
  );
}
