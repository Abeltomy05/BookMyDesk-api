export interface IVendorDataResponseDTO {
  totalBookings: number;
  buildings: {
    buildingName: string;
    summarizedSpaces?: {
      name: string;
      count: number;
      price: number;
    }[];
  }[];
  totalRevenue: {
    balance: number;
  } | null;
}