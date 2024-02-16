// src/common/utils.ts
import { Types } from 'mongoose';

export function convertToObjectId(id: number): Types.ObjectId {
  try {
    return new Types.ObjectId(id);
  } catch (error) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
}
