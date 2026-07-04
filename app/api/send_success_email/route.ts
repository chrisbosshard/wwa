import { NextResponse } from "next/server";
import { Client } from "postmark";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, number } = body;

  try {
    const postmarkClient = new Client(process.env.POSTMARK_API_TOKEN!);
    await postmarkClient.sendEmailWithTemplate({
      From: "weihnachtswunschaktion@caritas-zuerich.ch",
      To: email,
      TemplateAlias: "welcome-1",
      TemplateModel: {
        product_name: "Weihnachtswunschaktion",
        number,
        value: `${number * 50} CHF`,
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
