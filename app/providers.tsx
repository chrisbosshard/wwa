"use client";

import { CartProvider } from "@/components/providers/CartProvider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/components/analytics";

export function Providers({
  children,
  initialAppState,
}: {
  children: React.ReactNode;
  initialAppState?: string;
}) {
  return (
    <CartProvider initialAppState={initialAppState}>
      <Analytics />
      {children}
      <Toaster position="bottom-left" />
    </CartProvider>
  );
}
