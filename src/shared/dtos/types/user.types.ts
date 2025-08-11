

export type VendorStatus = "pending" | "approved" | "rejected" | "blocked";
export type ClientStatus = "active" | "blocked";
export type AdminStatus = "active";
export type BuildingStatus = "pending" | "approved" | "archived" | "rejected";
export type SpaceAggregation = {
  count: number;
  price: number;
};
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed" | "failed" ;
export type PaymentStatus = "unpaid" | "pending" | "succeeded" | "failed" | "refunded";
export type OfferStatus = "ongoing" | "upcoming" | "expired";
export type PaymentMethod = "stripe" | "wallet";
export type WalletTransactionTypes = "topup" | "payment" | "refund" | "withdrawal" | 'platform-fee' | 'booking-income' | "booking-refund";
export type AmenityStatus = 'active' | 'non-active' | 'pending' | 'rejected'

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

// export type PopulateOption = PopulateOptions | string;
