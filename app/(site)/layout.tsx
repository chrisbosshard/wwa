"use client";

import Navbar from "@elements/Navbar/Navbar";
import { useCart } from "@/components/providers/CartProvider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const { cart, kids, onAddToCart, onRemoveFromCart } = useCart();

  return (
    <>
      <Navbar cart={cart} kids={kids} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} />
      {children}
    </>
  );
}
