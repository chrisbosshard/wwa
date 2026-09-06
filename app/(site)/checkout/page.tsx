"use client";

import React, { useState } from "react";
import axios from "axios";
import { CheckCircleIcon, LockClosedIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { createDonor } from "@lib/directus/api-client";
import * as z from "zod";
import { checkoutSchema } from "@validations/register";
import { FormField } from "@elements/TextField/FormField";
import { Error as FormError } from "@elements/TextField/Error";
import { CheckboxField } from "@elements/Checkbox/CheckboxField";
import { Button } from "@elements/Button/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Page from "@elements/Page/Page";
import Footer from "@sections/Footer/Footer";
import { OnboardStepPanel } from "@sections/Onboard/OnboardStepPanel";
import { useCart } from "@/components/providers/CartProvider";
import { inlineLink } from "@/lib/ui-classes";

type FormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { cart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(checkoutSchema) });

  const redirectToCheckout = async (data: FormData) => {
    if (submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const quantity = cart.length;

      const payload = { ...data, zipcode: data.zipcode + "", numberOfGifts: quantity, paymentSuccessful: "No" };
      const {
        data: { url },
      } = await axios.post("/api/checkout_sessions", {
        customerEmail: data.email,
        quantity,
      });
      if (!url) throw new Error("Stripe Checkout URL fehlt.");

      const result = await createDonor(payload);
      const donorId = result.createDonor.id;
      localStorage.setItem("donorId", donorId);
      localStorage.setItem("email", data.email);
      window.location.assign(url);
    } catch (error) {
      console.error("Checkout failed:", error);
      setSubmitError("Die Zahlung konnte nicht gestartet werden. Bitte versuchen Sie es erneut.");
      setSubmitting(false);
    }
  };

  const giftText = cart.length > 1 ? `${cart.length} Geschenke` : `${cart.length} Geschenk`;
  const total = cart.length * 50;

  return (
    <>
      <Page
        title="Kasse"
        breadcrumbs={[
          { label: "Weihnachtswunschaktion", href: "/" },
          { label: "Kasse" },
        ]}
      >
        <p className="mb-8 max-w-4xl text-lg leading-relaxed text-[#575656] md:mb-10 md:text-xl">
          Vielen Dank für Ihre Unterstützung. Mit Ihrer Spende ermöglichen Sie Kindern aus finanziell benachteiligten Familien einen Weihnachtswunsch.
        </p>

        {cart.length > 0 ? (
          <form onSubmit={handleSubmit(redirectToCheckout)} className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
            <OnboardStepPanel>
              <div className="mb-8 border-b border-[#EBE9E9] pb-6">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-caritas-red">Ihre Angaben</p>
                <h2 className="text-2xl font-bold text-[#242424]">Persönliche Informationen</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#575656]">
                  Wir benötigen diese Angaben für die Spendenbestätigung.
                </p>
              </div>

              <div className="space-y-6">
                <fieldset>
                  <legend className="mb-3 text-sm font-medium text-[#242424]">Anrede*</legend>
                  <div className="flex flex-wrap gap-x-6 gap-y-3">
                    {["Frau", "Herr", "Andere"].map((title) => (
                      <label key={title} className="flex cursor-pointer items-center gap-2 text-[#242424]">
                        <input
                          className="h-5 w-5 cursor-pointer accent-caritas-red"
                          type="radio"
                          {...register("titel")}
                          value={title}
                        />
                        {title}
                      </label>
                    ))}
                  </div>
                  <FormError errors={errors} type="titel" />
                </fieldset>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    label="Vorname*"
                    name="prename"
                    errors={errors}
                    autoComplete="given-name"
                    {...register("prename")}
                  />
                  <FormField
                    label="Familienname / Nachname*"
                    name="surname"
                    errors={errors}
                    autoComplete="family-name"
                    {...register("surname")}
                  />
                </div>

                <FormField
                  label="Adresse*"
                  name="address"
                  errors={errors}
                  autoComplete="street-address"
                  {...register("address")}
                />

                <div className="grid gap-5 sm:grid-cols-[0.7fr_1.3fr]">
                  <FormField
                    label="PLZ*"
                    name="zipcode"
                    errors={errors}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    {...register("zipcode")}
                  />
                  <FormField
                    label="Wohnort*"
                    name="city"
                    errors={errors}
                    autoComplete="address-level2"
                    {...register("city")}
                  />
                </div>

                <FormField
                  label="E-Mail-Adresse*"
                  name="email"
                  errors={errors}
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                />

                <fieldset className="border-t border-[#EBE9E9] pt-6">
                  <legend className="mb-3 max-w-2xl text-sm font-medium leading-relaxed text-[#242424]">
                    Dürfen wir Ihren Vornamen auf unserer Website veröffentlichen? Zum Beispiel: «Wunsch erfüllt von Erwin».
                  </legend>
                  <div className="flex gap-6">
                    {[
                      { label: "Ja", value: "Yes" },
                      { label: "Nein", value: "No" },
                    ].map((option) => (
                      <label key={option.value} className="flex cursor-pointer items-center gap-2 text-[#242424]">
                        <input
                          className="h-5 w-5 cursor-pointer accent-caritas-red"
                          type="radio"
                          {...register("public")}
                          value={option.value}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  <FormError errors={errors} type="public" />
                </fieldset>

                <div className="rounded-xl bg-[#F6F6F4] p-5">
                  <CheckboxField
                    id="dataRegulation"
                    {...register("dataRegulation")}
                    label={
                      <>
                        Ich akzeptiere die{" "}
                        <a
                          className={inlineLink}
                          href="https://caritas-regio.ch/datenschutzbestimmungen"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Datenschutzrichtlinien
                        </a>
                        .
                      </>
                    }
                  />
                  <FormError errors={errors} type="dataRegulation" />
                </div>
              </div>
            </OnboardStepPanel>

            <aside className="rounded-2xl border border-[#EBE9E9] bg-white p-6 shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#FEEBED] text-caritas-red">
                <ShoppingBagIcon className="h-6 w-6" aria-hidden />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#575656]">Ihre Spende</p>
              <h2 className="mt-2 text-2xl font-bold text-[#242424]">{giftText}</h2>

              <div className="my-6 space-y-3 border-y border-[#EBE9E9] py-5 text-sm text-[#575656]">
                <div className="flex items-center justify-between gap-4">
                  <span>{giftText}</span>
                  <span>{total} CHF</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-lg font-bold text-[#242424]">
                  <span>Total</span>
                  <span>{total} CHF</span>
                </div>
              </div>

              <ul className="mb-6 space-y-3 text-sm leading-relaxed text-[#575656]">
                <li className="flex gap-2">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-caritas-red" aria-hidden />
                  Spendenbestätigung anfangs Jahr
                </li>
                <li className="flex gap-2">
                  <LockClosedIcon className="mt-0.5 h-5 w-5 shrink-0 text-caritas-red" aria-hidden />
                  Sichere Zahlung über Stripe
                </li>
              </ul>

              {submitError && (
                <p className="mb-4 rounded-lg bg-[#FEF5F5] p-3 text-sm font-medium text-caritas-red" role="alert">
                  {submitError}
                </p>
              )}

              <Button disabled={submitting} type="submit" className="mx-0 w-full">
                {submitting ? "Zahlung wird vorbereitet …" : "Weiter zur Zahlung"}
              </Button>
            </aside>

            <div className="text-sm leading-relaxed text-[#575656] lg:col-span-2">
              <p>
                Ihre persönlichen Daten werden von Caritas Zürich vertraulich behandelt und nicht an Dritte weitergegeben.
                Ihre Zahlungsdaten werden direkt durch unseren zertifizierten Zahlungspartner verarbeitet.
              </p>
              <p className="mt-3">
                Sie können Ihre Spende vom steuerbaren Einkommen abziehen. Die Spendenbestätigung erhalten Sie anfangs Jahr.
              </p>
            </div>
          </form>
        ) : (
          <div className="rounded-2xl border border-[#EBE9E9] bg-white px-6 py-10 text-center shadow-sm md:px-10 md:py-14">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FEEBED] text-caritas-red">
              <ShoppingBagIcon className="h-7 w-7" aria-hidden />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-[#242424]">Ihr Geschenkekorb ist leer</h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-[#575656]">
              Wählen Sie zuerst einen oder mehrere Weihnachtswünsche aus.
            </p>
            <Button innerLink="/wunscherfuellen" className="mx-0 mt-6">
              Wünsche entdecken
            </Button>
          </div>
        )}
      </Page>
      <Footer />
    </>
  );
}
