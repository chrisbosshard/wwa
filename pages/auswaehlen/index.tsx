// IMPORT BASICS
import React, { useState, useContext } from "react";

// IMPORT COMPONENTS
import OnboardStep1 from "@sections/Onboard/OnboardStep1";
import OnboardStep1a from "@sections/Onboard/OnboardStep1a";
import OnboardStep2 from "@sections/Onboard/OnboardStep2";
import OnboardStep3 from "@sections/Onboard/OnboardStep3";
import OnboardStep4 from "@sections/Onboard/OnboardStep4";
import OnboardStep5 from "@sections/Onboard/OnboardStep5";
import OnboardStep6 from "@sections/Onboard/OnboardStep6";
import OnboardStep7 from "@sections/Onboard/OnboardStep7";
import { Process } from "@sections/Process/Process";
import { createFamily } from "@lib/directus/api-client";
import axios from "axios";

// IMPORT CUSTOM COMPONENTS
import Page from "@elements/Page/Page";
import Footer from "@sections/Footer/Footer";
import ApplicationContext from "@context/ApplicationContext/ApplicationContext";

// ****************************************
// COMPONENT: Auswaehlens
// Wünsche Auswählen
// ****************************************
const Auswaehlen = () => {
  // STATES
  const [step, setStep] = useState(1);
  const [kids, setKids] = useState([]);
  const [family, setFamily] = useState({});
  const [contact, setContact] = useState({ leginr: "", image: null, imageName: "" });
  const [note, setNote] = useState({ note: "", contactPermission: null, dataRegulation: null, origin: "" });
  const [data, setData] = useState({});
  // CONTEXT
  const { appState } = useContext(ApplicationContext);

  // ******************************************
  // To Step 2
  // ******************************************
  const toAlternateStep = (value) => {
    if (step === 1) {
      setStep(1.5);
    } else {
      setStep(1);
    }
  };

  // ******************************************
  // To Step 2
  // ******************************************
  const toStep2 = (value) => {
    setContact(value);
    setStep(2);
  };

  // ******************************************
  // To Step 5
  // ******************************************
  const toStep5 = (value) => {
    setFamily(value);
    setStep(5);
  };

  // ******************************************
  // To Step 6
  // ******************************************
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

  // ******************************************
  // To Step 7
  // ******************************************
  const toStep7 = async (value) => {
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

    await createFamily(familyPayload, kidsData, contact.image || null);

    const info = { ...family, ...contact, children: kidsText.join(", ") };

    const res = await axios.post("/api/send_email", {
      info,
    });
    // Redirect to checkout

    setStep(7);
  };

  if (appState !== "registration") return null;

  // ******************************************

  // RENDER
  return (
    <>
      <Page title="Weihnachtswunsch anmelden" image="icon1.png">
        <>
          <h2>
            Melde hier die Wünsche für deine Kinder bis zum 14. Geburtstag an. Es werden nur Anmeldungen aus dem Kanton Zürich und Kanton Schaffhausen
            berücksichtigt. Voraussetzung für die Anmeldung ist eine gültige KulturLegi. Pro Kind kann ein Wunsch im Wert von maximal 50 Franken (keine
            Aktionen) angemeldet werden.
          </h2>
          <Process step={step} />
          {step === 1 && <OnboardStep1 contact={contact} onNextStep={toStep2} onAlternateStep={toAlternateStep} />}
          {step === 1.5 && <OnboardStep1a contact={contact} onNextStep={toStep2} onAlternateStep={toAlternateStep} />}
          {step === 2 && <OnboardStep2 kids={kids} onNextStep={() => setStep(3)} onStepBack={() => setStep(1)} onKidChange={setKids} />}
          {step === 3 && <OnboardStep3 kids={kids} family={family} onNextStep={() => setStep(4)} onStepBack={() => setStep(2)} onKidChange={setKids} />}
          {step === 4 && <OnboardStep4 family={family} onNextStep={toStep5} onStepBack={() => setStep(3)} />}
          {step === 5 && <OnboardStep5 note={note} onNextStep={toStep6} onStepBack={() => setStep(4)} />}
          {step === 6 && <OnboardStep6 data={data} onNextStep={toStep7} onStepBack={() => setStep(5)} />}
          {step === 7 && <OnboardStep7 />}
        </>
      </Page>
      <div className="col-span-12 mt-8 p-4">
        {" "}
        <Footer />
      </div>
    </>
  );
};

export default Auswaehlen;
