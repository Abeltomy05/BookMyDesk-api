export type VendorStatus = "pending" | "approved" | "rejected" | "blocked";
export type ClientStatus = "active" | "blocked";
export type AdminStatus = "active";
export type BuildingStatus = "pending" | "approved" | "archived" | "rejected";
export type SpaceAggregation = {
  count: number;
  price: number;
};
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed" | "failed";
export type PaymentStatus = "unpaid" | "pending" | "succeeded" | "failed" | "refunded";
export type PaymentMethod = "stripe" | "wallet";

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
