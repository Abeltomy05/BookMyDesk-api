export interface IUpdateUserStatusUseCase{
    execute(userType: string, userId: any, status: string): Promise<void>;
}