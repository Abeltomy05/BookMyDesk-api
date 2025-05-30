export interface IUpdateUserPasswordUseCase{
   execute(userId: string, role:string, currentPassword: string, newPassword: string): Promise<{email: string}>
}