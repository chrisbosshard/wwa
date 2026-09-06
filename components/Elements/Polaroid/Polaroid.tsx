"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@elements/Button/Button";
import { selectionGlow } from "@/lib/ui-classes";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { isGrantedWish } from "@lib/directus/progress";

const wishCardShell =
  "rounded-lg border border-gray-200 bg-white shadow-sm";

const wishCardMeta = {
  row: "mt-3 flex items-center justify-between gap-2",
  title: "mb-0 text-lg font-bold leading-snug text-caritas-gray-800",
  badge: "shrink-0 rounded bg-caritas-red px-2 py-0.5 text-xs font-semibold text-white",
  description: "mt-1 text-sm font-normal leading-snug text-gray-600",
};

function WishCardContent({
  kid,
  picture,
  titleAs = "h2",
  interactive = false,
  subdued = false,
  variant = "grid",
  className,
}: {
  kid: {
    prename: string;
    age: string | number;
    wish: { description: string };
  };
  picture: string;
  titleAs?: "h2" | "dialog";
  interactive?: boolean;
  subdued?: boolean;
  variant?: "grid" | "dialog";
  className?: string;
}) {
  return (
    <div className={cn(variant === "dialog" ? "p-6 sm:p-8" : "p-4", className)}>
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-50">
        <Image
          src={picture}
          alt={kid.wish.description}
          fill
          className={cn(
            "object-contain",
            subdued && "opacity-70 saturate-50",
            interactive && "transition-transform duration-200 ease-out group-hover:scale-105",
          )}
          sizes="(max-width: 768px) 100vw, 300px"
        />
      </div>
      <div className={wishCardMeta.row}>
        {titleAs === "dialog" ? (
          <DialogTitle asChild>
            <h2 className={wishCardMeta.title}>{kid.prename}</h2>
          </DialogTitle>
        ) : (
          <h2 className={wishCardMeta.title}>{kid.prename}</h2>
        )}
        <span className={wishCardMeta.badge}>{kid.age} J.</span>
      </div>
      <p className={wishCardMeta.description}>{kid.wish.description}</p>
    </div>
  );
}

function CompletedBowOverlay({ kid }: { kid: { donor?: { public?: string; prename?: string; logo?: { url: string } } } }) {
  if (!kid.donor) return null;

  if (kid.donor.logo) {
    return (
      <div className="absolute z-20">
        <img src={kid.donor.logo.url} alt="" />
      </div>
    );
  }

  const donorName =
    kid.donor.public === "Yes" && kid.donor.prename
      ? kid.donor.prename
      : "Spender";

  return (
    <div className="absolute z-20">
      <div className="absolute right-[8%] top-1/2 flex h-1/2 w-1/2 rotate-[12deg] items-center justify-center text-center">
        <p className="font-handwritten text-2xl">{donorName}</p>
      </div>
      <img src="/bow.png" alt="" />
    </div>
  );
}

const Polaroid = (props) => {
  const { kid, cart, onAddToCart, onRemoveFromCart } = props;
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleAdd = () => {
    setOpen(false);
    onAddToCart(kid);
    toast.success("Geschenk hinzugefügt");
  };

  const handleRemove = () => {
    setOpen(false);
    onRemoveFromCart(kid.id);
    toast.success("Geschenk entfernt");
  };

  const handleAddCheckout = () => {
    setOpen(false);
    router.push("/checkout");
    onAddToCart(kid);
  };

  const kidStyle = cart.includes(kid.id) ? selectionGlow : "";
  const completed = Boolean(kid.completed || isGrantedWish(kid));

  let article = "ein";
  if (kid.wish.article === "Der") {
    article = "einen";
  } else if (kid.wish.article === "Die") {
    article = "eine";
  } else if (kid.wish.article === "Mehrzahl") {
    article = "";
  }

  let text =
    "Ich heisse " +
    kid.prename +
    " und ich bin " +
    kid.age +
    " Jahre alt. Zu Weihnachten wünsche ich mir " +
    article +
    " " +
    kid.wish.description +
    ".";
  if (completed) {
    const donorLabel = kid.donor.public === "Yes" ? "von " + kid.donor.prename : "einem Spender";
    text = "Der Wunsch von " + kid.prename + " wurde " + donorLabel + " erfüllt. Herzlichen Dank!";
  }

  const isDone = false;
  const picture = kid.wish && kid.wish.image && kid.wish.image.url ? kid.wish.image.url : "/placeholder.jpg";

  return (
    <>
      <div
        className={cn(
          "wish-card group relative h-full w-full cursor-pointer transition-all duration-200 ease-out",
          wishCardShell,
          completed
            ? "border-[#e7d8cf] bg-[linear-gradient(135deg,#ffe4e7_0%,#fff1bd_50%,#dff2ec_100%)] shadow-none hover:border-[#d8c5ba]"
            : "hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]",
          kidStyle,
        )}
        onClick={() => setOpen(true)}
      >
        {completed ? <CompletedBowOverlay kid={kid} /> : null}
        <WishCardContent kid={kid} picture={picture} interactive={!completed} subdued={completed} />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            "max-w-2xl gap-0 overflow-hidden p-0 sm:max-w-2xl",
            wishCardShell,
            "shadow-[0_8px_24px_rgba(0,0,0,0.12)] [&>button]:z-30 [&>button]:rounded-full [&>button]:border [&>button]:border-gray-200 [&>button]:bg-white [&>button]:shadow-sm",
          )}
        >
          <div className="relative flex flex-col sm:flex-row">
            <div className="relative shrink-0 border-b border-gray-200 sm:w-[17.5rem] sm:border-b-0 sm:border-r">
              {completed ? <CompletedBowOverlay kid={kid} /> : null}
              <WishCardContent
                kid={kid}
                picture={picture}
                titleAs="dialog"
                variant="dialog"
                className="pt-12 sm:pt-8"
              />
            </div>

            <div className="flex flex-1 flex-col p-6 sm:p-8 md:p-8">
              <DialogDescription asChild>
                <p className="text-base leading-relaxed text-gray-600 sm:text-[1.0625rem] sm:leading-[1.65]">{text}</p>
              </DialogDescription>

              <div className="mt-auto flex flex-col gap-3 pt-8">
                {!completed && !cart.includes(kid.id) && !isDone ? (
                  <>
                    <Button onClick={handleAddCheckout} className="mx-0 w-full justify-center">
                      Direkt erfüllen
                    </Button>
                    <Button onClick={handleAdd} color="outline" className="mx-0 w-full justify-center">
                      In den Geschenkekorb
                    </Button>
                  </>
                ) : null}
                {cart.includes(kid.id) && !isDone ? (
                  <Button onClick={handleRemove} color="outline" className="mx-0 w-full justify-center">
                    Aus Geschenkekorb entfernen
                  </Button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="py-2 text-center text-sm font-semibold text-gray-600 transition-colors hover:text-caritas-gray-800"
                >
                  Schliessen
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Polaroid;
