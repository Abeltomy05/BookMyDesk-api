export interface IMarkAsReadUseCase{
    execute(id:string):Promise<void>;
}