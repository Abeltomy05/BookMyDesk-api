import { Model, FilterQuery } from "mongoose";


export class BaseRepository<T> {
    constructor(protected model: Model<T>) { }

    async findOne(filter: FilterQuery<T>, projection?: any){
        return this.model.findOne(filter).select(projection).lean() as Promise<T>;
    }

    async find(filter: FilterQuery<T>){
        return this.model.find(filter);
    }

    async findAll(filter: FilterQuery<T> = {}, skip = 0, limit = 10, sort: Record<string, 1 | -1> = {}) {
    const [items, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit).lean() as Promise<T[]>,
      this.model.countDocuments(filter),
    ]);
    return { items, total };
    }

     async save(data: Partial<T>) {
    return this.model.create(data);
  }

    async update(filter: FilterQuery<T>, updateData: Partial<T>) {
    return this.model
      .findOneAndUpdate(filter, updateData, { new: true })
      .lean() as Promise<T>;
  }

    async delete(filter: FilterQuery<T>) {
    return this.model.findOneAndDelete(filter).lean() as Promise<T>;
  }

  async deleteAll(filter: FilterQuery<T>) {
    await this.model.deleteMany(filter);
  }

  async countDocuments(filter: FilterQuery<T> = {}) {
    return this.model.countDocuments(filter);
  }
}
