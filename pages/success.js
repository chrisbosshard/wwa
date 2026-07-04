import { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher } from "../lib/utils";
import axios from "axios";
import { updateDonorPayment, connectKidToDonor } from "@lib/directus/api-client";

import Hero from "@sections/Hero/Hero";
import Footer from "@sections/Footer/Footer";

const Success = ({ onEmptyCart }) => {
  const {
    query: { session_id },
  } = useRouter();

  const { data, error } = useSWR(() => (session_id ? `/api/checkout_sessions/${session_id}` : null), fetcher);

  useEffect(() => {
    if (data) {
      updateDonorStatus();
    }
  }, [data]);

  const updateDonorStatus = async () => {
    const donorId = localStorage.getItem("donorId");
    const email = localStorage.getItem("email");
    const localCart = localStorage.getItem("cart") ? localStorage.getItem("cart").split(",") : [];
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
    <div>
      <Hero />
      <div className="details">
        <div className="details-info">
          {error ? (
            <h1>Etwas hat nicht funktioniert</h1>
          ) : !data ? null : (
            <>
              <h1 className="mb-8">Deine Zahlung war erfolgreich</h1>
              <h2>
                Herzlichen Dank für Deine Unterstützung. Mit Deiner Hilfe ermöglichen wir gemeinsam Weihnachtswünsche und ein schönes Fest für alle Kinder. Wir
                wünschen schöne Weihnachten.
              </h2>
            </>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Success;
