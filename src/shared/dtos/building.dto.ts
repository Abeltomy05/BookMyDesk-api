export interface EveryBuildingUsecaseResponseDTO{
     _id: string;
    buildingName: string;
    location?: { name?: string };
    vendor: {
      _id: string;
      username: string;
      companyName: string;
      avatar?: string;
    };
    status: string;
    summarizedSpaces?: {
      name: string;
      count: number;
      price: number;
    }[];
    createdAt?: string;
}