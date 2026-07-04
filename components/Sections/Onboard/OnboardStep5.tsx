// IMPORT BASICS
import React from "react";

// CUSTOM COMPONENTS
import { Field } from "@elements/TextField/TextField";
import { Error } from "@elements/TextField/Error";
import { Button } from "@elements/Button/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { step5Schema } from "@validations/register";

type FormData = z.infer<typeof step5Schema>;

// ****************************************
// COMPONENT: Auswaehlen
// Wünsche Auswählen
// ****************************************
const Auswaehlen = (props) => {
  // PROPS
  const { family, onNextStep, onStepBack, note } = props;

  // FORM
  const {register, handleSubmit, formState: { errors },} = useForm<FormData>({defaultValues:note, resolver: zodResolver(step5Schema)}); // prettier-ignore

  // FUNCTION
  const checkEntries = async (data: FormData) => {
    const value = {
      note: data.note,
      contactPermission: data.contactPermission,
      dataRegulation: data.dataRegulation,
      origin: data.origin,
    };
    onNextStep(value);
  };

  return (
    <>
      <h2 className="font-bold">Schritt 5 - Bemerkungen</h2>
      <h3>Hast du noch eine Bemerkung zu deiner Anmeldung? Dann fülle diese nachfolgend aus.</h3>
      <form onSubmit={handleSubmit(checkEntries)} className="w-full">
        <div className="m-auto flex w-full max-w-2xl flex-col gap-3">
          <Field label="Bemerkung" {...register("note")} />
          <Error errors={errors} type="surname" />
        </div>
        <div className="m-auto mt-6 flex w-full max-w-2xl flex-row gap-3 text-gold-300">
          <input type="checkbox" {...register("contactPermission")} id="contactPermission" className="min-w-[20px]" />
          <label htmlFor="contactPermission" className="ml-2">
            Caritas Zürich darf mich für Kommunikationszwecke (Fotos, Interviews, Portraits) kontaktieren
          </label>
        </div>
        <div className="m-auto w-full max-w-2xl">
          <div className="m-auto my-3 flex w-full flex-row gap-3 text-gold-300">
            <input type="checkbox" {...register("dataRegulation")} id="dataRegulation" className="min-w-[20px]" />
            <label htmlFor="dataRegulation" className="ml-2">
              Ich akzeptiere die{" "}
              <a className="underline" href="https://caritas-regio.ch/datenschutzbestimmungen" target="_blank">
                Datenschutzrichtlinien
              </a>
            </label>
          </div>
          <Error errors={errors} type="dataRegulation" />
        </div>
        <div className="m-auto mt-6 flex w-full max-w-2xl flex-col">
          <label className="text-gold-300" htmlFor="dropdownField">
            Wie hast du von der Weihnachtswunschaktion erfahren?
          </label>
          <select className="mt-3 h-14 rounded border border-gold-300 bg-transparent px-3 text-gold-300" {...register("origin")} id="dropdownField">
            <option className="text-black" value="">
              Bitte wählen...
            </option>
            <option className="text-black" value="kultutlegi">
              KulturLegi
            </option>
            <option className="text-black" value="beratungCaritasZuerich">
              Beratung Caritas Zürich
            </option>
            <option className="text-black" value="stellwerk500">
              Stellwerk 500
            </option>
            <option className="text-black" value="mitMir">
              Mit Mir
            </option>
            <option className="text-black" value="copilot">
              Copilot
            </option>
            <option className="text-black" value="winterhilfeZuerich">
              Winterhilfe Zürich
            </option>
            <option className="text-black" value="andere">
              Andere
            </option>
          </select>
        </div>

        <div className="flex w-full flex-col justify-center lg:flex-row">
          <Button type="button" onClick={onStepBack} className="mx-0 mt-12 lg:mx-4">
            Zurück
          </Button>
          <Button type="submit" className="mx-0 mt-4 lg:mx-4 lg:mt-12">
            Weiter
          </Button>
        </div>
      </form>
    </>
  );
};

export default Auswaehlen;
