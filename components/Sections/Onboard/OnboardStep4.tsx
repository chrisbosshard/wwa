// IMPORT BASICS
import React, { useState, useEffect } from "react";

// IMPORT COMPONENTS
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { step4Schema } from "@validations/register";

// CUSTOM COMPONENTS
import { FormField } from "@elements/TextField/FormField";
import { Button } from "@elements/Button/Button";
import { onboardFormFields, onboardStepDescription, onboardStepNav, onboardStepTitle } from "@sections/Onboard/OnboardStepPanel";

type FormData = z.infer<typeof step4Schema>;

// ****************************************
// COMPONENT: Auswaehlen
// Wünsche Auswählen
// ****************************************
const OnBoardStep4 = (props) => {
  // PROPS
  const { family, onNextStep, onStepBack } = props;

  // FORM
  const {register, handleSubmit, formState: { errors },} = useForm<FormData>({defaultValues:family, resolver: zodResolver(step4Schema)}); // prettier-ignore

  // FUNCTION
  const checkEntries = async (data: FormData) => {
    const value = {
      prename: data.prename,
      surname: data.surname,
      street: data.street,
      nr: data.nr,
      zipcode: data.zipcode.toString(),
      city: data.city,
      phone: data.phone,
      email: data.email,
    };
    onNextStep(value);
  };

  // RETURN
  return (
    <>
      <h2 className={onboardStepTitle}>Schritt 4 - Familienangaben</h2>
      <p className={onboardStepDescription}>
        Bitte fülle alle Felder aus. Wir benötigen diese Angaben für allfällige Rückfragen und das Ausstellen der Anmeldebestätigung. Diese Angaben werden nicht
        an Dritte weitergegeben.
      </p>
      <form onSubmit={handleSubmit(checkEntries)} className="w-full">
        <div className={onboardFormFields}>
          <FormField label="Vorname*" name="prename" errors={errors} {...register("prename")} />
          <FormField label="Familienname / Nachname*" name="surname" errors={errors} {...register("surname")} />
          <div className="flex w-full flex-col gap-4 lg:flex-row lg:gap-4">
            <FormField label="Strasse*" name="street" errors={errors} {...register("street")} />
            <FormField label="Hausnummer*" name="nr" errors={errors} {...register("nr")} />
          </div>
          <div className="flex w-full flex-col gap-4 lg:flex-row lg:gap-4">
            <FormField label="PLZ*" name="zipcode" errors={errors} {...register("zipcode")} />
            <FormField label="Wohnort*" name="city" errors={errors} {...register("city")} />
          </div>
          <FormField label="Telefonnummer*" name="phone" errors={errors} {...register("phone")} />
          <FormField label="Email*" name="email" errors={errors} {...register("email")} />
        </div>
        <div className={onboardStepNav}>
          <Button type="button" onClick={onStepBack}>
            Zurück
          </Button>
          <Button type="submit">Weiter</Button>
        </div>
      </form>
    </>
  );
};

export default OnBoardStep4;
