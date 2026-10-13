"use client";

import React from "react";
import { useToast, ToastType } from "@/context/ToastContext";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 animate-slide-up ${getToastStyles(
            toast.type
          )}`}
        >
          <div className="flex-shrink-0 mt-0.5">{getToastIcon(toast.type)}</div>
          <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity p-0.5 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

function getToastIcon(type: ToastType) {
  switch (type) {
    case "success":
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    case "error":
      return <AlertCircle className="w-5 h-5 text-rose-500" />;
    case "warning":
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    case "info":
    default:
      return <Info className="w-5 h-5 text-blue-500" />;
  }
}

function getToastStyles(type: ToastType) {
  switch (type) {
    case "success":
      return "bg-emerald-950/80 border-emerald-800 text-emerald-100 shadow-emerald-950/20";
    case "error":
      return "bg-rose-950/80 border-rose-800 text-rose-100 shadow-rose-950/20";
    case "warning":
      return "bg-amber-950/80 border-amber-800 text-amber-100 shadow-amber-950/20";
    case "info":
    default:
      return "bg-zinc-900/90 border-zinc-800 text-zinc-100 shadow-zinc-950/20";
  }
}
