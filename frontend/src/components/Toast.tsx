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
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-md border bg-white transition-all duration-300 ${getToastStyles(
            toast.type
          )}`}
        >
          <div className="flex-shrink-0 mt-0.5">{getToastIcon(toast.type)}</div>
          <div className="flex-1 text-sm font-medium text-slate-800 leading-relaxed">{toast.message}</div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-full"
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
      return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    case "error":
      return <AlertCircle className="w-5 h-5 text-rose-600" />;
    case "warning":
      return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    case "info":
    default:
      return <Info className="w-5 h-5 text-blue-600" />;
  }
}

function getToastStyles(type: ToastType) {
  switch (type) {
    case "success":
      return "border-emerald-200 bg-white";
    case "error":
      return "border-rose-200 bg-white";
    case "warning":
      return "border-amber-200 bg-white";
    case "info":
    default:
      return "border-blue-200 bg-white";
  }
}
