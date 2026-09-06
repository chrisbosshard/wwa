"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ApplicationContextProvider } from "@context/ApplicationContext/ApplicationContext";
import { blockKid, fetchKids } from "@lib/directus/api-client";
import getCurrentDate from "@utils/getCurrentDate";
import shuffleArray from "@utils/shuffleArray.js";

const CAMPAIGN_START = process.env.NEXT_PUBLIC_CAMPAIGN_SEASON_START || "2023-08-30T00:00:00.604014+00:00";

export type Kid = {
  id: string;
  prename?: string;
  age?: string | number;
  checkout?: string;
  code?: string;
  active?: boolean;
  createdAt?: string;
  wish?: {
    active?: boolean;
    description?: string;
    voucher?: boolean;
    [key: string]: unknown;
  };
  donor?: {
    paymentSuccessful?: boolean;
    manualUpload?: boolean;
    [key: string]: unknown;
  };
  family?: {
    id?: string;
    zipcode?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type CartContextValue = {
  cart: string[];
  kids: Kid[];
  loadingKids: boolean;
  wishLimit: number;
  fixedWishCount: number | null;
  onAddToCart: (kid: { id: string }) => Promise<void>;
  onRemoveFromCart: (id: string) => Promise<void>;
  onEmptyCart: () => void;
  refreshKids: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
  initialAppState,
  wishLimit = 0,
  fixedWishCount = null,
}: {
  children: React.ReactNode;
  initialAppState?: string;
  wishLimit?: number;
  fixedWishCount?: number | null;
}) {
  const [cart, setCart] = useState<string[]>([]);
  const [kids, setKids] = useState<Kid[]>([]);
  const [loadingKids, setLoadingKids] = useState(true);

  const refreshKids = useCallback(async () => {
    setLoadingKids(true);

    try {
      let after = 0;
      let allKids: Kid[] = [];
      let hasNext = true;

      while (hasNext) {
        const data = await fetchKids(after, CAMPAIGN_START);
        allKids = allKids.concat(data.connection.edges.map((item) => item.node));
        hasNext = data.connection.pageInfo.hasNextPage;
        after += 1000;
      }

      let newKids: Kid[] = [];
      const localCart = localStorage.getItem("cart")?.split(",").filter(Boolean) ?? [];
      const newCart: string[] = [];

      const cutofftime = new Date();
      cutofftime.setMinutes(cutofftime.getMinutes() - 30);

      allKids
        .filter((kid) => kid.wish)
        .forEach((kid) => {
          const checkouttime = kid.checkout ? new Date(kid.checkout) : null;
          if (!checkouttime || checkouttime <= cutofftime || kid.donor) {
            newKids.push(kid);
          } else {
            const inCart = localCart.find((item) => item === kid.id);
            if (inCart) {
              newKids.push(kid);
              newCart.push(kid.id);
            }
          }
        });

      newKids = shuffleArray(newKids);
      setKids(newKids);
      setCart(newCart);
    } catch (error) {
      console.error("Failed to load kids", error);
    } finally {
      setLoadingKids(false);
    }
  }, []);

  useEffect(() => {
    void refreshKids();
  }, [refreshKids]);

  useEffect(() => {
    const localCart = localStorage.getItem("cart") ? localStorage.getItem("cart")!.split(",") : [];
    setCart(localCart);
  }, []);

  const onRemoveFromCart = useCallback(async (id: string) => {
    setCart((prev) => {
      const newItems = prev.filter((item) => item !== id);
      localStorage.setItem("cart", newItems.join(","));
      return newItems;
    });
    await blockKid(id, null);
  }, []);

  const onAddToCart = useCallback(async (kid: { id: string }) => {
    setCart((prev) => {
      if (prev.find((item) => item === kid.id)) return prev;
      const newItems = [...prev, kid.id];
      localStorage.setItem("cart", newItems.join(","));
      return newItems;
    });
    const date = getCurrentDate();
    await blockKid(kid.id, date);
  }, []);

  const onEmptyCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem("cart");
  }, []);

  const value = useMemo(
    () => ({
      cart,
      kids,
      loadingKids,
      wishLimit,
      fixedWishCount,
      onAddToCart,
      onRemoveFromCart,
      onEmptyCart,
      refreshKids,
    }),
    [cart, kids, loadingKids, wishLimit, fixedWishCount, onAddToCart, onRemoveFromCart, onEmptyCart, refreshKids],
  );

  return (
    <ApplicationContextProvider kids={kids} initialAppState={initialAppState}>
      <CartContext.Provider value={value}>{children}</CartContext.Provider>
    </ApplicationContextProvider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
