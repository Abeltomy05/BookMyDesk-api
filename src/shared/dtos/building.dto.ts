import { BuildingStatus } from "./types/user.types";

export interface EveryBuildingUsecaseResponseDTO{
     _id: string;
    buildingName: string;
    location?: { name?: string };
    vendor: {
      _id: string;
      username: string;
      companyName: string;
      avatar?: string;
    };
    status: string;
    summarizedSpaces?: {
      name: string;
      count: number;
      price: number;
    }[];
    createdAt?: string;
}

export interface LocationData {
  type?:string,
  name: string;
  displayName: string;
  zipCode: string;
  coordinates: [number, number]; 
}

export interface OpeningHours {
  is24Hour?: boolean
  openTime?: string
  closeTime?: string
}

export interface Space {
  _id: string
  name: string
  capacity: number
  pricePerDay: number
  amenities?: string[]
  isAvailable: boolean
  buildingId?:string
}

export interface Building {
  _id: string
  buildingName: string
  status?: BuildingStatus
  location: LocationData | null
  createdAt?: string
  email: string
  phone: string
  openingHours: {
    weekdays: OpeningHours
    weekends: OpeningHours
  }
  spaces: Space[]
  description?: string
  amenities: string[]
  images: string[]
}