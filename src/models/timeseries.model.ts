import { CreatedAt, PrimaryKey } from '../interfaces';
import { model, Model, Schema } from 'mongoose';

export interface TimeseriesLogRaw extends PrimaryKey, CreatedAt {
  kind: string,
  name: string,
  message: string,
}

export type TimeseriesLogModel = Model<TimeseriesLogRaw>;
const timeseriesLog: Schema<TimeseriesLogRaw, TimeseriesLogModel> = new Schema({
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
  timeseries: {
    timeField: 'createdAt',
    metaField: 'kind',
    granularity: 'minutes',
  },
  versionKey: false,
}).index({
  createdAt: 1,
  kind: 1,
});

export const TimeseriesLog = model<TimeseriesLogRaw, TimeseriesLogModel>(
  'TimeseriesLog',
  timeseriesLog,
  'timeseriesLog',
);
