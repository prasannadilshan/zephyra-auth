"use client";

import React, { useEffect, useState } from "react";
import { healthApi } from "@/lib/api";
import { HealthResponse } from "@/lib/types";
import { Activity, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

export function HealthBadge() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "online" | "offline">("loading");
  const [lastChecked, setLastChecked] = useState<string>("");

  const checkHealth = async () => {
    setStatus("loading");
    try {
      const data = await healthApi.check();
      setHealth(data);
      setStatus(data.status === "UP" ? "online" : "offline");
      setLastChecked(new Date().toLocaleTimeString());
    } catch {
      setStatus("offline");
      setHealth(null);
      setLastChecked(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border cursor-pointer hover:shadow-sm"
      onClick={checkHealth}
      title={`Backend: ${health?.status || status.toUpperCase()} | DB: ${health?.databaseStatus || "N/A"} | Last checked: ${lastChecked}`}
    >
      {status === "loading" && (
        <>
          <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          <span className="text-amber-700 dark:text-amber-400">Checking API...</span>
        </>
      )}

      {status === "online" && (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3 inline" /> API Online
          </span>
          <span className="hidden sm:inline text-zinc-400 text-[10px]">({health?.databaseStatus || "DB OK"})</span>
        </>
      )}

      {status === "offline" && (
        <>
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          <span className="text-rose-700 dark:text-rose-400 font-semibold">API Offline</span>
        </>
      )}
    </div>
  );
}
