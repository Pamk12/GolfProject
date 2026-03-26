'use server';

import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function createCheckoutSession(interval: 'month' | 'year') {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'golf-project-three.vercel.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const origin = `${protocol}://${host}`;

    const amount = interval === 'month' ? 1000 : 10000; // $10 or $100

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Digital Heroes ${interval === 'month' ? 'Monthly' : 'Yearly'} Access`,
          },
          unit_amount: amount,
          recurring: {
            interval: interval
          }
        },
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${origin}/user/dashboard?success=true`,
      cancel_url: `${origin}/user/dashboard?canceled=true`,
    });

    return { url: session.url };
  } catch (error: any) {
    return { error: error.message };
  }
}
