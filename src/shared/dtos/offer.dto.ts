import { IOfferEntity } from "../../entities/models/offer.entity";
import { OfferStatus } from "./types/user.types";

interface OfferWithNamesDTO {
  _id: string;
  spaceId: string;
  spaceName: string;
  buildingId: string;
  buildingName: string;
  vendorId: string;
  discountPercentage: number;
  title: string;
  description?: string;
  status: OfferStatus;
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FetchOffersResultDTO {
  offers: OfferWithNamesDTO[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IOfferWithNames {
  _id: string;
  vendorId: string;
  buildingId: {
    _id: string;
    buildingName: string;
  };
  spaceId: {
    _id: string;
    name: string;
  };
  discountPercentage: number;
  title: string;
  description?: string;
  status: OfferStatus;
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}