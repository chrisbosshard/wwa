import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripePriceId, getStripeSecretKey, usesStripeTestMode } from "@/lib/stripe-config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customerEmail = body?.customerEmail ?? "";
    const quantity = Number(body?.quantity);
    const secretKey = getStripeSecretKey();
    const priceId = getStripePriceId();

    if (!secretKey || !priceId) {
      const mode = usesStripeTestMode() ? "Testmodus" : "Live-Modus";
      return NextResponse.json(
        { message: `Stripe ist im ${mode} nicht vollständig konfiguriert.` },
        { status: 503 },
      );
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      return NextResponse.json(
        { message: "Ungültige Anzahl Geschenke." },
        { status: 400 },
      );
    }

    const stripe = new Stripe(secretKey, { apiVersion: "2022-11-15" });
    const origin = new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout session failed";
    console.error("POST /api/checkout_sessions", message);
    return NextResponse.json({ statusCode: 500, message }, { status: 500 });
  }
}
