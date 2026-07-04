// IMPORT BASICS
import React from "react";

// CUSTOM COMPONENTS
import { Button } from "@elements/Button/Button";

// ****************************************
// COMPONENT: Auswaehlen
// Wünsche Auswählen
// ****************************************
const Auswaehlen = (props) => {
  // PROPS
  const { data, onNextStep, onStepBack } = props;

  return (
    <>
      <h2 className="font-bold">Zusammenfassung</h2>
      <h3>Bitte überprüfe alle deine Angaben.</h3>
      <div className="m-auto mt-6 flex w-full max-w-2xl flex-col rounded-xl bg-black bg-opacity-20 p-4 text-gold-300 lg:p-8">
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

      <div className="flex w-full flex-col justify-center lg:flex-row">
        <Button type="button" onClick={onStepBack} className="mx-0 mt-12 lg:mx-4">
          Zurück
        </Button>
        <Button onClick={onNextStep} className="mx-0 mt-4 lg:mx-4 lg:mt-12">
          Bestätigen
        </Button>
      </div>
    </>
  );
};

export default Auswaehlen;
