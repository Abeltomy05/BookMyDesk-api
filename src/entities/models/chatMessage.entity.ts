export interface IChatMessageEntity{
    _id: string;
    senderId: string;
    senderModel: string;

    receiverId: string;
    receiverModel: string;

    roomId: string;

    type: string;
    content: string;
    isDeletedFor?: string[];
    readBy?: string[];

    createdAt?: Date;
    updatedAt?: Date;
}