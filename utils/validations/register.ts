import * as z from "zod";

export const checkoutSchema = z.object({
  titel: z.union([z.string(), z.null()]).refine((val) => val != null, { message: "Anrede fehlt" }),
  prename: z.string().min(1, { message: "Vorname fehlt" }),
  surname: z.string().min(1, { message: "Nachname fehlt" }),
  address: z.string().min(1, { message: "Adresse fehlt" }),
  zipcode: z.preprocess(
    (a) => parseInt(a as string),
    z.number({ invalid_type_error: "Ungültige Postleitzahl" }).min(1000, { message: "Ungültige Postleitzahl" }).max(9999, { message: "Ungültige Postleitzahl" })
  ),
  city: z.string().min(1, { message: "Stadt fehlt" }),
  email: z.string().email({ message: "E-Mail-Format ist inkorrekt" }),
  public: z.union([z.string(), z.null()]).refine((val) => val != null, { message: "Angabe fehlt" }),
  dataRegulation: z.boolean().refine((value) => value === true, {
    message: "Zustimmung muss gegeben werden um weiterzufahren",
  }),
});

export const step1Schema = z.object({
  leginr: z.string().min(1, { message: "Legi Nr. muss ausgefüllt werden" }),
  expiresAt: z
    .string()
    .min(1, { message: "Datum muss ausgefüllt werden" })
    .regex(/^\d{2}\.\d{2}\.\d{4}$/, { message: 'Datum muss im Format "TT.MM.JJJJ" eingegeben werden' })
    .refine(
      (date) => {
        const [day, month, year] = date.split(".");
        const europeanDate = `${year}-${month}-${day}`;
        const expirationDate = new Date(europeanDate);
        return !isNaN(expirationDate.getTime());
      },
      { message: "Datum ist ungültig" }
    ),
});

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const step1aSchema = z.object({
  image: z.any().refine((file) => file?.length > 0, `Bild muss hochgeladen werden`),
  email: z.string().email({ message: "Email-Format ist inkorrekt" }),
});

export const step2Schema = z.object({
  name: z.string().min(1, { message: "Name fehlt" }),
  age: z.preprocess(
    (a) => parseInt(a as string),
    z.number({ invalid_type_error: "Alter fehlt" }).min(0, { message: "Alter fehlt" }).max(14, { message: "Alter muss kleiner als 14 sein" })
  ),
});

export const step3Schema = z.object({
  description: z.string().min(1, { message: "Beschreibung fehlt" }),
  link: z.string(),
});

export const step4Schema = z.object({
  prename: z.string().min(1, { message: "Vorname fehlt" }),
  surname: z.string().min(1, { message: "Nachname fehlt" }),
  street: z.string().min(1, { message: "Strasse fehlt" }),
  nr: z.string().min(1, { message: "Nummer fehlt" }),
  zipcode: z.preprocess(
    (a) => parseInt(a as string),
    z.number({ invalid_type_error: "Ungültige Postleitzahl" }).min(1000, { message: "Ungültige Postleitzahl" }).max(9999, { message: "Ungültige Postleitzahl" })
  ),
  city: z.string().min(1, { message: "Stadt fehlt" }),
  phone: z.string().min(1, { message: "Telefonnummer fehlt" }),
  email: z.string().min(1, { message: "Email fehlt" }).email({ message: "Email-Format ist inkorrekt" }),
});

export const step5Schema = z.object({
  note: z.string(),
  contactPermission: z.boolean(),
  dataRegulation: z.boolean().refine((value) => value === true, {
    message: "Zustimmung muss gegeben werden um weiterzufahren",
  }),
  origin: z.string(),
});

export const userAuthSchemaCredential = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(4).max(12),
});

export const userAuthSchemaReset = z.object({
  email: z.string().email(),
});

export const userAuthSchemaChangePassword = z
  .object({
    password: z.string().min(4).max(12),
    password_repeat: z.string().min(4).max(12),
  })
  .superRefine(({ password_repeat, password }, ctx) => {
    if (password_repeat !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });
