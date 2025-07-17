import { BuildingStatus } from "../../shared/dtos/types/user.types";

export interface IBuildingEntity{
    _id?:string;
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
      is24Hour: boolean;
      openTime?: string;
      closeTime?: string;
    };
    weekends: {
      is24Hour: boolean;
      openTime?: string;
      closeTime?: string;
    };
    };
    summarizedSpaces?:{
      name:string;
      count:number;
      price:number;
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