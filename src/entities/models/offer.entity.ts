import { OfferStatus } from "../../shared/dtos/types/user.types";

export interface IOfferEntity{
    _id: string;
    spaceId: string;
    buildingId: string;
    vendorId: string;

    discountPercentage:number;
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}