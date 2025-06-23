export interface CreatePaymentIntentDTO{
    amount: number;
    currency: string;
    spaceId: string;
    bookingDate: Date;
    numberOfDesks?: number; 
    clientId: string;
}

export interface ConfirmPaymentDTO {
  paymentIntentId: string;
}


// Response type for the payment intent creation
export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  publishableKey: string;
}

