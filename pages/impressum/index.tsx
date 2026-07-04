// IMPORT BASICS
import React from "react";

// IMPORT CUSTOM COMPONENTS
import Page from "@elements/Page/Page";
import Footer from "@sections/Footer/Footer";

const Impressum = () => {
  return (
    <>
      <Page title="Impressum" image="icon7.png">
        <div className="grid w-full grid-cols-12 gap-6">
          <div className="col-span-12 sm:col-span-4">
            <h3>
              <b>Ein Engagement von:</b>
              <br />
              Caritas Zürich
              <br />
              Beckenhofstrasse 16
              <br />
              8006 Zürich
              <br />
              <a href="https://www.caritas-zuerich.ch/" target="_blank" rel="noreferrer">
                caritas-zuerich.ch
              </a>
            </h3>
          </div>
          <div className="col-span-12 sm:col-span-4">
            <h3>
              <b>Weblösung:</b>
              <br />
              Lions Club
              <br />
              Zürich-Rietberg
              <br />
              <a href="https://zuerich-rietberg.lionsclub.ch/" target="_blank" rel="noreferrer">
                zuerich-rietberg.lionsclub.ch
              </a>
            </h3>
          </div>
          <div className="col-span-12 sm:col-span-4">
            <h3>
              <b>Grafik / Illustration:</b>
              <br />
              Stünzi Visualisierung GmbH
              <br />
              Michael Stünzi
              <br />
              Zürich, Schweiz
              <br />
              <a href="https://infografik.ch/" target="_blank" rel="noreferrer">
                infografik.ch
              </a>
            </h3>
          </div>
        </div>
      </Page>
      <div className="col-span-12 mt-8 p-4">
        {" "}
        <Footer />
      </div>
    </>
  );
};

export default Impressum;
