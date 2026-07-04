// IMPORT BASICS
import React, { useState } from "react";

// IMPORT COMPONENTS
import Grid from "@mui/material/Grid";
import Link from "next/link";
import axios from "axios";
import getStripe from "../../lib/get-stripe.js";
import { createDonor } from "@lib/directus/api-client";

import * as z from "zod";
import { checkoutSchema } from "@validations/register";

import { Field } from "@elements/TextField/TextField";
import { Error } from "@elements/TextField/Error";
import { Button } from "@elements/Button/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// IMPORT CUSTOM COMPONENTS
import Hero from "@sections/Hero/Hero";
import Footer from "@sections/Footer/Footer";

type FormData = z.infer<typeof checkoutSchema>;

const Checkout = (props) => {
  const { cart } = props;

  const [titel, setTitel] = useState("");
  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [adresse, setAdresse] = useState("");
  const [plz, setPlz] = useState("");
  const [wohnort, setWohnort] = useState("");
  const [email, setEmail] = useState("");
  const [show, setShow] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(false);

  const {register, handleSubmit, formState: { errors },} = useForm<FormData>({resolver: zodResolver(checkoutSchema)}); // prettier-ignore

  const redirectToCheckout = async (data: FormData) => {
    if (!disabled) {
      setDisabled(true);
      const quantity = cart.length;

      const payload = { ...data, zipcode: data.zipcode + "", numberOfGifts: quantity, paymentSuccessful: "No" };
      const result = await createDonor(payload);
      const donorId = result.createDonor.id;
      localStorage.setItem("donorId", donorId);
      localStorage.setItem("email", data.email);
      // redirect to success page
      const {
        data: { id },
      } = await axios.post("/api/checkout_sessions", {
        customerEmail: data.email,
        custumerId: "15",
        items: [
          {
            // price: "price_1JmM6FK1nNUflcljYMCrKGgv", // Dev
            price: "price_1JvmaHK1nNUflcljm64BPaFp", // Prod
            // price: "price_1JmNPZK1nNUflcljBkDquB6c", // Test price low price
            quantity: quantity,
            // currency: "CHF",
            // amount: quantity,
            // name: "Weihnachtsgeschenk",
          },
        ],
      });
      // Redirect to checkout
      const stripe = await getStripe();
      await stripe.redirectToCheckout({ sessionId: id });
      window.location.href = "/success";
    }
  };

  const giftText = cart.lenght > 1 ? cart.length + " Geschenke" : cart.length + " Geschenk";

  return (
    <div>
      <Hero />
      <div className="details">
        <Grid container spacing={3} className="details-info">
          <Grid item key={"icon"} xs={12} sm={3}>
            <div className="details-container">
              <img src="icon2.png" className="details-icon" alt="icon" />
            </div>
          </Grid>
          <Grid item key={"content"} xs={12} sm={9}>
            <div className="title-container">
              <h1>Kasse</h1>
              <div className="link-back">
                <Link className="link" href="/" passHref>
                  Zurück
                </Link>
              </div>
            </div>
            <h2>
              Vielen Dank, dass Sie die Weihnachtswunschaktion unterstützen. Mit Ihrer Spende erfüllen wir individuelle Weihnachtswünsche von Kindern. Sie
              können Ihre Spende von Ihren Steuern abziehen. Zu diesem Zweck erhalten Sie anfangs Jahr eine Spendenbescheinigung.
            </h2>

            {cart.length > 0 ? (
              <>
                <div className="current-cart">
                  <h3>
                    Sie haben <b>{giftText}</b> in ihrem Geschenkekorb im Wert von <b>{cart.length * 50} CHF</b>
                  </h3>
                </div>
                <div className="form mt-12">
                  <form onSubmit={handleSubmit(redirectToCheckout)} className="w-full">
                    <div className="m-auto flex w-full max-w-2xl flex-col gap-3">
                      <div className="mb-2 flex gap-3">
                        <div className="flex cursor-pointer gap-2">
                          <input className="cursor-pointer" type="radio" {...register("titel")} value="Frau" id="Frau" />
                          <label className="cursor-pointer" htmlFor={"Frau"}>
                            Frau
                          </label>
                        </div>
                        <div className="flex cursor-pointer gap-2">
                          <input className="cursor-pointer" type="radio" {...register("titel")} value="Herr" id="Herr" />
                          <label className="cursor-pointer" htmlFor={"Herr"}>
                            Herr
                          </label>
                        </div>
                        <div className="flex cursor-pointer gap-2">
                          <input className="cursor-pointer" type="radio" {...register("titel")} value="Andere" id="Andere" />
                          <label className="cursor-pointer" htmlFor={"Andere"}>
                            Andere
                          </label>
                        </div>
                      </div>
                      <Error errors={errors} type="titel" />
                      <Field label="Vorname*" {...register("prename")} />
                      <Error errors={errors} type="prename" />
                      <Field label="Familienname / Nachname*" {...register("surname")} />
                      <Error errors={errors} type="surname" />
                      <Field label="Adresse*" {...register("address")} />
                      <Error errors={errors} type="address" />
                      <div className="flex w-full flex-col justify-between gap-3 lg:flex-row">
                        <div className="w-full">
                          <Field label="PLZ*" {...register("zipcode")} />
                          <Error errors={errors} type="zipcode" className="mt-3" />
                        </div>
                        <div className="w-full">
                          <Field label="Wohnort*" {...register("city")} />
                          <Error errors={errors} type="city" className="mt-3" />
                        </div>
                      </div>
                      <Field label="Email-Adresse*" {...register("email")} />
                      <Error errors={errors} type="email" />
                      <h3 className="mb-2 mt-4">Dürfen wir Ihren Vornamen auf unserer Webseite veröffentlichen? Bsp: Wunsch erfüllt von Erwin</h3>
                      <div className="flex gap-3">
                        <div className="flex cursor-pointer gap-2">
                          <input className="cursor-pointer" type="radio" {...register("public")} value="Yes" id="Ja" />
                          <label className="cursor-pointer" htmlFor={"Ja"}>
                            Ja
                          </label>
                        </div>
                        <div className="flex cursor-pointer gap-2">
                          <input className="cursor-pointer" type="radio" {...register("public")} value="No" id="Nein" />
                          <label className="cursor-pointer" htmlFor={"Nein"}>
                            Nein
                          </label>
                        </div>
                      </div>
                      <Error errors={errors} type="public" />
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
                    </div>

                    <div className="mb-12 flex w-full flex-col justify-center lg:flex-row">
                      <Button disabled={disabled} type="submit" className="mx-0 mt-4 lg:mx-4 lg:mt-8">
                        Wünsche erfüllen
                      </Button>
                    </div>
                  </form>

                  {/* Muss neu gemacht werden wegen MUI */}
                  {/* <FormControl component="fieldset" className="radio-button">
                    <RadioGroup row aria-label="gender" name="row-radio-buttons-group" onChange={(e) => setTitel(e.target.value)}>
                      <FormControlLabel value="Frau" control={<Radio />} label="Frau" />
                      <FormControlLabel value="Herr" control={<Radio />} label="Herr" />
                      <FormControlLabel value="Andere" control={<Radio />} label="Andere" />
                    </RadioGroup>
                  </FormControl>
                  <CssTextField id="outlined-basic" value={vorname} onChange={(e) => setVorname(e.target.value)} label="Vorname*" variant="outlined" />
                  <CssTextField id="outlined-basic" value={nachname} onChange={(e) => setNachname(e.target.value)} label="Nachname*" variant="outlined" />
                  <CssTextField id="outlined-basic" value={adresse} onChange={(e) => setAdresse(e.target.value)} label="Strasse, Nr*" variant="outlined" />
                  <CssTextField id="outlined-basic" value={plz} onChange={(e) => setPlz(e.target.value)} label="PLZ*" variant="outlined" />
                  <CssTextField id="outlined-basic" value={wohnort} onChange={(e) => setWohnort(e.target.value)} label="Wohnort*" variant="outlined" />
                  <CssTextField id="outlined-basic" value={email} onChange={(e) => setEmail(e.target.value)} label="Email-Adresse*" variant="outlined" />
                  <h3>Dürfen wir Ihren Vornamen auf unserer Webseite veröffentlichen? Bsp: Wunsch erfüllt von Erwin</h3>
                  <FormControl component="fieldset" className="radio-button">
                    <RadioGroup row aria-label="gender" name="row-radio-buttons-group" onChange={(e) => setShow(e.target.value)}>
                      <FormControlLabel value="Yes" control={<Radio />} label="Ja" />
                      <FormControlLabel value="No" control={<Radio />} label="Nein" />
                    </RadioGroup>
                  </FormControl> */}
                </div>
                {/* <div className="button-container">
                  <div className="link-container" onClick={redirectToCheckout}>
                    <a className="link">Wünsche erfüllen</a>
                  </div>
                </div> */}
                <h4>
                  Wenn Sie Caritas Zürich im Rahmen der Weihnachtswunschaktion finanziell unterstützen oder einen Newsletter abonnieren, entscheiden Sie sich,
                  uns zu diesen Zwecken mittels der Internet-Adressformulare persönliche Daten zu übergeben.
                  <br />
                  <br />
                  <b>
                    Ihre persönlichen Daten werden von Caritas Zürich vertraulich behandelt und nicht an Dritte weitergegeben. Aufgrund Ihrer Angaben
                    informieren wir Sie schriftlich oder elektronisch über die Aktivitäten von Caritas Zürich.
                  </b>
                  <br />
                  <br />
                  Ihre Zahlungsdaten laufen direkt über einen externen, von der Kreditkartenindustrie zertifizierten Partner. Dieser darf die Informationen
                  ausschliesslich zur Erfüllung der Zahlung nutzen und ist verpflichtet, die schweizerischen Datenschutzbestimmungen einzuhalten. <br />
                  <br />
                  Sie können Ihre Spende von Ihrem steuerbaren Einkommen abziehen. Sie erhalten dazu postalisch eine Spendenbestätigung anfangs Januar.
                </h4>
              </>
            ) : (
              <div className="error-message">
                <h3>Sie haben keine Geschenke im Geschenkekorb</h3>
              </div>
            )}
          </Grid>
        </Grid>
        <Footer />
      </div>
    </div>
  );
};

export default Checkout;
