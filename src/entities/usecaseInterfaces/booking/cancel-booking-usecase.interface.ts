export interface ICancelBookingUseCase{
    execute(bookingId: string, reason:string, userId:string, role:string): Promise<{ success: boolean}>;
}