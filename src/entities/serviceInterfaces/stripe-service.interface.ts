import Stripe from 'stripe';

export interface IStripeService {
  createPaymentIntent(data: {
    amount: number;
    currency: string;
    metadata?: Record<string, string>;
    description?: string;
  }): Promise<Stripe.PaymentIntent>;
  
  retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent>;
}