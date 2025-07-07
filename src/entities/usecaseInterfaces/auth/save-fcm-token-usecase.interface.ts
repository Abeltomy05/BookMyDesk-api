export interface ISaveFcmTokenUseCase{
    execute(fcmToken:string,userId:string,role:string):Promise<void>;
}