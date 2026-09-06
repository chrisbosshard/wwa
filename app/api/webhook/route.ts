import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeSecretKey, getStripeWebhookSecret } from "@/lib/stripe-config";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");
    const secretKey = getStripeSecretKey();
    const webhookSecret = getStripeWebhookSecret();

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }
    if (!secretKey || !webhookSecret) {
      return NextResponse.json({ error: "Stripe webhook is not configured" }, { status: 503 });
    }

    const stripe = new Stripe(secretKey, { apiVersion: "2022-11-15" });
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    console.log("✅ Success:", event.id);

    if (event.type === "checkout.session.completed") {
      console.log("💰  Payment received!");
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook Error";
    console.log(`❌ Error message: ${message}`);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
