export interface IDeleteAmenityUseCase{
    execute(id: string):Promise<void>;
}