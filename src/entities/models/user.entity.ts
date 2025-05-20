export interface IUserEntity {
  username: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}