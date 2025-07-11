export interface IChatSessionEntity{
    _id:string;
    clientId: string,
    vendorId: string,
    bookingId: string,

    lastMessage?: string,
    lastMessageAt?: Date,

    isClearedBy?: string[],

    createdAt?: Date,
    updatedAt?: Date
}