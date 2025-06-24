import Stripe from 'stripe';
import { inject, injectable } from 'tsyringe';
import { IStripeService } from '../../entities/serviceInterfaces/stripe-service.interface';

@injectable()
export class StripeService implements IStripeService {
  private stripe: Stripe;

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {

    });
  }

  async createPaymentIntent(
     data: Stripe.PaymentIntentCreateParams
  ): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.create(data);
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  async capturePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.capture(paymentIntentId);
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.cancel(paymentIntentId);
  }

  
} 

