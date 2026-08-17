"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import axios from "axios";
import { updateDonorPayment, connectKidToDonor } from "@lib/directus/api-client";
import Page from "@elements/Page/Page";
import Footer from "@sections/Footer/Footer";
import { useCart } from "@/components/providers/CartProvider";

function SuccessContent() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const { onEmptyCart } = useCart();

  const { data, error } = useSWR(() => (session_id ? `/api/checkout_sessions/${session_id}` : null), fetcher);

  useEffect(() => {
    if (data) {
      updateDonorStatus();
    }
  }, [data]);

  const updateDonorStatus = async () => {
    const donorId = localStorage.getItem("donorId");
    const email = localStorage.getItem("email");
    const localCart = localStorage.getItem("cart") ? localStorage.getItem("cart")!.split(",") : [];
    localStorage.removeItem("email");
    localStorage.removeItem("cart");
    localStorage.removeItem("donorId");

    if (donorId) {
      await updateDonorPayment(donorId);
    }
    if (localCart.length > 0) {
      for (let i = 0; i < localCart.length; i++) {
        await connectKidToDonor(localCart[i], donorId);
      }
    }

    if (email && donorId && localCart.length > 0) {
      await axios.post("/api/send_success_email", {
        email: email,
        number: localCart.length,
      });
    }

    onEmptyCart();
  };

  return (
    <>
      <Page title={error ? "Fehler" : "Zahlung erfolgreich"}>
        {error ? (
          <h2 className="text-gold-300">Etwas hat nicht funktioniert</h2>
        ) : !data ? (
          <h2 className="text-gold-300">Zahlung wird bestätigt…</h2>
        ) : (
          <h2 className="mb-6 font-normal leading-7 text-gold-300">
            Herzlichen Dank für Deine Unterstützung. Mit Deiner Hilfe ermöglichen wir gemeinsam Weihnachtswünsche und ein schönes Fest für alle Kinder. Wir
            wünschen schöne Weihnachten.
          </h2>
        )}
      </Page>
      <div className="px-4">
        <Footer />
      </div>
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <Page title="Zahlung erfolgreich">
          <h2 className="text-gold-300">Zahlung wird bestätigt…</h2>
        </Page>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
