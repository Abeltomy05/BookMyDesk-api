import { FilterQuery } from "mongoose";

export interface IBaseRepository<T> {
  find(filter: any,projection?: any): Promise<T[]>;
  findAll(
    filter: any,
    skip: number,
    limit: number,
    sort?: Record<string, 1 | -1>
  ): Promise<{ items: T[]; total: number }>;
  findOne(filter: any,projection?: any): Promise<T | null>;
  save(data: Partial<T>): Promise<T>;
  update(filter: any, updateData: Partial<T> | any): Promise<T | null>;
  delete(filter: any): Promise<T | null>;
  deleteAll(filter: any): Promise<void>;
  countDocuments(filter?: any): Promise<number>;
  findFields<K extends keyof T>(filter: FilterQuery<T>,fields: K[]): Promise<Pick<T, K> | undefined>
  findWithPopulate(filter: FilterQuery<T>,populateFields: { path: string; select?: string }[]): Promise<T[]>
}