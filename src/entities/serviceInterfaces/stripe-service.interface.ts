import Stripe from 'stripe';

export interface IStripeService {
  createPaymentIntent(
     data: Stripe.PaymentIntentCreateParams
  ): Promise<Stripe.PaymentIntent> ;
  
  retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent>;
  capturePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent>;
  cancelPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent>;
  refundPaymentIntent(paymentIntentId: string): Promise<Stripe.Refund>;
}