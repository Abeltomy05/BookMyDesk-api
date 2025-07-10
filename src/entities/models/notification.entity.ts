export interface INotificationEntity{
    _id: string;
    userId: string;
    role: string;
    title: string;
    body: string;
    isRead?: boolean;
    metaData?: object;
    createdAt?: Date;
    updatedAt?: Date;
}