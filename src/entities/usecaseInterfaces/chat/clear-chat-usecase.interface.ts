export interface IClearChatUseCase{
    execute(sessionId:string,userId:string):Promise<void>;
}