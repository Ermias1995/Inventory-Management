"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error";

interface ToastProps {
  message:  string;
  type:     ToastType;
  onClose:  () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  // Auto-dismiss after 3 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-[100] flex items-center gap-3",
        "px-4 py-3 rounded-xl shadow-lg text-sm font-medium",
        "animate-in slide-in-from-bottom-4 duration-300",
        type === "success"
          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
          : "bg-red-50 text-red-800 border border-red-200"
      )}
    >
      {type === "success" ? (
        <CheckCircle size={18} className="text-emerald-500 shrink-0" />
      ) : (
        <XCircle size={18} className="text-red-500 shrink-0" />
      )}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}