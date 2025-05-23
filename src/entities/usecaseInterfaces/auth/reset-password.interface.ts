export interface IResetPasswordUseCase {
    execute({password, token}:{password:string, token:string}): Promise<string>;
}