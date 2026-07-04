// IMPORT BASICS
import React, { useEffect, useState } from "react";

// IMPORT COMPONENTS
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { step1aSchema } from "@validations/register";
import CircularProgress from "@mui/material/CircularProgress";
import { Button as MuiButton } from "@mui/material";

// CUSTOM COMPONENTS
import { Field } from "@elements/TextField/TextField";
import { Error } from "@elements/TextField/Error";
import { Button } from "@elements/Button/Button";

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
        <div className="m-auto flex w-full max-w-2xl flex-col gap-3">
          <div className="relative flex items-center justify-end">
            <Field disabled="true" label={label} {...register("image")} className="text-gold-300" />
            <MuiButton variant="contained" component="label" className="absolute mr-4">
              {!loading ? (
                <>
                  Bild hochladen
                  <input type="file" hidden onChange={handleFileUpload} />
                </>
              ) : (
                <>
                  Ladet
                  <CircularProgress size="1rem" className="ml-2 text-gold-300" />
                </>
              )}
            </MuiButton>
          </div>
          <Error errors={errors} type="image" />
          <Field label="Email*" {...register("email")} />
          <Error errors={errors} type="email" />
        </div>
        <div className="flex w-full justify-center">
          <Button className="mt-8">Prüfen</Button>
        </div>
        <div className="mt-4 flex flex-col items-center">
          <a className="inline-link mt-2 cursor-pointer" onClick={onAlternateStep}>
            Ich habe eine KulturLegi mit Nummer
          </a>
          <a className="inline-link mt-2" href="https://www.kulturlegi.ch/zuerich/kulturlegi-beantragen/wer-ist-berechtigt">
            Ich habe noch gar keine KulturLegi
          </a>
        </div>
      </form>
    </>
  );
};

export default OnBoardStep1;
