export interface IGetRetryDataUseCase{
     execute(token:string):Promise<{
          email:string
          phoneNumber: string
          companyName: string
          companyAddress: string
          idProof?: string
    }>
}