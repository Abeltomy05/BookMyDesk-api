import { IGetAdminBookingsFilterDTO, IGetAdminBookingsResultDTO } from "../../../shared/dtos/booking.dto";

export interface IGetBookingsForAdmin {
  execute(data: IGetAdminBookingsFilterDTO ): Promise<IGetAdminBookingsResultDTO>;
}