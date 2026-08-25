"use client";

import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        className:
          "bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-lg rounded-xl text-xs font-medium",
      }}
    />
  );
}
