import React from "react";
import Page from "@elements/Page/Page";
import Footer from "@sections/Footer/Footer";
import { Button } from "@elements/Button/Button";

export default function TeamPage() {
  return (
    <>
      <Page title="Als Team Wünsche erfüllen" image="icon3.png">
        <h2>
          Mit eurer Hilfe setzen wir gemeinsam ein kleines Zeichen der Solidarität mit benachteiligten Familien und machen Weihnachten zu einem schönen Fest für
          alle Kinder. Als Team stehen euch verschiedene Möglichkeiten offen, die Weihnachtswunschaktion zu unterstützen. Für individuelle Ideen nehmen wir
          gerne mit euch Kontakt auf.
        </h2>
        <div className="grid grid-cols-2 lg:gap-6">
          <div className="col-span-2 sm:col-span-1">
            <h3>
              <b>Partnermodell «Geldspende»: Wünsche finanzieren – wir organisieren</b>
              <br /> Ihr sammelt unter den Mitarbeitenden und finanziert eine bestimmte Anzahl Wünsche. Wenn möglich verdoppelt eure Firma den Betrag / die
              Anzahl Wünsche. Caritas Zürich erfüllt die Wünsche und kauft die Geschenke in eurem Namen ein.
            </h3>
            <h3>
              <b>Partnermodell «Sachspende»: Wünsche erfüllen – Teamgeist stärken</b>
              <br /> Ihr bestimmt die Anzahl Wünsche, die Ihr als Team oder als Firma organisieren werdet, und wir stellen euch die Wunschliste im Vorfeld zur
              Verfügung.
              <br />
              <br />
              Ideen zur Umsetzung: Weihnachtsbaum mit Wunschzettel bestücken – Wünsche werden durch Mitarbeitende erfüllt und die fertigen Geschenke unter dem
              Weihnachtsbaum deponiert, Übergabe der Geschenke an Caritas Zürich, welche diese an die Familien verteilt.
            </h3>
            <h3>
              <b>Unkostenbeitrag von 5 Franken pro Geschenk, damit Wünsche wahr werden</b>
              <br />
              Die Weihnachtswunschaktion ist mit einem organisatorischen und administrativen Aufwand verbunden, den wir so gering wie möglich halten. Der
              Unkostenbeitrag von <b>5 Franken pro Geschenk</b> fliesst direkt in die KulturLegi und gilt für das <b>Partnermodell «Sachspende»</b>. Es handelt
              sich um eine zweckgebundene Unterstützung.
            </h3>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h3>
              Mit diesem Beitrag tragen die Firmen aktiv dazu bei, die Weihnachtswunschaktion möglich zu machen und sicherzustellen, dass wir gemeinsam da
              helfen, wo Hilfe zur Weihnachtszeit am dringendsten benötigt wird
            </h3>
            <h3>
              <b>Engagement sichtbar machen</b>
              <br />
              Macht euer Engagement sichtbar – Partner können den Namen Caritas Zürich in Kombination mit der Weihnachtswunschaktion für die eigene
              Kommunikation verwenden. Wir machen euer Engagement sichtbar. Alle Partner-Logos platzieren wir auf der Website der Weihnachtswunschaktion,
              erwähnen euch in den Sozialen Medien und am Tag der Geschenkübergabe.
            </h3>
            <h3>
              <b>Kontakt Partnerschaften</b>
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
        </div>
        <div className="mt-12 flex flex-col justify-center gap-4 lg:mb-12 lg:flex-row lg:gap-2">
          <Button externalLink="https://caritas-regio.ch/ueber-caritas/zuerich/weihnachtswunschaktion">Anmelden</Button>
        </div>
      </Page>
      <div className="col-span-12 mt-8 px-4 pt-4">
        {" "}
        <Footer />
      </div>
    </>
  );
}
