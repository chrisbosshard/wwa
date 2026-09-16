// IMPORT BASICS
import React, { useState } from "react";
import Link from "next/link";
import { inlineLink } from "@/lib/ui-classes";
import {
  onboardFormActions,
  onboardFormFields,
  onboardStepDescription,
  onboardStepTitle,
} from "@sections/Onboard/OnboardStepPanel";
import { OnboardLegiInvalidAlert, OnboardLegiUnavailableAlert } from "@sections/Onboard/OnboardLegiInvalidAlert";

// IMPORT COMPONENTS
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { step1Schema } from "@validations/register";

// CUSTOM COMPONENTS
import { FormField } from "@elements/TextField/FormField";
import { Button } from "@elements/Button/Button";

type FormData = z.infer<typeof step1Schema>;

// ****************************************
// COMPONENT: Auswaehlen
// Wünsche Auswählen
// ****************************************
const OnBoardStep1 = (props) => {
  // PROPS
  const { onNextStep, onAlternateStep, contact, waitinglist } = props;

  // STATE
  const [error, setError] = useState<"invalid" | "unavailable" | null>(null);

  // FORM
  const {register, handleSubmit, formState: { errors },} = useForm<FormData>({defaultValues:contact, resolver: zodResolver(step1Schema)}); // prettier-ignore

  // FUNCTION
  const checkEntries = async (data: FormData) => {
    const info = {
      leginr: data.leginr,
      expiresAt: data.expiresAt,
    };
    setError(null);
    const res = await fetch("/api/check_legi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ info }),
    });
    const response = await res.json();

    if (response.success && response.data && response.data.Valid) {
      onNextStep(info);
    } else if (response.error === "unavailable") {
      setError("unavailable");
    } else {
      setError("invalid");
    }
    // onNextStep(info);
  };

  // RETURN
  return (
    <>
      {!waitinglist && (
        <>
          <h2 className={onboardStepTitle}>Schritt 1 - KulturLegi der Eltern überprüfen</h2>
          <p className={onboardStepDescription}>
            Bitte gib hier deine KulturLegi Mitglied Nummer und das Ablaufdatum an, damit wir die Gültigkeit deiner Karte überprüfen können.
          </p>
        </>
      )}
      {error === "unavailable" && <OnboardLegiUnavailableAlert />}
      {error === "invalid" && <OnboardLegiInvalidAlert />}

      <form onSubmit={handleSubmit(checkEntries)} className="w-full">
        <div className={onboardFormFields}>
          <FormField label="KulturLegi Mitglied Nummer*" name="leginr" errors={errors} {...register("leginr")} />
          <FormField label="Ablaufdatum (TT.MM.JJJJ)*" name="expiresAt" errors={errors} {...register("expiresAt")} />
        </div>
        <div className={onboardFormActions}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button type="submit">{waitinglist ? "Zur Warteliste" : "Prüfen"}</Button>
          </div>
          <Link className={inlineLink} href="/legihelp">
            Ich brauche Hilfe
          </Link>
          <a className={inlineLink} href="https://www.kulturlegi.ch/zuerich/kulturlegi-beantragen/wer-ist-berechtigt">
            Ich habe noch keine KulturLegi
          </a>
        </div>
      </form>
    </>
  );
};

export default OnBoardStep1;
