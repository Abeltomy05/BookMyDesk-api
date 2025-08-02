export interface IGetAllAmenityUseCase{
    execute(page: number, limit: number, search?: string, isActive?: boolean
        ):Promise<{
            data: {_id:string,name:string,isActive:boolean}[];
            currentPage: number;
            totalItems: number;
            totalPages: number;
        }>
}