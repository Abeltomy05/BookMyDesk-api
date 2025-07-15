export interface IChatSessionEntity{
    _id:string;
    clientId: string,
    buildingId: string,

    lastMessage?: string,
    lastMessageAt?: Date,

    clearedAtBy?: { [userId: string]: Date };

    createdAt?: Date,
    updatedAt?: Date
}