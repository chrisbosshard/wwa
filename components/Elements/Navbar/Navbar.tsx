"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import ApplicationContext from "@context/ApplicationContext/ApplicationContext";
import { Button } from "@elements/Button/Button";
import { CaritasLogo } from "./CaritasLogo";
import { mainNavItems, metaNavItems, ctaNavItem } from "./nav-items";
import { cn } from "@/lib/utils";

const NavLink = ({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "meta" | "main";
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      role="menuitem"
      onClick={() => document.body.classList.remove("nav-open")}
      className={cn(
        "block whitespace-nowrap no-underline transition-colors duration-150",
        variant === "meta" && "text-base leading-[1.47] text-caritas-grey hover:text-caritas-regio-red",
        variant === "meta" && isActive && "text-black",
        variant === "main" && "text-lg font-medium leading-none nav:text-[1.375rem] nav:leading-[1.35]",
        variant === "main" && "text-black hover:text-caritas-regio-red",
        variant === "main" && isActive && "text-black",
      )}
    >
      {label}
    </Link>
  );
};

const Navbar = ({
  cart,
  kids,
  onRemoveFromCart,
  onAddToCart,
}: {
  cart: string[];
  kids: unknown[];
  onAddToCart: (kid: { id: string }) => void;
  onRemoveFromCart: (id: string) => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { appState } = useContext(ApplicationContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const showCart = appState === "wish_fulfilment";

  const availableKids = (kids as { id: string; donor?: { manualUpload?: boolean; paymentSuccessful?: boolean } }[]).filter((kid) => {
    const isCompleted = kid.donor && (kid.donor.manualUpload || kid.donor.paymentSuccessful);
    return !isCompleted && !cart.includes(kid.id);
  });

  useEffect(() => {
    if (!cartOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest("[data-cart-wrap]")) {
        setCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cartOpen]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 32);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCheckout = () => {
    setCartOpen(false);
    router.push("/checkout");
  };

  const handleAddItem = () => {
    if (availableKids.length > 0) {
      onAddToCart(availableKids[0]);
      toast.success("Geschenk hinzugefügt");
    }
  };

  const handleRemoveItem = () => {
    if (cart.length > 0) {
      onRemoveFromCart(cart[0]);
      toast.success("Geschenk entfernt");
    }
  };

  return (
    <>
      <header className="fixed left-0 top-0 z-[1200] w-full bg-white font-sans shadow-header">
        {/* Mobile bar */}
        <div className="relative mx-auto flex h-[3.75rem] max-w-[100rem] items-center justify-between px-5 pl-8 nav:hidden">
          <Link href="/" className="inline-flex shrink-0 items-center no-underline">
            <span className="sr-only">Startseite</span>
            <CaritasLogo className="block h-[1.625rem] w-auto" />
          </Link>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-black hover:text-caritas-regio-red"
            aria-expanded={menuOpen}
            aria-controls="header__nav"
            aria-label={menuOpen ? "Menu schliessen" : "Menu öffnen"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="text-[0.9375rem] font-medium">Menu</span>
            <span className="relative inline-block h-3.5 w-[3.125rem]">
              <span
                className={cn(
                  "absolute right-0 block h-px w-[3.125rem] rounded-sm bg-current transition-transform duration-300",
                  menuOpen ? "translate-y-0 rotate-45" : "translate-y-2 rotate-180",
                )}
              />
              <span
                className={cn(
                  "absolute right-0 block h-px w-[3.125rem] rounded-sm bg-current transition-transform duration-300",
                  menuOpen ? "translate-y-0 -rotate-45" : "translate-y-2",
                )}
              />
            </span>
          </button>
        </div>

        {/* Desktop header — two explicit rows like caritas-regio.ch */}
        <div className="mx-auto hidden max-w-[100rem] px-10 pb-4 pt-4 transition-[padding] duration-300 nav:block">
          <nav
            aria-label="meta-nav"
            className={cn(
              "flex justify-end overflow-hidden transition-all duration-300 ease-in-out",
              scrolled ? "pointer-events-none max-h-0 opacity-0" : "max-h-12 opacity-100",
            )}
          >
            <ul className="flex items-center gap-[3.125rem]" role="menubar">
              {metaNavItems.map((item) => (
                <li key={item.href} role="none">
                  <NavLink href={item.href} label={item.label} variant="meta" />
                </li>
              ))}
            </ul>
          </nav>

          <div className={cn("flex items-end justify-between gap-8 transition-[margin] duration-300", scrolled ? "mt-0" : "mt-4")}>
            <Link href="/" className="inline-flex shrink-0 items-end no-underline">
              <span className="sr-only">Startseite</span>
              <CaritasLogo className="block h-[2.4375rem] w-[12.5rem]" />
            </Link>

            <div className="flex items-center gap-[1.875rem] xl:gap-10">
              <nav aria-label="main-nav">
                <ul className="flex items-center gap-[1.875rem] xl:gap-10" role="menubar">
                  {mainNavItems.map((item) => (
                    <li key={item.href} role="none">
                      <NavLink href={item.href} label={item.label} variant="main" />
                    </li>
                  ))}
                </ul>
              </nav>

              <Link
                href={ctaNavItem.href}
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-caritas-regio-red px-6 py-2.5 text-xl font-medium leading-none text-white no-underline transition-colors hover:bg-caritas-regio-red-dark"
              >
                {ctaNavItem.label}
              </Link>

              {showCart && (
                <div className="relative pl-1" data-cart-wrap>
                  <button
                    type="button"
                    className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center border-0 bg-transparent text-black hover:text-caritas-regio-red"
                    aria-label="Geschenkekorb anzeigen"
                    aria-expanded={cartOpen}
                    onClick={() => setCartOpen((open) => !open)}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M7 4h-2l-1 2h18l-2 10H9L7 4zm0 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"
                        fill="currentColor"
                      />
                    </svg>
                    {cart.length > 0 && (
                      <span className="absolute right-0 top-0 inline-flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-caritas-regio-red px-[0.2rem] text-[0.6875rem] font-bold text-white">
                        {cart.length}
                      </span>
                    )}
                  </button>

                  {cartOpen && (
                    <div className="absolute right-0 top-[calc(100%+0.5rem)] z-[1300] w-[17rem] rounded-lg border border-gray-200 bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                      <p className="mb-4 text-sm text-gray-700">Anzahl Geschenke im Geschenkekorb</p>
                      <div className="flex flex-row items-center justify-center">
                        <button
                          type="button"
                          disabled={cart.length === 0}
                          className={cn(
                            "mx-auto mb-4 flex h-[30px] w-[30px] items-center justify-center rounded-full border-[3px] border-caritas-regio-red bg-caritas-regio-red text-base font-bold text-white",
                            cart.length === 0 && "cursor-default opacity-40",
                          )}
                          onClick={handleRemoveItem}
                        >
                          -
                        </button>
                        <div className="mx-4 text-lg font-bold">{cart.length}</div>
                        <button
                          type="button"
                          disabled={availableKids.length === 0}
                          className={cn(
                            "mx-auto mb-4 flex h-[30px] w-[30px] items-center justify-center rounded-full border-[3px] border-caritas-regio-red bg-caritas-regio-red text-base font-bold text-white",
                            availableKids.length === 0 && "cursor-default opacity-40",
                          )}
                          onClick={handleAddItem}
                        >
                          +
                        </button>
                      </div>
                      <Button onClick={handleCheckout} size="large" className="ml-0 mt-4 w-full">
                        Zur Kasse
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          id="header__nav"
          className={cn(
            "fixed right-0 top-0 z-[1201] h-screen w-[min(23.4375rem,100vw)] translate-x-full overflow-y-auto bg-white px-8 pb-12 pt-20 transition-transform duration-[250ms] ease-nav nav:hidden",
            menuOpen && "translate-x-0",
          )}
        >
          <nav aria-label="meta-nav" className="mb-2">
            <ul className="flex flex-col" role="menubar">
              {metaNavItems.map((item) => (
                <li key={item.href} className="border-b border-caritas-regio-red/10 py-3.5" role="none">
                  <NavLink href={item.href} label={item.label} variant="meta" />
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="main-nav">
            <ul className="flex flex-col border-caritas-regio-red/10" role="menubar">
              {mainNavItems.map((item) => (
                <li key={item.href} className="border-b border-caritas-regio-red/10 py-3.5" role="none">
                  <NavLink href={item.href} label={item.label} variant="main" />
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href={ctaNavItem.href}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-caritas-regio-red px-6 py-2.5 text-xl font-medium leading-none text-white no-underline transition-colors hover:bg-caritas-regio-red-dark"
          >
            {ctaNavItem.label}
          </Link>
        </div>

        <button
          type="button"
          className={cn(
            "fixed inset-0 z-[1200] cursor-pointer border-0 bg-black/40 p-0 nav:hidden",
            menuOpen ? "block" : "hidden",
          )}
          aria-label="Menu schliessen"
          onClick={() => setMenuOpen(false)}
        />
      </header>

      <div
        className={cn(
          "h-header-mobile transition-[height] duration-300 ease-in-out",
          scrolled ? "nav:h-header-desktop-collapsed" : "nav:h-header-desktop",
        )}
        aria-hidden="true"
      />
    </>
  );
};

export default Navbar;
