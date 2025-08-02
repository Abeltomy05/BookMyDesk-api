export interface ICreateAmenityUseCase{
     execute(name: string, type?: string, id?: string): Promise<void>;
}