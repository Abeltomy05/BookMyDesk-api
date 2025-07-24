import { inject, injectable } from "tsyringe";
import { IClientEntity } from "../../entities/models/client.entity";
import { IVendorEntity } from "../../entities/models/vendor.entity";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/users/vendor-repository.interface";
import { IGetAllUsersUseCase } from "../../entities/usecaseInterfaces/users/get-all-users-usecase.interface";

@injectable()
export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,
    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository
  ) {}

  async execute(
    userType: "client" | "vendor",
    page: number,
    limit: number,
    search: string,
    status: string,
    excludeStatus: string[] = []
  ): Promise<{
    users: (
      | Omit<IClientEntity, "password">
      | Omit<IVendorEntity, "password">
    )[];
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    let filter: any = {};

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];

      if (userType === "vendor") {
        filter.$or.push({ companyName: { $regex: search, $options: "i" } });
      }
    }

    if (status && status !== "all") {
      filter.status = status;
    } else if (excludeStatus.length > 0) {
      filter.status = { $nin: excludeStatus };
    }


    let repo =
      userType === "client" ? this._clientRepository : this._vendorRepository;

    const { items, total } = await repo.findAll(filter, skip, limit);
    const sanitizedUsers = items.map(({ password, _id, ...rest }) => ({
      _id: _id.toString(),
      ...rest,
    }));
    return {
      users: sanitizedUsers,
      totalPages: Math.ceil(total / limit),
    };
  }
}
