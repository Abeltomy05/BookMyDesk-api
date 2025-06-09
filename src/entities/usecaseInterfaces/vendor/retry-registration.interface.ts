export interface IRetryRegistration {
  execute(data: {
    email: string
    phone: string
    companyName: string
    companyAddress: string
    idProof: string
  }): Promise<void>
}