import { CreatePaymentIntentResponse } from "../../../shared/dtos/booking.dto";

export interface ICreateTopUpPaymentIntentUseCase{
    execute(amount:number,currency:string,userId:string,role:string):Promise<CreatePaymentIntentResponse>;
}