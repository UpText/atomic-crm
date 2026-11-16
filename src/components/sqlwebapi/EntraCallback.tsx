import { useEffect, useRef, useState } from "react";
import { returnToCrm } from "./entraNavigation";
import { completeEntraLogin } from "@/components/atomic-crm/providers/sqlwebapi/entra";

export function EntraCallback({
  code,
  error,
}: {
  code: string | null;
  error: string | null;
}) {
  const started = useRef(false);
  const [message, setMessage] = useState(
    error
      ? "Microsoft login was not completed. Contact your administrator to request access or check your invitation."
      : "Completing Microsoft login…",
  );
  const [failed, setFailed] = useState(!!error);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.hash,
    );
    if (!code || error) {
      sessionStorage.removeItem("up.entra.transaction");
      return;
    }
    completeEntraLogin(code)
      .then(() => returnToCrm())
      .catch((e) => {
        setMessage(e instanceof Error ? e.message : "Unable to sign in.");
        setFailed(true);
      });
  }, [code, error]);
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md space-y-4">
        <h1 className="text-xl font-semibold">Microsoft login</h1>
        <p role={failed ? "alert" : "status"}>{message}</p>
        {failed && (
          <a className="underline" href={window.location.pathname + "#/login"}>
            Return to login
          </a>
        )}
      </div>
    </main>
  );
}
