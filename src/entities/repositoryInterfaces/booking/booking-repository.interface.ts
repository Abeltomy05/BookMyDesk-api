import { IBookingModel } from "../../../frameworks/database/mongo/models/booking.model";
import { IBaseRepository } from "../base-repository.interface";

export interface IBookingRepository extends IBaseRepository<IBookingModel>{

}