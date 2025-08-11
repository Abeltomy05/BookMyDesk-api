export interface IGetAllAmenityUseCase{
    execute(page: number, limit: number, search?: string, status?: string
        ):Promise<{
            data: {_id:string,name:string,status?: string}[];
            currentPage: number;
            totalItems: number;
            totalPages: number;
        }>
}