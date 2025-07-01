export interface IConfirmTopupPaymentUseCase{
    execute(paymentIntentId:string):Promise<{ success: boolean; data?:{walletBalance:number};}>;
}