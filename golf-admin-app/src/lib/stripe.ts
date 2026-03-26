import Stripe from "stripe";

// Initialize Stripe server client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-02-25.clover" as any,
  appInfo: {
    name: "DigitalHeroes Subscriptions",
    version: "1.0",
  },
});
