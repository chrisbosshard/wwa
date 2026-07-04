// IMPORT BASICS
import React, { useState, useEffect } from "react";

// IMPORT COMPONENTS
import WarningIcon from "@mui/icons-material/Warning";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { step4Schema } from "@validations/register";

// CUSTOM COMPONENTS
import { Field } from "@elements/TextField/TextField";
import { Error } from "@elements/TextField/Error";
import { Button } from "@elements/Button/Button";

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
      <h2 className="font-bold">Schritt 4 - Familienangaben</h2>
      <h3>
        Bitte fülle alle Felder aus. Wir benötigen diese Angaben für allfällige Rückfragen und das Ausstellen der Anmeldebestätigung. Diese Angaben werden nicht
        an Dritte weitergegeben.
      </h3>
      <form onSubmit={handleSubmit(checkEntries)} className="w-full">
        <div className="m-auto flex w-full max-w-2xl flex-col gap-3">
          <Field label="Vorname*" {...register("prename")} />
          <Error errors={errors} type="prename" />
          <Field label="Familienname / Nachname*" {...register("surname")} />
          <Error errors={errors} type="surname" />
          <div className="flex w-full flex-col justify-between gap-3 lg:flex-row">
            <div className="w-full">
              <Field label="Strasse*" {...register("street")} />
              <Error errors={errors} type="street" />
            </div>
            <div className="w-full">
              <Field label="Hausnummer*" {...register("nr")} />
              <Error errors={errors} type="nr" />
            </div>
          </div>
          <div className="flex w-full flex-col justify-between gap-3 lg:flex-row">
            <div className="w-full">
              <Field label="PLZ*" {...register("zipcode")} />
              <Error errors={errors} type="zipcode" />
            </div>
            <div className="w-full">
              <Field label="Wohnort*" {...register("city")} />
              <Error errors={errors} type="city" />
            </div>
          </div>
          <Field label="Telefonnummer*" {...register("phone")} />
          <Error errors={errors} type="phone" />
          <Field label="Email*" {...register("email")} />
          <Error errors={errors} type="email" />
        </div>
        <div className="flex w-full flex-col justify-center lg:flex-row">
          <Button type="button" onClick={onStepBack} className="mx-0 mt-8 lg:mx-4">
            Zurück
          </Button>
          <Button type="submit" className="mx-0 mt-4 lg:mx-4 lg:mt-8">
            Weiter
          </Button>
        </div>
      </form>
    </>
  );
};

export default OnBoardStep4;
