export interface IRefreshTokenUseCase {
    execute(refreshToken: string): { accessToken: string };
}