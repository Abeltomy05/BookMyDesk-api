export interface IBcrypt{
    hash(origianl:string):Promise<string>;
    compare(current:string,original:string):Promise<boolean>;
}