export interface IMarkAsReadUseCase{
    execute(id?: string, userId?: string):Promise<void>;
}