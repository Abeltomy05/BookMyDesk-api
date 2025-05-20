export interface IResetPasswordUseCase {
    execute({password, token, role}:{password:string, token:string, role:string}): Promise<void>;
}