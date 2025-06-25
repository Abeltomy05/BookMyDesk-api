import { IGetBookingsDTO, IGetBookingsResult } from "../../../shared/dtos/booking.dto";

export interface IGetBookingsUseCase{
    execute(params: IGetBookingsDTO): Promise<IGetBookingsResult>;
}