"use client";

import { useState } from "react";
import { Button } from "@elements/Button/Button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ProductInfoButton } from "@/components/Wish/ProductInfoButton";
import { getWishProductUrl } from "@/lib/wish-link";
import { cn } from "@/lib/utils";

type Props = {
  wish: {
    id?: string;
    description: string;
    link?: string | null;
    image?: { url?: string };
  };
  small?: boolean;
  onSelect?: (id: string) => void;
  showDetails?: boolean;
};

const wishCardShell = "rounded-lg border border-gray-200 bg-white shadow-sm";

const Wish = ({ wish, small = false, onSelect, showDetails = false }: Props) => {
  const [open, setOpen] = useState(false);
  const picture = wish.image?.url || "/placeholder.jpg";
  const productUrl = getWishProductUrl(wish.link);
  const canOpenDialog = Boolean(onSelect || (showDetails && productUrl));

  const handleSelect = () => {
    if (!onSelect || !wish.id) return;
    setOpen(false);
    onSelect(wish.id);
  };

  return (
    <>
      <div
        className={cn(
          "group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]",
          canOpenDialog && "cursor-pointer",
        )}
        onClick={canOpenDialog ? () => setOpen(true) : undefined}
        role={canOpenDialog ? "button" : undefined}
      >
        <div className="p-4 pb-0">
          <div className="aspect-[4/3] overflow-hidden bg-gray-50">
            <img
              src={picture}
              alt={wish.description}
              className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-105"
            />
          </div>
        </div>
        {!small && <h3 className="p-4 text-base font-semibold text-caritas-gray-800">{wish.description}</h3>}
      </div>

      {canOpenDialog ? (
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
                <div className="p-6 pt-12 sm:p-8 sm:pt-8">
                  <div className="aspect-square overflow-hidden rounded-md bg-gray-50">
                    <img src={picture} alt="" className="h-full w-full object-contain" />
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <DialogTitle className="text-lg font-bold leading-snug text-caritas-gray-800">{wish.description}</DialogTitle>
                <DialogDescription asChild>
                  <p className="mt-3 text-base leading-relaxed text-gray-600">
                    {productUrl
                      ? "Weitere Produktdetails öffnen in einem neuen Fenster. Deine Auswahl auf dieser Seite bleibt erhalten."
                      : "Wähle diesen Wunsch für die Anmeldung."}
                  </p>
                </DialogDescription>

                <div className="mt-auto flex flex-col gap-3 pt-8">
                  {productUrl ? <ProductInfoButton href={productUrl} /> : null}
                  {onSelect ? (
                    <Button onClick={handleSelect} className="mx-0 w-full justify-center">
                      Wunsch anmelden
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
      ) : null}
    </>
  );
};

export default Wish;
