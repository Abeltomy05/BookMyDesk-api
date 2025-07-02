import { WalletDetailsDTO } from "../../../shared/dtos/wallet.dto";

export interface IGetWalletDetailsUseCase {
    execute(userId: string, role: string, page: number, limit: number): Promise<WalletDetailsDTO>;
}