import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeSecretKey } from "@/lib/stripe-config";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const secretKey = getStripeSecretKey();

    if (!id.startsWith("cs_")) {
      throw new Error("Incorrect CheckoutSession ID.");
    }
    if (!secretKey) {
      return NextResponse.json(
        { message: "Stripe ist nicht konfiguriert." },
        { status: 503 },
      );
    }

    const stripe = new Stripe(secretKey, { apiVersion: "2022-11-15" });
    const checkout_session = await stripe.checkout.sessions.retrieve(id);
    return NextResponse.json(checkout_session);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to retrieve session";
    return NextResponse.json({ statusCode: 500, message }, { status: 500 });
  }
}
