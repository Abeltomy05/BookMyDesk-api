import { BuildingStatus } from "../../shared/types/types";

export interface IBuildingEntity{
    buildingName:string;
    vendorId: string; 
    location?: {
    type?: string;
    name?: string;
    displayName?: string;
    zipCode?: string;
    coordinates?: number[];
   };
    openingHours?: {
     weekdays: {
      is24_7: boolean;
      openTime?: string;
      closeTime?: string;
    };
    weekends: {
      is24_7: boolean;
      openTime?: string;
      closeTime?: string;
    };
    };
    summarizedSpaces?:{
      name:string;
      count:number;
    }[];
    phone?:string;
    email?:string;
    description?:string;
    images?:string[];
    amenities?:string[];
    status:BuildingStatus;
    createdAt?: Date;
    updatedAt?: Date;
}