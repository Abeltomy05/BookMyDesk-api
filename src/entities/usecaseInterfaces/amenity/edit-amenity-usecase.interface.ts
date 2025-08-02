export interface IEditAmenityUseCase{
    execute(id:string,name:string):Promise<void>;
}