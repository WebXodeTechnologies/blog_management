"use client";

import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";

export default function ToastProvider() {
  return (
    <>
      <HotToaster
        position="top-center"
        toastOptions={{
          className:
            "bg-white text-slate-900 border border-slate-200 shadow-xl rounded-2xl text-xs font-semibold px-4 py-3 z-50",
          duration: 3000,
        }}
      />
      <SonnerToaster
        position="top-center"
        toastOptions={{
          className:
            "bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-lg rounded-xl text-xs font-medium",
        }}
      />
    </>
  );
}
