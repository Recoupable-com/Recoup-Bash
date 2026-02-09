"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import TerminalComponent from "../components/Terminal";
import { TerminalData } from "../components/TerminalData";

export default function NewPage() {
  const [mounted, setMounted] = useState(false);
  const { ready, authenticated, login, getAccessToken } = usePrivy();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !ready) {
    return <TerminalData />;
  }

  if (!authenticated) {
    return (
      <>
        <TerminalData />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            fontFamily: "var(--font-geist-mono), monospace",
          }}
        >
          <button
            onClick={login}
            style={{
              background: "none",
              border: "1px solid currentColor",
              color: "inherit",
              padding: "12px 24px",
              fontSize: "16px",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            Log in to continue
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <TerminalData />
      <TerminalComponent
        getAccessToken={getAccessToken}
        agentEndpoint="/api/agent/new"
      />
    </>
  );
}
