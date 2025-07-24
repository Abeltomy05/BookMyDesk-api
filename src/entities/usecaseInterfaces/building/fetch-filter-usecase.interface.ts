export interface IFetchFiltersUseCase{
    execute(): Promise<{ spaceNames: string[]; prices: number[] }>;
}