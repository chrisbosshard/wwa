// IMPORT BASICS
import React, { useState } from "react";
import Link from "next/link";

// IMPORT COMPONENTS
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { step1Schema } from "@validations/register";
import axios from "axios";

// CUSTOM COMPONENTS
import { Field } from "@elements/TextField/TextField";
import { Error } from "@elements/TextField/Error";
import { Button } from "@elements/Button/Button";
import { Button as MuiButton } from "@mui/material";

type FormData = z.infer<typeof step1Schema>;

// ****************************************
// COMPONENT: Auswaehlen
// Wünsche Auswählen
// ****************************************
const OnBoardStep1 = (props) => {
  // PROPS
  const { onNextStep, onAlternateStep, contact, waitinglist } = props;

  // STATE
  const [error, setError] = useState(false);

  // FORM
  const {register, handleSubmit, formState: { errors },} = useForm<FormData>({defaultValues:contact, resolver: zodResolver(step1Schema)}); // prettier-ignore

  // FUNCTION
  const checkEntries = async (data: FormData) => {
    const info = {
      leginr: data.leginr,
      expiresAt: data.expiresAt,
    };
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
    } else {
      setError(true);
    }
    // onNextStep(info);
  };

  // RETURN
  return (
    <>
      {!waitinglist && (
        <>
          <h2 className="font-bold">Schritt 1 - KulturLegi der Eltern überprüfen</h2>
          <h3>Bitte gib hier deine KulturLegi Mitglied Nummer und das Ablaufdatum an, damit wir die Gültigkeit deiner Karte überprüfen können.</h3>
        </>
      )}
      {error && (
        <div className="mb-12 w-full rounded-xl bg-red-200 p-8">
          <p className="text-lg font-bold text-black">Deine KulturLegi-Angaben sind ungültig</p>
          <p className="mb-4 text-black">
            Deine KulturLegi-Karte ist inaktiv und die Prüfung deiner KulturLegi-Angaben fehlgeschlagen. Ein Wunschanmeldung ist daher nicht möglich.
          </p>
          <div>
            <p className="mb-4 flex gap-4">
              <div className="flex h-12 w-12 min-w-[3rem] items-center justify-center rounded-full border-2 border-black">
                <p className="text-xl font-bold">a</p>
              </div>
              <p>
                Ist deine KulturLegi abgelaufen? Dann verlängere diese mit aktuellen Unterlagen per{" "}
                <a
                  className="text-blue-700 underline hover:text-blue-800"
                  href="https://www.kulturlegi.ch/zuerich/kulturlegi-beantragen/online-antrag"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Online-Antrag
                </a>{" "}
                oder persönlich im{" "}
                <a
                  className="text-blue-700 underline hover:text-blue-800"
                  href="https://www.kulturlegi.ch/zuerich/ueber-uns/kontakt"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  KulturLegi-Büro
                </a>
                .
              </p>
              .
            </p>
            <p className="mb-4 flex gap-4">
              <div className="flex h-12 w-12 min-w-[3rem] items-center justify-center rounded-full border-2 border-black">
                <p className="text-xl font-bold">b</p>
              </div>
              <p>Du wohnst nicht im Kanton Zürich oder Kanton Schaffhausen, dann kannst du leider nicht an der Aktion teilnehmen.</p>
            </p>
            <p className="mb-4 flex gap-4">
              <div className="flex h-12 w-12 min-w-[3rem] items-center justify-center rounded-full border-2 border-black">
                <p className="text-xl font-bold">c</p>
              </div>
              <p>
                Du besitzt keine KulturLegi? Die Berechtigungskriterien und weitere Informationen zur KulturLegi findest du unter{" "}
                <a className="text-blue-700 underline hover:text-blue-800" href="https://www.kulturlegi.ch/zuerich" target="_blank" rel="noopener noreferrer">
                  www.kulturlegi.ch/zuerich
                </a>
              </p>
            </p>
            <p>
              Brauchst du Hilfe? Telefonisch sind wir unter 044 366 68 48 erreichbar oder sind persönlich im KulturLegi-Büro, im Digi-Treff oder in den
              Lernstuben vom Kanton Zürich für dich da.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(checkEntries)} className="w-full">
        <div className="m-auto flex w-full max-w-2xl flex-col gap-3">
          <Field label="KulturLegi Mitglied Nummer*" {...register("leginr")} />
          <Error errors={errors} type="leginr" />
          <Field label="Ablaufdatum (TT.MM.JJJJ)*" {...register("expiresAt")} />
          <Error errors={errors} type="expiresAt" />
        </div>
        <div className="flex w-full justify-center">
          <Button className="mt-8">{waitinglist ? "Zur Warteliste" : "Prüfen"}</Button>
        </div>
        <div className="mt-4 flex flex-col items-center">
          {/* <a className="inline-link mt-2 cursor-pointer" onClick={onAlternateStep}>
            Ich habe eine KulturLegi ohne Nummer
          </a> */}
          <Link className="inline-link mt-2" href="/legihelp">
            Ich brauche Hilfe
          </Link>
          <a className="inline-link mt-2" href="https://www.kulturlegi.ch/zuerich/kulturlegi-beantragen/wer-ist-berechtigt">
            Ich habe noch keine KulturLegi
          </a>
        </div>
      </form>
    </>
  );
};

export default OnBoardStep1;
