"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import getStripe from "@lib/get-stripe.js";
import { toast } from "sonner";
import { Button } from "@elements/Button/Button";
import { selectionGlow } from "@/lib/ui-classes";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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
  const completed = kid.donor && (kid.donor.manualUpload || kid.donor.paymentSuccessful);

  let article = "ein";
  if (kid.wish.article === "Der") {
    article = "einen";
  } else if (kid.wish.article === "Die") {
    article = "eine";
  } else if (kid.wish.article === "Mehrzahl") {
    article = "";
  }

  let text =
    "Ich heisse " + kid.prename + " und ich bin " + kid.age + " Jahre alt. Zu Weihnachten wünsche ich mir " + article + " " + kid.wish.description + ".";
  if (completed) {
    const donorLabel = kid.donor.public === "Yes" ? "von " + kid.donor.prename : "einem Spender";
    text = "Der Wunsch von " + kid.prename + " wurde " + donorLabel + " erfüllt. Herzlichen Dank!";
  }

  const isDone = false;
  const picture = kid.wish && kid.wish.image && kid.wish.image.url ? kid.wish.image.url : "/placeholder.jpg";

  return (
    <>
      <div className={cn("wish-card relative h-full w-full cursor-pointer rounded-lg border border-gray-200 bg-white", kidStyle)} onClick={() => setOpen(true)}>
        {completed && !kid.donor.logo ? (
          <div className="absolute z-20">
            <div className="absolute right-[8%] top-1/2 flex h-1/2 w-1/2 rotate-[12deg] items-center justify-center text-center">
              {kid.donor.public ? <p className="font-handwritten text-2xl">{kid.donor.prename}</p> : null}
            </div>
            <img src="/bow.png" alt="bow" />
          </div>
        ) : null}
        {completed && kid.donor.logo ? (
          <div className="absolute z-20">
            <img src={kid.donor.logo.url} alt="bow" />
          </div>
        ) : null}
        <div className="p-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-50">
            <Image src={picture} alt="gift" fill className="object-contain" sizes="(max-width: 768px) 100vw, 300px" />
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <h2 className="mb-0 text-lg font-bold text-caritas-gray-800">
              {kid.prename}, {kid.age}
            </h2>
            <span className="rounded bg-caritas-red px-2 py-0.5 text-xs font-semibold text-white">{kid.age} J.</span>
          </div>
          <h5 className="mt-1 text-sm font-normal text-gray-600">{kid.wish.description}</h5>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0">
          {completed ? (
            <div className="absolute right-0 z-20 ml-32 max-w-full">
              <img src="/big_bow.png" alt="bow" />
            </div>
          ) : null}
          <div className="relative flex flex-col justify-between bg-white p-8">
            <div className="hidden sm:flex">
              <img className="absolute right-4 top-4 h-[180px] w-[180px] rounded-lg border border-gray-200 object-contain p-2" src={picture} alt="gift" />
            </div>
            <div className="mb-12 mt-4 w-full max-w-md sm:mt-8">
              <p className="whitespace-normal text-lg font-normal leading-relaxed text-caritas-gray-800 sm:text-xl">{text}</p>
            </div>
            <div className="relative flex w-full flex-col gap-3">
              {!completed && !cart.includes(kid.id) && !isDone ? (
                <>
                  <Button onClick={handleAddCheckout} size="small" className="mx-0 w-full sm:w-auto">
                    Direkt erfüllen
                  </Button>
                  <Button onClick={handleAdd} color="outline" size="small" className="mx-0 w-full sm:w-auto">
                    In den Geschenkekorb
                  </Button>
                </>
              ) : null}
              {cart.includes(kid.id) && !isDone ? (
                <Button onClick={handleRemove} color="outline" size="small" className="mx-0 w-full sm:w-auto">
                  Aus Geschenkekorb entfernen
                </Button>
              ) : null}
              <Button onClick={() => setOpen(false)} color="outline" size="small" className="mx-0 w-full sm:w-auto">
                Schliessen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Polaroid;
