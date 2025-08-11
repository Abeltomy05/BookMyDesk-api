export interface IRequestAmenityUseCase{
    execute(name: string, description: string, userId:string):Promise<void>;
}