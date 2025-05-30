export interface IUpdateUserProfileUseCase{
    execute(userId: string, role: string, data: any): Promise<any>;
}