export interface IUpdateUserStatusUseCase{
    execute(userType: string, userId: any, status: string, reason?: string): Promise<void>;
}