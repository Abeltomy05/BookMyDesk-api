import { BuildingStatus } from "../../shared/types/types";

export interface IBuildingEntity{
    buildingName:string;
    vendorId: string; 
    location?: {
		type?: "Point";
		name?: string;
		displayName?: string;
		zipCode?: string;
		coordinates?: number[];
	};
    openingHours?: {
    [day: string]: {
      open?: string;
      close?: string;
      closed?: boolean;
      is24Hours?: boolean;
    };
    };
    phone?:string;
    email?:string;
    images?:string[];
    amenities?:string[];
    status:BuildingStatus;
    createdAt?: Date;
    updatedAt?: Date;
}