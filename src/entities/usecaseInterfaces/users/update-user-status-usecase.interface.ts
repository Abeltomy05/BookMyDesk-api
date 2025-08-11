export interface IUpdateEntityStatusUseCase{
    execute(userType: string, userId: any, status: string, reason?: string, email?:string): Promise<void>;
}