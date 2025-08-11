import { AmenityStatus } from "../../shared/dtos/types/user.types";

export interface IAmenityEntity{
    _id: string;
    name: string;
    status: AmenityStatus;
    description?: string; 
    requestedBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
}