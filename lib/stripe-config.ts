const DEFAULT_LIVE_PRICE_ID = "price_1JvmaHK1nNUflcljm64BPaFp";
const DEFAULT_TEST_PRICE_ID = "price_1JmM6FK1nNUflcljYMCrKGgv";

export function usesStripeTestMode() {
  if (process.env.STRIPE_MODE === "test") return true;
  if (process.env.STRIPE_MODE === "live") return false;
  return process.env.NODE_ENV !== "production";
}

export function getStripeSecretKey() {
  return usesStripeTestMode()
    ? process.env.STRIPE_SECRET_KEY_DEV
    : process.env.STRIPE_SECRET_KEY;
}

export function getStripePriceId() {
  if (usesStripeTestMode()) {
    return process.env.STRIPE_PRICE_ID_DEV || DEFAULT_TEST_PRICE_ID;
  }

  const configuredPriceId = process.env.STRIPE_PRICE_ID || process.env.PRODUCT_ID;
  return configuredPriceId?.startsWith("price_")
    ? configuredPriceId
    : DEFAULT_LIVE_PRICE_ID;
}

export function getStripeWebhookSecret() {
  return usesStripeTestMode()
    ? process.env.STRIPE_WEBHOOK_SECRET_DEV
    : process.env.STRIPE_WEBHOOK_SECRET;
}
