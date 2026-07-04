import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id.startsWith("cs_")) {
      throw new Error("Incorrect CheckoutSession ID.");
    }

    const checkout_session = await stripe.checkout.sessions.retrieve(id);
    return NextResponse.json(checkout_session);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to retrieve session";
    return NextResponse.json({ statusCode: 500, message }, { status: 500 });
  }
}
