export interface IDeleteExpiredOffersUseCase{
    execute(): Promise<{ deletedCount: number }>;
}