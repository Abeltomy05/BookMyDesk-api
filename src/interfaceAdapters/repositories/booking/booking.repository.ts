import { injectable } from "tsyringe";
import { BookingModel, IBookingModel } from "../../../frameworks/database/mongo/models/booking.model";
import { BaseRepository } from "../base.repository";

@injectable()
export class BookingRepository extends BaseRepository<IBookingModel> implements IBookingRepository{
   constructor(){
    super(BookingModel)
   }

}