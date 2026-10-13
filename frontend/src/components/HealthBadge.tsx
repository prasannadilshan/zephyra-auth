"use client";

import React, { useEffect, useState } from "react";
import { healthApi } from "@/lib/api";
import { HealthResponse } from "@/lib/types";
import { Activity, RefreshCw } from "lucide-react";

export function HealthBadge() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "online" | "offline">("loading");

  const checkHealth = async () => {
    setStatus("loading");
    try {
      const data = await healthApi.check();
      setHealth(data);
      setStatus(data.status === "UP" ? "online" : "offline");
    } catch {
      setStatus("offline");
      setHealth(null);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      onClick={checkHealth}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors shadow-xs"
      title="Click to check API status"
    >
      {status === "loading" && (
        <>
          <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />
          <span className="text-slate-500">Checking...</span>
        </>
      )}

      {status === "online" && (
        <>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-slate-700 font-medium">API Online</span>
        </>
      )}

      {status === "offline" && (
        <>
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span className="text-rose-600 font-medium">API Offline</span>
        </>
      )}
    </div>
  );
}
