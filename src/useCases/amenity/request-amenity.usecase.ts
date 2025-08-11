import { inject, injectable } from "tsyringe";
import { IAmenityRepository } from "../../entities/repositoryInterfaces/building/amenity-repository.interface";
import { IRequestAmenityUseCase } from "../../entities/usecaseInterfaces/amenity/request-amenity-usecase.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES } from "../../shared/constants";
import { StatusCodes } from "http-status-codes";
import { INotificationService } from "../../entities/serviceInterfaces/notification-service.interface";
import { config } from "../../shared/config";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { Types } from "mongoose";

@injectable()
export class RequestAmenityUseCase implements IRequestAmenityUseCase{
    constructor(
       @inject("IAmenityRepository")
       private _amenityRepo: IAmenityRepository,
       @inject("IVendorRepository")
       private _vendorRepo: IVendorRepository,
       @inject("INotificationService")
       private _notificationService: INotificationService,
    ){}

    async execute(name: string, description: string, userId:string):Promise<void>{
        const existing = await this._amenityRepo.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
        if (existing) {
            throw new CustomError(ERROR_MESSAGES.AMENITY_EXIST, StatusCodes.CONFLICT);
        }

        const vendor = await this._vendorRepo.findOne({_id:userId},{username: 1})
       await this._amenityRepo.save({name,description,status:'pending',requestedBy: vendor?._id});

       const adminId = config.ADMIN_ID;
        if (!adminId) {
            throw new CustomError(ERROR_MESSAGES.ADMIN_ID_NOT_FOUND, StatusCodes.INTERNAL_SERVER_ERROR);
        }

       await this._notificationService.sendToUser(
            adminId,
            'admin',
            'New Amenity Request',
            `New amenity request is given by ${vendor?.username}`,
            {
            vendorId: userId,
            }
        );

        await this._notificationService.saveNotification(
				adminId,
				"Admin",
				'New Amenity Request',
				`New amenity request is given by ${vendor?.username}`,
				{ vendorId: userId, }
		 );
    }
}