import { useEffect, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";

const IS_PROD = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
const RECOUP_API_URL = IS_PROD
  ? "https://recoup-api.vercel.app"
  : "https://test-recoup-api.vercel.app";

export function useSetupSandbox() {
  const { authenticated, getAccessToken } = usePrivy();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!authenticated || hasRun.current) return;
    hasRun.current = true;

    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };

        const res = await fetch(`${RECOUP_API_URL}/api/sandboxes`, { headers });
        if (!res.ok) return;

        const data = await res.json();
        if (data.sandboxes && data.sandboxes.length > 0) return;

        fetch(`${RECOUP_API_URL}/api/sandboxes/setup`, {
          method: "POST",
          headers,
        });
      } catch {
        // Silent — background provisioning only
      }
    })();
  }, [authenticated, getAccessToken]);
}
