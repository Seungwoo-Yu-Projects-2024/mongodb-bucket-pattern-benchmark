import { CreatedAt, PrimaryKey } from '../interfaces';
import { model, Model, Schema } from 'mongoose';

export interface NormalLogRaw extends PrimaryKey, CreatedAt {
  kind: string,
  name: string,
  message: string,
}

export type NormalLogModel = Model<NormalLogRaw>;
const normalLog: Schema<NormalLogRaw, NormalLogModel> = new Schema({
  kind: {
    type: String,
    minlength: 1,
    required: true,
  },
  name: {
    type: String,
    minlength: 1,
    required: true,
  },
  message: {
    type: String,
    minlength: 1,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
}, {
  versionKey: false,
}).index({
  createdAt: 1,
  kind: 1,
});

export const NormalLog = model<NormalLogRaw, NormalLogModel>(
  'NormalLog',
  normalLog,
  'normalLog',
);
