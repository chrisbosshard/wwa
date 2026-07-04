import React from "react";
import Page from "@elements/Page/Page";
import Footer from "@sections/Footer/Footer";

export default function ContactPage() {
  return (
    <>
      <Page title="Kontakt" image="icon7.png">
        <div className="grid w-full grid-cols-12 gap-6">
          <div className="col-span-12 sm:col-span-4">
            <h3 className="my-0">
              <b>Projektkoordination</b>
              <br />
              Samuel Neurohr
              <br />
              KulturLegi Kanton Zürich
              <br />
              Reitergasse 1
              <br />
              8004 Zürich
              <br />
              044 366 68 48
              <br />
              <a className="link-email" href="mailto:s.neurohr@caritas-zuerich.ch">
                s.neurohr@caritas-zuerich.ch
              </a>
            </h3>
          </div>
          <div className="col-span-12 sm:col-span-4">
            <h3 className="my-0">
              <b>Partnerschaften</b>
              <br />
              Nadia Ventre
              <br />
              Fundraising Caritas Zürich
              <br />
              Beckenhofstrasse 16
              <br />
              8006 Zürich
              <br />
              044 366 68 65
              <br />
              <a className="link-email" href="mailto:n.ventre@caritas-zuerich.ch">
                n.ventre@caritas-zuerich.ch
              </a>
            </h3>
          </div>
          <div className="col-span-12 sm:col-span-4">
            <h3 className="my-0">
              <b>Kommunikation</b>
              <br />
              Andreas Reinhart
              <br />
              Mediensprecher
              <br />
              Beckenhofstrasse 16
              <br />
              8006 Zürich
              <br />
              044 366 68 62
              <br />
              <a className="link-email" href="mailto:a.reinhart@caritas-zuerich.ch">
                a.reinhart@caritas-zuerich.ch
              </a>
            </h3>
          </div>
        </div>
      </Page>
      <div className="col-span-12 mt-8 px-4 pt-4">
        {" "}
        <Footer />
      </div>
    </>
  );
}
