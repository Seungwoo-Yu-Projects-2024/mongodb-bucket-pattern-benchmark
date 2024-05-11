import { Types } from 'mongoose';

export interface PrimaryKey {
  _id: Types.ObjectId,
}

export interface CreatedAt {
  createdAt: Date,
}
