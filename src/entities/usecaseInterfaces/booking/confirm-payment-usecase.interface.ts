import { ConfirmPaymentDTO, ConfirmPaymentResponse } from "../../../shared/dtos/booking.dto";

export interface IConfirmPaymentUseCase {
  execute(data: ConfirmPaymentDTO): Promise<ConfirmPaymentResponse>;
}