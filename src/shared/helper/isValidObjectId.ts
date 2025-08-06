import { Types } from "mongoose";

export function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id) && (new Types.ObjectId(id)).toString() === id;
}