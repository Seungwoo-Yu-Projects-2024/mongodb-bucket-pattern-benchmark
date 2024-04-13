import { CreatedAt, PrimaryKey } from '../interfaces';
import { model, Model, Schema } from 'mongoose';

export interface LogRaw extends PrimaryKey, CreatedAt {
  kind: string,
  name: string,
  message: string,
}

export type LogModel = Model<LogRaw>;
const log: Schema<LogRaw, LogModel> = new Schema({
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
});

export interface BucketLogRaw extends PrimaryKey {
  startDate: Date,
  order: number,
  logs: LogRaw[],
}

export type BucketLogModel = Model<BucketLogRaw>;
const bucketLog: Schema<BucketLogRaw, BucketLogModel> = new Schema({
  startDate: {
    type: Date,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  logs: [
    log,
    {
      default: [],
      required: true,
    },
  ],
}, {
  versionKey: false,
  timestamps: false,
}).index({
  startDate: 1,
  order: 1,
  'logs.kind': 1,
});

export const BucketLog = model<BucketLogRaw, BucketLogModel>(
  'BucketLog',
  bucketLog,
  'bucketLog',
);
