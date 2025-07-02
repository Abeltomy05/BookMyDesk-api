export interface IPayWithWalletUseCase{
   execute(
        spaceId:string,
        bookingDate:Date,
        numberOfDesks:number,
        totalPrice:number,
        userId:string
    ):Promise<{ success: boolean; bookingId: string }>;
}