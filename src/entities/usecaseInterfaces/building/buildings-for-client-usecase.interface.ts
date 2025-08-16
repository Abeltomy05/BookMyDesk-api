export interface IBuildingsForClientUseCase{
    execute(clientId:string):Promise<{_id:string,buildingName:string}[]>;
}