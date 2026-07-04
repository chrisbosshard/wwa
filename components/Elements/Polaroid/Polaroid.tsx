// IMPORT BASICS
import React, { useState } from "react";
import { useRouter } from "next/router";

// IMPORT COMPONENTS
import Dialog from "@mui/material/Dialog";
import Backdrop from "@mui/material/Backdrop";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import Image from "next/legacy/image";

import axios from "axios";
import getStripe from "@lib/get-stripe.js";

// IMPORT CUSTOM COMPONENTS
import { Button } from "@elements/Button/Button";

function TransitionUp(props) {
  return <Slide {...props} direction="right" />;
}

const Polaroid = (props) => {
  const { kid, cart, kids, onAddToCart, onRemoveFromCart } = props;
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const router = useRouter();

  // FUNCTIONS
  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = () => {
    setOpen(false);
    onAddToCart(kid);
    setConfirm("Geschenk hinzugefügt");
  };

  const handleRemove = () => {
    setOpen(false);
    onRemoveFromCart(kid.id);
    setConfirm("Geschenk entfernt");
  };

  const handleAddCheckout = () => {
    setOpen(false);
    router.push("/checkout");
    onAddToCart(kid);
  };

  const redirectToCheckout = async () => {
    const {
      data: { id },
    } = await axios.post("/api/checkout_sessions", {
      items: [
        {
          price: process.env.PRODUCT_ID,
          quantity: 1,
        },
      ],
    });
    // Redirect to checkout
    const stripe = await getStripe();
    await stripe.redirectToCheckout({ sessionId: id });
  };

  const kidStyle = cart.includes(kid.id) ? "glow" : "";
  let donorName = kid.donor && kid.donor.public === "Yes" ? kid.donor.prename : "Spender";
  donorName = donorName.length > 12 ? donorName.substring(0, 12) + "..." : donorName;

  const completed = kid.donor && (kid.donor.manualUpload || kid.donor.paymentSuccessful);

  console.log("KID", kid);

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

  const background = completed ? "/polaroid_gray.png" : "/polaroid.png";

  // IF ACTIVITY IS DONE
  const isDone = false;

  const picture = kid.wish && kid.wish.image && kid.wish.image.url ? kid.wish.image.url : "/placeholder.jpg";

  return (
    <>
      <div
        className={"wish-card relative h-full w-full cursor-pointer " + kidStyle}
        onClick={(e) => setOpen(true)}
      >
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
            <Image
              src={picture}
              layout="fill"
              alt="gift"
              placeholder="blur"
              blurDataURL={picture}
              priority
              className="max-h-full max-w-full object-contain"
            />
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
      <Dialog open={open !== false} onClose={handleClose} fullWidth={true} BackdropComponent={Backdrop}>
        {completed ? (
          <div className="absolute right-0 z-20 ml-32 max-w-full">
            <img src="/big_bow.png" alt="bow" />
          </div>
        ) : null}
        <div className="relative flex flex-col justify-between bg-cover bg-no-repeat p-8" style={{ backgroundImage: 'url("card_background_small.png")' }}>
          <div className="hidden sm:flex">
            <img className="absolute right-0 top-[10px] h-[210px] w-[210px] rotate-[4deg]" src={picture} alt="gift" />
            <img className="absolute right-[-20px] top-[-9px]" src="/details_polaroid.png" alt="gift" />
          </div>
          <div className="mb-12 mt-40 w-80 max-w-full">
            <p className="whitespace-normal font-handwritten text-xl font-bold sm:text-2xl">{text}</p>
          </div>
          <div className="relative -ml-4 -mr-4">
            <div className="bottom-8 flex w-full flex-col gap-3">
              {!completed && !cart.includes(kid.id) && !isDone ? (
                <>
                  <Button onClick={handleAddCheckout} color="darkblue" size="small">
                    Direkt erfüllen
                  </Button>
                  <Button onClick={handleAdd} color="darkblue" size="small">
                    In den Geschenkekorb
                  </Button>
                </>
              ) : null}
              {cart.includes(kid.id) && !isDone ? (
                <Button onClick={handleRemove} color="darkblue" size="small">
                  Aus Geschenkekorb entfernen
                </Button>
              ) : null}
              <Button onClick={() => setOpen(false)} color="darkblue" size="small">
                Schliessen
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        TransitionComponent={TransitionUp}
        message={confirm}
        key={"confirmation"}
        autoHideDuration={3000}
      />
    </>
  );
};

export default Polaroid;
