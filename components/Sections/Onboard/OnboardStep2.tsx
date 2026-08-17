// IMPORT BASICS
import React from "react";

// IMPORT COMPONENTS
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { step2Schema } from "@validations/register";

// IMPORT COMPONENTS
import { CircleMinus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Error } from "@elements/TextField/Error";
import { Button } from "@elements/Button/Button";
import { onboardStepDescription, onboardStepNav, onboardStepTitle } from "@sections/Onboard/OnboardStepPanel";

const addKidButtonClass =
  "inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-caritas-red bg-white px-4 text-sm font-semibold text-caritas-red transition-colors hover:bg-caritas-red hover:text-white sm:w-auto";

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
  const removeKid = (index) => {
    const newKids = [...kids];
    newKids.splice(index, 1);
    onKidChange(newKids);
  };

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

  return (
    <>
      <h2 className={onboardStepTitle}>Schritt 2 – Alle Kinder hinzufügen</h2>
      <p className={onboardStepDescription}>
        Bitte erfasse hier <b>alle Kinder</b> mit Namen und Alter (nicht älter als 14 Jahre). Im nächsten Schritt kannst du für jedes Kind den passenden Wunsch
        auswählen.
      </p>
      <>
        <div className="mb-8 w-full overflow-hidden rounded-xl border border-[#EBE9E9]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#EBE9E9] bg-[#F6F7F7]">
              <tr>
                <th scope="col" className="px-4 py-3 text-sm font-semibold text-[#242424] sm:px-5">
                  Vorname
                </th>
                <th scope="col" className="px-4 py-3 text-sm font-semibold text-[#242424] sm:px-5">
                  Alter
                </th>
                <th scope="col" className="w-14 px-4 py-3 sm:px-5">
                  <span className="sr-only">Entfernen</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE9E9] bg-white">
              {kids.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-[#575656] sm:px-5 sm:py-10">
                    Noch keine Kinder erfasst. Füge unten ein Kind hinzu.
                  </td>
                </tr>
              ) : (
                kids.map((kid, index) => (
                  <tr key={`${kid.prename}-${kid.age}-${index}`}>
                    <td className="px-4 py-3 text-base font-medium text-[#242424] sm:px-5 sm:py-4">{kid.prename}</td>
                    <td className="px-4 py-3 text-base text-[#575656] sm:px-5 sm:py-4">{kid.age}</td>
                    <td className="px-4 py-3 text-right sm:px-5 sm:py-4">
                      <button
                        type="button"
                        onClick={() => removeKid(index)}
                        className="inline-flex rounded-md p-1 text-[#575656] transition-colors hover:text-caritas-red"
                        aria-label={`${kid.prename} entfernen`}
                      >
                        <CircleMinus className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mb-8 w-full" key="1">
          <form onSubmit={handleSubmit(addKid)} className="w-full">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:gap-x-4 sm:gap-y-2">
              <Label htmlFor="kid-name" className="sm:col-start-1 sm:row-start-1">
                Vorname
              </Label>
              <Input id="kid-name" className="sm:col-start-1 sm:row-start-2" {...register("name")} />
              <div className="min-h-[1.125rem] sm:col-start-1 sm:row-start-3">
                <Error errors={errors} type="name" />
              </div>

              <Label htmlFor="kid-age" className="sm:col-start-2 sm:row-start-1">
                Alter
              </Label>
              <Input id="kid-age" className="sm:col-start-2 sm:row-start-2" {...register("age")} />
              <div className="min-h-[1.125rem] sm:col-start-2 sm:row-start-3">
                <Error errors={errors} type="age" />
              </div>

              <button type="submit" className={`${addKidButtonClass} sm:col-start-3 sm:row-start-2 sm:self-start`}>
                Kind Hinzufügen
              </button>
            </div>
          </form>
        </div>

        <div className={onboardStepNav}>
          <Button type="button" onClick={onStepBack} className="mx-0">
            Zurück
          </Button>
          <Button type="button" onClick={() => setConfirm(true)} disabled={kids.length === 0} className="mx-0">
            Weiter
          </Button>
        </div>

        {confirm && (
          <div className="fixed left-0 top-0 z-[2000] flex h-full w-full items-center justify-center bg-black/20 p-4">
            <div className="w-full max-w-md rounded-2xl border border-[#EBE9E9] bg-white p-8 shadow-sm">
              <h3 className="text-center text-lg font-bold text-[#242424]">Hast du alle Kinder erfasst?</h3>
              <div className="mt-8 flex flex-row items-center justify-center gap-4">
                <Button type="button" onClick={() => setConfirm(false)} className="mx-0">
                  Nein
                </Button>
                <Button type="button" onClick={onNextStep} className="mx-0">
                  Ja
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    </>
  );
};

export default OnboardStep2;
