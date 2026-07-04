"use client";

import { CartProvider } from "@/components/providers/CartProvider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/components/analytics";

export function Providers({
  children,
  initialAppState,
  wishLimit,
}: {
  children: React.ReactNode;
  initialAppState?: string;
  wishLimit?: number;
}) {
  return (
    <CartProvider initialAppState={initialAppState} wishLimit={wishLimit}>
      <Analytics />
      {children}
      <Toaster position="bottom-left" />
    </CartProvider>
  );
}
