export interface IChatMessageEntity{
    _id: string;
    senderId: string;
    senderModel: string;

    receiverId: string;
    receiverModel: string;

    sessionId: string;

    text: string | null;
    image: string | null;
    isDeleted?: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}