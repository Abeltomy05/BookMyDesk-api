export interface IClearNotificationUseCase{
    execute(userId: string, role: string):Promise<void>;
}