import { ConfirmPaymentDTO } from "../../../shared/dtos/booking.dto";

export interface IConfirmPaymentUseCase {
  execute(data: ConfirmPaymentDTO):Promise<{ success: boolean; data?: any; }>;
}