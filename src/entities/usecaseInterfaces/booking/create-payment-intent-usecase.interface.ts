import { CreatePaymentIntentDTO, CreatePaymentIntentResponse } from "../../../shared/dtos/booking.dto";

export interface ICreatePaymentIntentUseCase {
  execute(data: CreatePaymentIntentDTO): Promise<CreatePaymentIntentResponse>;
}