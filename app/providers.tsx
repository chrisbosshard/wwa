"use client";

import { CartProvider } from "@/components/providers/CartProvider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/components/analytics";

export function Providers({
  children,
  initialAppState,
  wishLimit,
  fixedWishCount,
}: {
  children: React.ReactNode;
  initialAppState?: string;
  wishLimit?: number;
  fixedWishCount?: number | null;
}) {
  return (
    <CartProvider initialAppState={initialAppState} wishLimit={wishLimit} fixedWishCount={fixedWishCount ?? null}>
      <Analytics />
      {children}
      <Toaster position="bottom-left" />
    </CartProvider>
  );
}
