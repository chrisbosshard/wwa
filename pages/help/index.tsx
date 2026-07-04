// IMPORT BASICS
import React from "react";

// IMPORT CUSTOM COMPONENTS
import Page from "@elements/Page/Page";
import Footer from "@sections/Footer/Footer";
import { Button } from "@elements/Button/Button";

const Help = () => {
  return (
    <>
      <Page title="Kinder unterstützen" image="icon4.png">
        <h2>
          Wir helfen Menschen - hilf mit. Mit deiner Spende oder einem freiwilligen Engagement unterstützt du armutsbetroffene Familien im Kanton Zürich.
          Besuche unsere Secondhand-Läden oder stöbere in unserem{" "}
          <a className="inline-link" href="http://www.caritas-secondhand.ch/" target="_blank" rel="noreferrer">
            Online-Shop
          </a>{" "}
          . Der Erlös fliesst in unsere Projekte und kommt Armutsbetroffenen zugute.
        </h2>
        <div className="mt-12 flex flex-col justify-center gap-4 lg:mb-12 lg:flex-row lg:gap-2">
          <Button externalLink="https://www.caritas-zuerich.ch/ihre-spende-hilft">Spenden</Button>
          <Button externalLink="https://www.caritas-zuerich.ch/aktiv-werden">Aktiv werden</Button>
        </div>
      </Page>
      <div className="col-span-12 mt-8 p-4">
        {" "}
        <Footer />
      </div>
    </>
  );
};

export default Help;
