export interface IGetUserCountUseCase {
    execute(): Promise<{ clients: number; vendors: number }>;
}