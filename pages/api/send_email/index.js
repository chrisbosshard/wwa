// IMPORT PACKAGES
import { NextResponse } from "next/server";
import { Client } from "postmark";

// IMPORT COMPONENTS

export default async function handler(req, res) {
  if (req.method === "POST") {
    const info = req.body.info;
    try {
      const postmarkClient = new Client(process.env.POSTMARK_API_TOKEN);
      const result = await postmarkClient.sendEmailWithTemplate({
        From: "weihnachtswunschaktion@caritas-zuerich.ch",
        To: info.email,
        TemplateAlias: "welcome",
        TemplateModel: {
          product_name: "Weihnachtswunschaktion",
          prename: info.prename,
          surname: info.surname,
          street: info.street,
          nr: info.nr,
          zipcode: info.zipcode,
          city: info.city,
          email: info.email,
          phone: info.phone,
          leginr: info.leginr,
          children: info.children,
          company_name_Value: "Weihnachtswunschaktion",
          company_address_Value: "Lintheschergasse 13, 8001 Zürich",
        },
      });
      const result2 = await postmarkClient.sendEmailWithTemplate({
        From: "weihnachtswunschaktion@caritas-zuerich.ch",
        To: "weihnachtswunschaktion@caritas-zuerich.ch",
        TemplateAlias: "welcome",
        TemplateModel: {
          product_name: "Weihnachtswunschaktion (KOPIE)",
          prename: info.prename,
          surname: info.surname,
          street: info.street,
          nr: info.nr,
          zipcode: info.zipcode,
          city: info.city,
          email: info.email,
          phone: info.phone,
          leginr: info.leginr,
          children: info.children,
          company_name_Value: "Weihnachtswunschaktion",
          company_address_Value: "Lintheschergasse 13, 8001 Zürich",
        },
      });
    } catch (err) {
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Successfully constructed event
    console.log("✅ Success:");

    // Return a response to acknowledge receipt of the event.
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
