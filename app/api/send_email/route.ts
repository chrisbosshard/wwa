import { NextResponse } from "next/server";
import { Client } from "postmark";

export async function POST(request: Request) {
  const body = await request.json();
  const info = body.info;

  try {
    const postmarkClient = new Client(process.env.POSTMARK_API_TOKEN!);
    await postmarkClient.sendEmailWithTemplate({
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
    await postmarkClient.sendEmailWithTemplate({
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
    console.log("✅ Success:");
    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email failed";
    console.log(`❌ Error message: ${message}`);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }
}
