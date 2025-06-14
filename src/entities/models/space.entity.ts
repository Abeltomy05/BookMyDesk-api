export interface ISpaceEntity{
    buildingId:string;
    name:string;
    description?:string;
    capacity?:number;
    pricePerDay:number;
    amenities?:string[];
    isAvailable:boolean;
    createdAt?: Date;
    updatedAt?: Date;
}