// IMPORT BASICS
import React, { useState } from "react";

// CUSTOM COMPONENTS
import { Button } from "@elements/Button/Button";
import { onboardStepAlert } from "@sections/Onboard/OnboardLegiInvalidAlert";
import { onboardStepNav } from "@sections/Onboard/OnboardStepPanel";

// ****************************************
// COMPONENT: Auswaehlen
// Wünsche Auswählen
// ****************************************
const Auswaehlen = (props) => {
  // PROPS
  const { data, onNextStep, onStepBack } = props;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      await onNextStep();
    } catch (err) {
      setSubmitting(false);
      setError(
        err instanceof Error
          ? err.message
          : "Die Anmeldung konnte nicht gespeichert werden. Bitte versuche es erneut.",
      );
    }
  };

  return (
    <>
      <h2 className="font-bold">Zusammenfassung</h2>
      <h3>Bitte überprüfe alle deine Angaben.</h3>
      <div className="mt-6 flex w-full flex-col rounded-xl bg-[#F6F7F7] p-4 text-[#242424] lg:p-8">
        <table className="hidden lg:table">
          <tbody>
            <tr>
              <td className="mr-4 min-w-[150px] font-bold">Vorname</td>
              <td>{data.prename}</td>
            </tr>
            <tr>
              <td className="mr-4 font-bold">Nachname</td>
              <td>{data.surname}</td>
            </tr>
            <tr>
              <td className="mr-4 font-bold">Strasse</td>
              <td>{data.street}</td>
            </tr>
            <tr>
              <td className="mr-4 font-bold">Nr</td>
              <td>{data.nr}</td>
            </tr>
            <tr>
              <td className="mr-4 font-bold">PLZ</td>
              <td>{data.zipcode}</td>
            </tr>
            <tr>
              <td className="mr-4 font-bold">Ort</td>
              <td>{data.city}</td>
            </tr>
            <tr>
              <td className="mr-4 font-bold">Email</td>
              <td>{data.email}</td>
            </tr>
            <tr>
              <td className="mr-4 font-bold">Telefon</td>
              <td>{data.phone}</td>
            </tr>
            <tr>
              <td className="mr-4 font-bold">KulturLegi-Nr</td>
              <td>{data.leginr}</td>
            </tr>
            <tr>
              <td className="mr-4 font-bold">Kinder</td>
              <td>{data.kids}</td>
            </tr>
          </tbody>
        </table>
        <div className="flex flex-col lg:hidden">
          <p className="font-bold">Vorname</p>
          <p>{data.prename}</p>
          <p className="mt-4 font-bold">Nachname</p>
          <p>{data.surname}</p>
          <p className="mt-4 font-bold">Strasse</p>
          <p>{data.street}</p>
          <p className="mt-4 font-bold">Nr</p>
          <p>{data.nr}</p>
          <p className="mt-4 font-bold">PLZ</p>
          <p>{data.zipcode}</p>
          <p className="mt-4 font-bold">Ort</p>
          <p>{data.city}</p>
          <p className="mt-4 font-bold">Email</p>
          <p>{data.email}</p>
          <p className="mt-4 font-bold">Telefon</p>
          <p>{data.phone}</p>
          <p className="mt-4 font-bold">Legi-Nr</p>
          <p>{data.leginr}</p>
          <p className="mt-4 font-bold">Kinder</p>
          <p>{data.kids}</p>
        </div>
      </div>

      {error && (
        <div className={`${onboardStepAlert} mt-6`} role="alert">
          <p className="text-sm leading-relaxed text-[#575656]">{error}</p>
        </div>
      )}

      <div className={onboardStepNav}>
        <Button type="button" onClick={onStepBack} disabled={submitting} className="mx-0">
          Zurück
        </Button>
        <Button type="button" onClick={handleConfirm} disabled={submitting} className="mx-0">
          {submitting ? "Wird gesendet…" : "Bestätigen"}
        </Button>
      </div>
    </>
  );
};

export default Auswaehlen;
