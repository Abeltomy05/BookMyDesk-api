export type VendorStatus = "pending" | "approved" | "rejected" | "blocked";
export type ClientStatus = "active" | "blocked";
export type AdminStatus = "active";
export type BuildingStatus = "pending" | "approved" | "archived" | "rejected";

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  status: 'active' | 'blocked';
  profilePic?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetUsersQuery {
  status?: 'active' | 'blocked';
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}