"use client";

import React, { useState, useContext } from "react";
import OnboardStep1 from "@sections/Onboard/OnboardStep1";
import OnboardStep1a from "@sections/Onboard/OnboardStep1a";
import OnboardStep2 from "@sections/Onboard/OnboardStep2";
import OnboardStep3 from "@sections/Onboard/OnboardStep3";
import OnboardStep4 from "@sections/Onboard/OnboardStep4";
import OnboardStep5 from "@sections/Onboard/OnboardStep5";
import OnboardStep6 from "@sections/Onboard/OnboardStep6";
import OnboardStep7 from "@sections/Onboard/OnboardStep7";
import { Process } from "@sections/Process/Process";
import { OnboardStepPanel } from "@sections/Onboard/OnboardStepPanel";
import { createFamily } from "@lib/directus/api-client";
import axios from "axios";
import Page from "@elements/Page/Page";
import Footer from "@sections/Footer/Footer";
import ApplicationContext from "@context/ApplicationContext/ApplicationContext";

export default function AuswaehlenPage() {
  const [step, setStep] = useState(1);
  const [kids, setKids] = useState([]);
  const [family, setFamily] = useState({});
  const [contact, setContact] = useState({ leginr: "", image: null, imageName: "" });
  const [note, setNote] = useState({ note: "", contactPermission: null, dataRegulation: null, origin: "" });
  const [data, setData] = useState({});
  const { appState } = useContext(ApplicationContext);

  const toAlternateStep = (value) => {
    if (step === 1) {
      setStep(1.5);
    } else {
      setStep(1);
    }
  };

  const toStep2 = (value) => {
    setContact(value);
    setStep(2);
  };

  const toStep5 = (value) => {
    setFamily(value);
    setStep(5);
  };

  const toStep6 = (value) => {
    setNote(value);
    const newData = {
      ...family,
      leginr: contact.leginr,
      comment: value.note,
      contactPermission: value.contactPermission,
      dataRegulation: value.dataRegulation,
      origin: value.origin,
      kids: null,
      image: null,
    };
    const kidsText = [];
    const kidsData = kids.map((kid) => {
      kidsText.push(kid.prename + " (" + kid.age + "): " + kid.wish.description);
      return { prename: kid.prename, age: kid.age, active: true, wish: { connect: { id: kid.wish.id } } };
    });
    newData.kids = kidsText.join(", ");
    setData(newData);
    setStep(6);
  };

  const toStep7 = async () => {
    const familyPayload = {
      ...data,
      kids: null,
      image: null,
    };
    const kidsText = [];
    const kidsData = kids.map((kid) => {
      kidsText.push(kid.prename + " (" + kid.age + "): " + kid.wish.description);
      return { prename: kid.prename, age: kid.age, wishId: kid.wish.id };
    });

    try {
      await createFamily(familyPayload, kidsData, contact.image || null);
    } catch (error) {
      console.error("Failed to create family:", error);
      throw new Error("Die Anmeldung konnte nicht gespeichert werden. Bitte versuche es erneut.");
    }

    try {
      const info = { ...family, ...contact, children: kidsText.join(", ") };
      await axios.post("/api/send_email", { info });
    } catch (error) {
      console.error("Confirmation email failed:", error);
    }

    setStep(7);
  };

  if (appState !== "registration") return null;

  return (
    <>
      <Page title="Weihnachtswunsch anmelden">
        <>
          <p className="mb-0 max-w-none font-sans text-[1.375rem] font-normal leading-[1.6] tracking-[0.0375rem] text-[#242424] md:mb-2 xl:text-[1.5625rem]">
            Melde hier die Wünsche für deine Kinder bis zum 14. Geburtstag an. Es werden nur Anmeldungen aus dem Kanton Zürich und Kanton Schaffhausen
            berücksichtigt. Voraussetzung für die Anmeldung ist eine gültige KulturLegi. Pro Kind kann ein Wunsch im Wert von maximal 50 Franken (keine
            Aktionen) angemeldet werden.
          </p>
          <Process step={step} />
          <OnboardStepPanel className="mt-6 md:mt-8">
          {step === 1 && <OnboardStep1 contact={contact} onNextStep={toStep2} onAlternateStep={toAlternateStep} />}
          {step === 1.5 && <OnboardStep1a contact={contact} onNextStep={toStep2} onAlternateStep={toAlternateStep} />}
          {step === 2 && <OnboardStep2 kids={kids} onNextStep={() => setStep(3)} onStepBack={() => setStep(1)} onKidChange={setKids} />}
          {step === 3 && <OnboardStep3 kids={kids} family={family} onNextStep={() => setStep(4)} onStepBack={() => setStep(2)} onKidChange={setKids} />}
          {step === 4 && <OnboardStep4 family={family} onNextStep={toStep5} onStepBack={() => setStep(3)} />}
          {step === 5 && <OnboardStep5 note={note} onNextStep={toStep6} onStepBack={() => setStep(4)} />}
          {step === 6 && <OnboardStep6 data={data} onNextStep={toStep7} onStepBack={() => setStep(5)} />}
          {step === 7 && <OnboardStep7 />}
          </OnboardStepPanel>
        </>
      </Page>
      <div className="col-span-12 mt-8 px-4 pt-4">
        {" "}
        <Footer />
      </div>
    </>
  );
}
