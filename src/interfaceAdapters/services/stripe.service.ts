import Stripe from 'stripe';
import { inject, injectable } from 'tsyringe';
import { IStripeService } from '../../entities/serviceInterfaces/stripe-service.interface';
import { config } from '../../shared/config';
import { CustomError } from '../../entities/utils/custom.error';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class StripeService implements IStripeService {
  private stripe: Stripe;

  constructor() {
    if (!config.STRIPE_SECRET_KEY) {
      throw new CustomError('STRIPE_SECRET_KEY is not configured',StatusCodes.INTERNAL_SERVER_ERROR);
    }
    
    this.stripe = new Stripe(config.STRIPE_SECRET_KEY, {

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

  async refundPaymentIntent(paymentIntentId: string) {
  return await this.stripe.refunds.create({ payment_intent: paymentIntentId,});
 }

  
} 

