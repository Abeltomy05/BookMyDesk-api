export interface ICreateSessionUseCase{
    execute(buildingId:string,userId:string):Promise<{sessionId:string}>;
}