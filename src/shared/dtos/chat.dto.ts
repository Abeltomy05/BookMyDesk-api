export interface ChatSessionDto {
  _id: string;
  clientId?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  buildingId?: {
    _id: string;
    buildingName: string;
  };
  lastMessage?: string;
  lastMessageAt?: Date;
}

export interface GetMessageDTO{
 _id:string;
 senderId: string;
 receiverId:string;
 text: string | null;
 image: string | null;
 createdAt?:Date;
}

export interface SaveMessageDTO{
  sessionId: string;
  senderId: string;
  receiverId: string;
  text: string | null;
  image: string | null;
  senderModel: 'Client' | 'Building';
  receiverModel: 'Client' | 'Building';
}
