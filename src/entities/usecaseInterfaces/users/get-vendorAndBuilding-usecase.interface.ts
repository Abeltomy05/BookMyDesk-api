export interface IGetVendorsAndBuildingsUseCase{
    execute(): Promise<{
          vendors: { names: { _id: string; companyName: string }[]; count: number };
          buildings: { names: { _id: string; buildingName: string }[]; count: number };
    }>
}