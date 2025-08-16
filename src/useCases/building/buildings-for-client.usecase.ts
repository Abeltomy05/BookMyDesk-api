import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES } from "../../shared/constants";
import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IBookingEntity } from "../../entities/models/booking.entity";
import { IBuildingEntity } from "../../entities/models/building.entity";
import { IBuildingsForClientUseCase } from "../../entities/usecaseInterfaces/building/buildings-for-client-usecase.interface";

@injectable()
export class BuildingsForClientUseCase implements IBuildingsForClientUseCase{
    constructor(
      @inject("IBookingRepository")
      private _bookingRepo: IBookingRepository,
    ){}

    async execute(clientId:string):Promise<{_id:string,buildingName:string}[]>{
      if(!clientId){
        throw new CustomError(ERROR_MESSAGES.MISSING_DATA,StatusCodes.BAD_REQUEST);
      }

      const bookings = await this._bookingRepo.findWithPopulate<
        IBookingEntity & { buildingId: IBuildingEntity | null }
      >(
        { clientId },
        [
            {
            path: "buildingId", 
            select: "_id buildingName", 
            match: { status: "approved" },
            },
        ]
      );

      const uniqueBuildingsMap = new Map<string, { _id: string; buildingName: string }>();  
      bookings.forEach(b => {
        const building = b.buildingId;
        if (building?._id && building.buildingName && !uniqueBuildingsMap.has(building._id)) {
            uniqueBuildingsMap.set(building._id, { _id: building._id, buildingName: building.buildingName });
        }
      });

      return Array.from(uniqueBuildingsMap.values());
    }
}