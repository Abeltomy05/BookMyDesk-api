import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { IAmenityController } from "../../entities/controllerInterfaces/others/amenity-controller.interface";
import { StatusCodes } from "http-status-codes";
import { IGetAllAmenityUseCase } from "../../entities/usecaseInterfaces/amenity/get-all-amenity-usecase.interface";
import { ICreateAmenityUseCase } from "../../entities/usecaseInterfaces/amenity/create-amenity-usecase.interface";
import { IEditAmenityUseCase } from "../../entities/usecaseInterfaces/amenity/edit-amenity-usecase.interface";
import { IDeleteAmenityUseCase } from "../../entities/usecaseInterfaces/amenity/delete-amenity-usecase.interface";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../shared/constants";

@injectable()
export class AmenityController implements IAmenityController{
    constructor(
      @inject("IGetAllAmenityUseCase")
      private _getAllAmenityUseCase: IGetAllAmenityUseCase,
      @inject("ICreateAmenityUseCase")
      private _createAmenityUseCase: ICreateAmenityUseCase,
      @inject("IEditAmenityUseCase")
      private _editAmenityUseCase: IEditAmenityUseCase,
      @inject("IDeleteAmenityUseCase")
      private _deleteAmenityUseCase: IDeleteAmenityUseCase,
    ){}

    async getAllAmenity(req:Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const { page = '1', limit = '10', search = '', isActive } = req.query;
            const result = await this._getAllAmenityUseCase.execute(
                parseInt(page as string),
                parseInt(limit as string),
                search as string,
                isActive === 'true' ? true : isActive === 'false' ? false : undefined,
            );
            res.status(StatusCodes.OK).json({
                success: true,
                ...result,
            })
        } catch (error) {
            next(error);
        }
    }

    async createAmenity(req:Request, res: Response, next: NextFunction): Promise<void>{
        try {
             const { name } = req.body;
            if(!name || typeof name != 'string'){
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.AMENITY_NAME_REQUIRED
                })
            }
            await this._createAmenityUseCase.execute(name);
            res.status(StatusCodes.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.CREATED,
            });
        } catch (error) {
            next(error);
        }
    }

    async editAmenity(req:Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const { id, name } = req.body;
            if(!id || !name){
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_CREDENTIALS
                })
            }

            await this._editAmenityUseCase.execute(id,name);
            res.status(StatusCodes.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATED
            })
        } catch (error) {
            next(error)
        }
    }

    async deleteAmenity(req:Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const { id } = req.query;
            if(!id ){
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_CREDENTIALS
                })
            }

            await this._deleteAmenityUseCase.execute(id as string);
            res.status(StatusCodes.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DELETED
            })
        } catch (error) {
            next(error)
        }
    }
}