// IMPORT BASICS
import React from "react";

// CUSTOM COMPONENTS
import { Field } from "@elements/TextField/TextField";
import { Error } from "@elements/TextField/Error";
import { CheckboxField } from "@elements/Checkbox/CheckboxField";
import { Button } from "@elements/Button/Button";
import { onboardFormFields, onboardStepNav } from "@sections/Onboard/OnboardStepPanel";
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
        <div className={onboardFormFields}>
          <Field label="Bemerkung" {...register("note")} />
        </div>
        <div className="mt-6">
          <CheckboxField
            id="contactPermission"
            {...register("contactPermission")}
            label="Caritas Zürich darf mich für Kommunikationszwecke (Fotos, Interviews, Portraits) kontaktieren"
          />
        </div>
        <div className="w-full">
          <CheckboxField
            id="dataRegulation"
            {...register("dataRegulation")}
            className="my-3"
            label={
              <>
                Ich akzeptiere die{" "}
                <a className="underline" href="https://caritas-regio.ch/datenschutzbestimmungen" target="_blank">
                  Datenschutzrichtlinien
                </a>
              </>
            }
          />
          <Error errors={errors} type="dataRegulation" />
        </div>
        <div className="mt-6 flex w-full flex-col">
          <label className="text-[#444444]" htmlFor="dropdownField">
            Wie hast du von der Weihnachtswunschaktion erfahren?
          </label>
          <select className="mt-3 h-14 rounded-md border border-[#d0d0d0] bg-white px-3 text-[#333333]" {...register("origin")} id="dropdownField">
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

export default Auswaehlen;
