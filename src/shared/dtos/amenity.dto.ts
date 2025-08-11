import { IAmenityEntity } from "../../entities/models/amenity.entity";
import { AmenityStatus } from "./types/user.types";

export interface PendingAmenityDTO {
  data:{
  _id: string;
  name: string;
  description?: string;
  status: AmenityStatus;
  createdAt?: Date;
  requestedBy: {
    username: string;
    email: string;
  };
}[];
  currentPage: number,
  totalPages: number,
  totalItems: number,
}
export interface IAmenityEntityPopulated extends Omit<IAmenityEntity, "requestedBy"> {
  requestedBy: {
    username: string;
    email: string;
  };
}