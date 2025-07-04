export interface IDeleteEntityUseCase{
    execute(entityId:string, entityType:string):Promise<{success:boolean}>;
}