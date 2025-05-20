import bcrypt from 'bcryptjs';
import { IBcrypt } from './bcrypt.interface';
import { inject, injectable } from 'tsyringe';

@injectable()
export class passwordBcrypt implements IBcrypt {
   

    async hash(original: string): Promise<string>{
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(original, salt);
    }

    async compare(current: string, original: string): Promise<boolean>{
        return await bcrypt.compare(current, original);
    }
}