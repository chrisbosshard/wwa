// IMPORT PACKAGES
import { NextResponse } from "next/server";
import { Client } from "postmark";

// IMPORT COMPONENTS

export default async function handler(req, res) {
  if (req.method === "POST") {
    const email = req.body.email;
    const number = req.body.number;
    try {
      const postmarkClient = new Client(process.env.POSTMARK_API_TOKEN);
      const result = await postmarkClient.sendEmailWithTemplate({
        From: "weihnachtswunschaktion@caritas-zuerich.ch",
        To: email,
        TemplateAlias: "welcome-1",
        TemplateModel: {
          product_name: "Weihnachtswunschaktion",
          number: number,
          value: number * 50 + " CHF",
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
