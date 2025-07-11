export interface IRemoveFcmTokenUseCase{
    execute (userId:string,role:string):Promise<void>;
}