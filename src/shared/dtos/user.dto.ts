
export interface AdminDTO{
    username?: string;
    email: string;
    password: string;
    role: "admin";
}

export interface ClientDTO{
    username?: string;
    email: string;
    password: string;
    phone: string;
    avatar?: string;
    googleId?: string;
    role: "client";
}

export interface VendorDTO{
    username?: string;
    email: string;
    password: string;
    phone: string;
    avatar?: string;
    googleId?: string;
    companyName: string,
    companyAddress:string,
    idProof?: string,
    role: "vendor";
}

export interface GoogleAuthDTO {
  email: string;
  username: string;
  avatar?: string;
  googleId: string;
  role: 'client' | 'vendor';
}

export type UserDTO = AdminDTO | ClientDTO | VendorDTO;

export interface LoginUserDTO {
  email: string;
  password?: string;
  role: string;
}