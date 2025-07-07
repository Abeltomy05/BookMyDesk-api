export interface IUserEntity {
  _id?:string
  username: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
  avatar?: string;
  fcmToken?:string;
  createdAt?: Date;
  updatedAt?: Date;
}