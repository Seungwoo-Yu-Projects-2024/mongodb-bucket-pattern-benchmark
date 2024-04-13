import { getBuckets, chunks } from './index';
import { BucketLog } from '../models/bucket.model';
import { NormalLog } from '../models/normal.model';
import { TimeseriesLog } from '../models/timeseries.model';
import { Model } from 'mongoose';

export async function run() {
  await Promise.all(
    [
      BucketLog.insertMany(await getBuckets()),
      Promise.all(chunks.map((chunk) => NormalLog.insertMany(chunk))),
      Promise.all(chunks.map((chunk) => TimeseriesLog.insertMany(chunk))),
    ],
  );

  const results = await Promise.all(
    [BucketLog, NormalLog, TimeseriesLog]
      .map(async (model) => {
        const storageStats = (await model.aggregate([ { $collStats: { storageStats: { } } } ]))[0].storageStats;

        return {
          name: model.modelName,
          storageSize: storageStats.storageSize,
          totalIndexSize: storageStats.totalIndexSize,
          indexSizes: storageStats.indexSizes,
        };
      }),
  );

  await Promise.all(
    [BucketLog, NormalLog, TimeseriesLog].map((model) => (model as Model<unknown>).deleteMany()),
  );

  return results;
}
