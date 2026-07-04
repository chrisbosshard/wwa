// IMPORT BASICS
import React, { useState } from "react";

// IMPORT COMPONENTS
import Grid from "@mui/material/Grid";
import Link from "next/link";

// IMPORT CUSTOM COMPONENTS
import Hero from "@sections/Hero/Hero";
import Footer from "@sections/Footer/Footer";
import Polaroid from "@elements/Polaroid/Polaroid";

// IMPORT UTIL
import useWindowSize from "../../utils/useWindowSize";

const Gifts = ({ kids, cart, onAddToCart, onRemoveFromCart }) => {
  const [showNum, setShowNum] = useState(50);

  // FUNCTIONS
  const showMore = () => {
    if (kids.length > showNum + 50) {
      const newShowNum = showNum + 50;
      setShowNum(newShowNum);
    } else if (kids.length > showNum) {
      setShowNum(kids.length);
    }
  };

  const handleAdd = () => {
    setCurrentGift(false);
    onAddToCart(currentGift);
  };

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + "." + mm + "." + yyyy;

  // Show how many gifts have already been granted
  let completedGifts = 0;
  kids.forEach((kid) => {
    if (kid.donor && (kid.donor.manualUpload || kid.donor.paymentSuccessful)) {
      completedGifts += 1;
    }
  });

  const baseCompletedGifts = 2000; // need to be updated
  const allCompletedGifts = 2500;
  const allBaseGifts = 2000;
  let completedPercentage = 1;

  const size = useWindowSize();
  const maxsize = size.width - 32 < 490 ? size.width - 32 : 490;

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
              <h1>Herzlichen Dank - Es wurden alle Wünsche erfüllt!</h1>
              <div className="link-back">
                <Link className="link" href="/" passHref>
                  Zurück
                </Link>
              </div>
            </div>
            <h2>
              Wir sind überwältigt. Gemeinsam mit Privatpersonen und{" "}
              <Link className="link" href="/partner" passHref>
                <a style={{ textDecoration: "underline" }}>Partner</a>
              </Link>{" "}
              erfüllen wir 2500 Weihnachtswünsche von Kindern aus finanziell benachteiligten Familien. Für das grosse Engagement bedanken wir uns herzlich.
            </h2>
            <h3>
              Wir verwandeln die Wünsche nun in schöne Weihnachtsgeschenke und überreichen diese am 18. Dezember 2021 den Familien. In Kürze findest du hier
              sowie auf unseren Social-Media-Kanälen Impressionen vom Einpacken sowie der Geschenkübergabe. Mit dem Newsletter informieren wir dich gerne weiter
              über das Engagement von Caritas Zürich. Möchtest du finanziell benachteiligte Kinder und Familien auch langfristig mit einer Spende oder einem
              freiwilligen Engagement unterstützen?
            </h3>
            <div className="button-container" style={{ paddingBottom: "0rem" }}>
              <div className="link-container">
                <a className="link" href="https://www.caritas-zuerich.ch/newsletter?nlconf=1" target="_blank" rel="noreferrer">
                  Newsletter anmelden
                </a>
              </div>
              <div className="link-container">
                <a className="link" href="https://www.caritas-zuerich.ch/aktiv-werden" target="_blank" rel="noreferrer">
                  Aktiv werden
                </a>
              </div>
              <div className="link-container">
                <a className="link" href="https://www.caritas-zuerich.ch/spenden/ihre-spende-hilft" target="_blank" rel="noreferrer">
                  Spenden
                </a>
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item key={1} xs={12} sm={6} md={4} lg={4}>
            <img src="./picture1.png" alt="picture" className="done-picture" />
          </Grid>
          <Grid item key={1} xs={12} sm={6} md={4} lg={4}>
            <img src="./picture2.jpg" alt="picture" className="done-picture" />
          </Grid>
          <Grid item key={1} xs={12} sm={6} md={4} lg={4}>
            <img src="./picture3.jpg" alt="picture" className="done-picture" />
          </Grid>
          <Grid item key={1} xs={12} sm={6} md={4} lg={4}>
            <img src="./picture4.jpeg" alt="picture" className="done-picture" />
          </Grid>
          <Grid item key={1} xs={12} sm={6} md={4} lg={4}>
            <img src="./picture5.jpeg" alt="picture" className="done-picture" />
          </Grid>
          <Grid item key={1} xs={12} sm={6} md={4} lg={4}>
            <img src="./picture6.jpg" alt="picture" className="done-picture" />
          </Grid>
          <Grid item key={1} xs={12} sm={6} md={4} lg={4}>
            <img src="./picture7.jpeg" alt="picture" className="done-picture" />
          </Grid>
          <Grid item key={1} xs={12} sm={6} md={4} lg={4}>
            <img src="./picture8.jpeg" alt="picture" className="done-picture" />
          </Grid>
          <Grid item key={1} xs={12} sm={6} md={4} lg={4}>
            <img src="./picture9.jpeg" alt="picture" className="done-picture" />
          </Grid>
        </Grid>
        <div className="progress">
          <p className="progress-title">Wünsche erfüllt:</p>
          <p className="progress-date">{today}</p>
          <div className="progress-outer">
            <div className="progress-inner progress-done">
              <p>{allCompletedGifts}</p>
            </div>
          </div>
        </div>
        <div className="gift-container">
          <Grid container spacing={3}>
            {kids.slice(0, showNum).map((kid, index) => {
              return (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                  <Polaroid key={index} kid={kid} kids={kids} cart={cart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} />
                </Grid>
              );
            })}
          </Grid>
          {showNum < kids.length ? (
            <div className="button-container">
              <div className="link-container">
                <a className="link" onClick={() => showMore()}>
                  Weitere Wünsche anzeigen
                </a>
              </div>
            </div>
          ) : null}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Gifts;
