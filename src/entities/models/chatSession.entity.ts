export interface IChatSessionEntity{
    _id:string;
    clientId: string,
    buildingId: string,

    lastMessage?: string,
    lastMessageAt?: Date,

    isClearedBy?: string[],

    createdAt?: Date,
    updatedAt?: Date
}