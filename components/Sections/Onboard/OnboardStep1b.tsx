// IMPORT BASICS
import React, { useEffect, useState } from "react";

// IMPORT COMPONENTS
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { step1aSchema } from "@validations/register";
import { Loader2 } from "lucide-react";
import { Button as UiButton } from "@/components/ui/button";

// CUSTOM COMPONENTS
import { FormField } from "@elements/TextField/FormField";
import { Field } from "@elements/TextField/TextField";
import { Error } from "@elements/TextField/Error";
import { Button } from "@elements/Button/Button";
import { inlineLink } from "@/lib/ui-classes";
import { onboardFormActions, onboardFormFields } from "@sections/Onboard/OnboardStepPanel";

// UTILS
import { checkLeginr } from "@scripts/checkEntry.js";
import { uploadFile } from "@lib/directus/api-client";

type FormData = z.infer<typeof step1aSchema>;

// ****************************************
// COMPONENT: Auswaehlen
// Wünsche Auswählen
// ****************************************
const OnBoardStep1 = (props) => {
  // PROPS
  const { onNextStep, onAlternateStep, contact } = props;

  // PROPS
  const [imageId, setImageId] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // FORM
  const {register, setValue, handleSubmit, formState: { errors },} = useForm<FormData>({defaultValues:contact, resolver: zodResolver(step1aSchema)}); // prettier-ignore

  // FUNCTION
  const checkEntries = async (data: FormData) => {
    const value = {
      image: imageId,
      imageName: imageUrl,
      email: data.email,
    };
    const checkLeginrStatus = checkLeginr(data.image);
    onNextStep(value);
  };

  const handleFileUpload = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    try {
      const data = await uploadFile(file);
      setImageId(data.id);
      setImageUrl(data.filename);
      setValue("image", data.filename);
    } catch (error) {
      console.error("Upload failed", error);
    }
    setLoading(false);
  };

  let label = imageUrl ? imageUrl : "Bild der KulturLegi*";

  // RETURN
  return (
    <>
      <h2 className="font-bold">Schritt 1 - KulturLegi der Eltern überprüfen</h2>
      <h3>Deine KulturLegi-Angaben sind ungültig</h3>
      <p>Deine KulturLegi-Karte ist inaktiv und die Prüfung deiner KulturLegi-Angaben fehlgeschlagen. Ein Wunschanmeldung ist daher nicht möglich.</p>
      <form onSubmit={handleSubmit(checkEntries)} className="w-full">
        <div className={onboardFormFields}>
          <div className="w-full">
            <div className="relative flex items-center justify-end">
              <Field disabled={true} label={label} {...register("image")} />
              <UiButton asChild className="absolute mr-4">
                <label className="cursor-pointer">
                  {!loading ? (
                    <>
                      Bild hochladen
                      <input type="file" hidden onChange={handleFileUpload} />
                    </>
                  ) : (
                    <>
                      Ladet
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </>
                  )}
                </label>
              </UiButton>
            </div>
            <Error errors={errors} type="image" />
          </div>
          <FormField label="Email*" name="email" errors={errors} {...register("email")} />
        </div>
        <div className={onboardFormActions}>
          <Button type="submit">Prüfen</Button>
          <a className={`${inlineLink} cursor-pointer`} onClick={onAlternateStep}>
            Ich habe eine KulturLegi mit Nummer
          </a>
          <a className={inlineLink} href="https://www.kulturlegi.ch/zuerich/kulturlegi-beantragen/wer-ist-berechtigt">
            Ich habe noch gar keine KulturLegi
          </a>
        </div>
      </form>
    </>
  );
};

export default OnBoardStep1;
