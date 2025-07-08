export interface INotificationService{
    sendToUser(userId:string, role:string, title:string, body:string, data?: Record<string, string>):Promise<void>;
}