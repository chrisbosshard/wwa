"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { fetcher } from "@/lib/utils";
import axios from "axios";
import { updateDonorPayment, connectKidToDonor } from "@lib/directus/api-client";
import Page from "@elements/Page/Page";
import Footer from "@sections/Footer/Footer";
import { Button } from "@elements/Button/Button";
import { OnboardStepPanel } from "@sections/Onboard/OnboardStepPanel";
import { useCart } from "@/components/providers/CartProvider";

function SuccessContent() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const { onEmptyCart } = useCart();
  const finalized = useRef(false);
  const [finalizing, setFinalizing] = useState(true);
  const [finalizeError, setFinalizeError] = useState<string | null>(null);

  const { data, error } = useSWR(() => (session_id ? `/api/checkout_sessions/${session_id}` : null), fetcher);

  useEffect(() => {
    if (!data || finalized.current) return;

    finalized.current = true;

    async function finalizePayment() {
      if (data.payment_status !== "paid") {
        setFinalizeError("Die Zahlung wurde noch nicht bestätigt.");
        setFinalizing(false);
        return;
      }

      const donorId = localStorage.getItem("donorId");
      const email = localStorage.getItem("email");
      const localCart = localStorage.getItem("cart")?.split(",").filter(Boolean) ?? [];

      try {
        if (donorId) {
          await updateDonorPayment(donorId);

          for (const kidId of localCart) {
            await connectKidToDonor(kidId, donorId);
          }
        }

        if (email && donorId && localCart.length > 0) {
          try {
            await axios.post("/api/send_success_email", {
              email,
              number: localCart.length,
            });
          } catch (emailError) {
            console.error("Payment succeeded, but confirmation email failed:", emailError);
          }
        }

        localStorage.removeItem("email");
        localStorage.removeItem("cart");
        localStorage.removeItem("donorId");
        onEmptyCart();
        setFinalizing(false);
      } catch (err) {
        console.error("Failed to finalize payment:", err);
        setFinalizeError(
          "Die Zahlung war erfolgreich, aber die Bestätigung konnte nicht vollständig verarbeitet werden. Bitte kontaktieren Sie uns.",
        );
        setFinalizing(false);
      }
    }

    void finalizePayment();
  }, [data, onEmptyCart]);

  const hasError = !session_id || error || finalizeError;
  const isLoading = Boolean(session_id) && !error && (!data || finalizing);
  const title = hasError ? "Zahlung prüfen" : isLoading ? "Zahlung wird bestätigt" : "Zahlung erfolgreich";

  return (
    <>
      <Page
        title={title}
        breadcrumbs={[
          { label: "Weihnachtswunschaktion", href: "/" },
          { label: title },
        ]}
      >
        {hasError ? (
          <OnboardStepPanel className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF5F5] text-caritas-red">
              <ExclamationTriangleIcon className="h-8 w-8" aria-hidden />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-[#242424]">Wir konnten die Bestätigung nicht abschliessen</h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-[#575656]">
              {finalizeError ||
                "Die Zahlungsinformationen konnten nicht geladen werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns."}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button type="button" onClick={() => window.location.reload()} className="mx-0">
                Erneut versuchen
              </Button>
              <Button innerLink="/contact" color="outline" className="mx-0">
                Kontakt
              </Button>
            </div>
          </OnboardStepPanel>
        ) : isLoading ? (
          <OnboardStepPanel className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FEEBED] text-caritas-red">
              <ArrowPathIcon className="h-8 w-8 animate-spin" aria-hidden />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-[#242424]">Einen Moment bitte</h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-[#575656]">
              Wir prüfen Ihre Zahlung und bestätigen die erfüllten Wünsche.
            </p>
          </OnboardStepPanel>
        ) : (
          <OnboardStepPanel className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F1F7E8] text-[#63852E]">
              <CheckCircleIcon className="h-9 w-9" aria-hidden />
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.08em] text-caritas-red">Herzlichen Dank</p>
            <h2 className="mt-2 text-2xl font-bold text-[#242424] md:text-3xl">Ihre Zahlung war erfolgreich</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-[#575656]">
              Mit Ihrer Hilfe ermöglichen wir Weihnachtswünsche und ein schönes Fest für Kinder aus finanziell benachteiligten Familien.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#575656]">
              Ihre Unterstützung wurde erfolgreich erfasst.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button innerLink="/" className="mx-0">
                Zur Startseite
              </Button>
              <Button innerLink="/wunscherfuellen" color="outline" className="mx-0">
                Weitere Wünsche erfüllen
              </Button>
            </div>
          </OnboardStepPanel>
        )}
      </Page>
      <Footer />
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <Page title="Zahlung wird bestätigt">
          <OnboardStepPanel className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FEEBED] text-caritas-red">
              <ArrowPathIcon className="h-8 w-8 animate-spin" aria-hidden />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-[#242424]">Einen Moment bitte</h2>
          </OnboardStepPanel>
        </Page>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
