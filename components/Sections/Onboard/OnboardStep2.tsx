// IMPORT BASICS
import React from "react";

// IMPORT COMPONENTS
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { step2Schema } from "@validations/register";

// IMPORT COMPONENTS
import { CircleMinus } from "lucide-react";
import { Field } from "@elements/TextField/TextField";
import { Error } from "@elements/TextField/Error";
import { Button } from "@elements/Button/Button";

type FormData = z.infer<typeof step2Schema>;

// ****************************************
// COMPONENT: Auswaehlen
// Wünsche Auswählen
// ****************************************
const OnboardStep2 = (props) => {
  // PROPS
  const { kids, onNextStep, onStepBack, onKidChange } = props;

  // STATE
  const [confirm, setConfirm] = React.useState(false);

  // FORM
  const {register, reset, handleSubmit, formState: { errors },} = useForm<FormData>({resolver: zodResolver(step2Schema)}); // prettier-ignore

  // FUNCTIONS
  // ******************************************
  // Remove Kid
  // ******************************************
  const removeKid = (index) => {
    const newKids = [...kids];
    newKids.splice(index, 1);
    onKidChange(newKids);
  };

  // ******************************************
  // Add Kid
  // ******************************************
  const addKid = async (data: FormData) => {
    const { name, age } = data;
    const kid = {
      prename: name,
      age: age,
    };
    const newKids = [...kids, kid];
    reset();
    onKidChange(newKids);
  };

  // ******************************************
  // Add Kid
  // ******************************************
  const confirmKids = async (data: FormData) => {
    const { name, age } = data;
    const kid = {
      prename: name,
      age: age,
    };
    const newKids = [...kids, kid];
    reset();
    onKidChange(newKids);
  };

  return (
    <>
      <h2 className="font-bold">Schritt 2 – Alle Kinder hinzufügen</h2>
      <h3>
        Bitte erfasse hier <b>alle Kinder</b> mit Namen und Alter (nicht älter als 14 Jahre). Im nächsten Schritt kannst du für jedes Kind den passenden Wunsch
        auswählen.
      </h3>
      <>
        <div className="mb-8 flex w-full gap-4" key="1">
          <form onSubmit={handleSubmit(addKid)} className="flex w-full flex-col gap-6 lg:flex-row lg:gap-0">
            <div className="flex w-full flex-1">
              <div className="mr-4 flex-1">
                <Field label="Vorname" {...register("name")} />
                <Error errors={errors} type="name" />
              </div>
              <div className="mr-0 flex-1 lg:mr-4">
                <Field label="Alter" {...register("age")} />
                <Error errors={errors} type="age" />
              </div>
            </div>
            <div>
              <button className="m-0 flex w-full cursor-pointer items-center justify-center rounded-lg bg-gold-300 p-4 font-bold text-darkblue-300 lg:w-auto">
                Kind Hinzufügen
              </button>
            </div>
          </form>
        </div>
        {kids.length > 0 && (
          <div className="mb-8 w-full">
            {kids.map((kid, index) => {
              return (
                <div key={kid.id} className="mb-1 flex w-full items-center justify-between rounded-xl bg-[#213e5b] p-4">
                  <div>
                    <div className="kid-text">
                      <p className="kid-title">{kid.prename + " (" + kid.age + ")"}</p>
                    </div>
                  </div>
                  <div className="kid-icons">
                    <CircleMinus className="h-8 w-8 cursor-pointer text-gold-300 hover:text-white" onClick={() => removeKid(index)} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex w-full flex-col justify-center lg:flex-row">
          <Button onClick={onStepBack} className="mx-0 mt-12 lg:mx-4">
            Zurück
          </Button>
          {kids.length > 0 && (
            <Button onClick={() => setConfirm(true)} className="mx-0 mt-4 lg:mx-4 lg:mt-12">
              Weiter
            </Button>
          )}
        </div>
        {confirm && (
          <div className="fixed left-0 top-0 z-[2000] flex h-full w-full items-center justify-center bg-white bg-opacity-30 p-4">
            <div className="m-12 w-full justify-center rounded-xl bg-darkblue-300 p-8 lg:h-48 lg:w-96">
              <h3 className="text-center font-bold">Hast du alle Kinder erfasst?</h3>
              <div className="mb-4 mt-8 flex justify-center lg:mb-8">
                <Button onClick={() => setConfirm(false)}>Nein</Button>
                <Button onClick={onNextStep}>Ja</Button>
              </div>
            </div>
          </div>
        )}
      </>
    </>
  );
};

export default OnboardStep2;
