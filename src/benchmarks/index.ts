import { connect, disconnect, Types } from 'mongoose';
import { DateTime } from 'luxon';
import { BucketFactory } from '../factories';
import { BucketLog, BucketLogRaw } from '../models/bucket.model';
import * as bulk86400IncrementalInsertionSpeedBenchmark from './bulk-86400-incremental-insertion-speed.benchmark';
import * as bulk864000InsertionSpeedBenchmark from './bulk-864000-insertion-speed.benchmark';
import * as storageUsageBenchmark from './storage-usage.benchmark';
import { NormalLog } from '../models/normal.model';
import { TimeseriesLog } from '../models/timeseries.model';
import { config } from '../config';

const dataset = (() => {
  let createdAt = DateTime.now();
  const baseDateMillis = createdAt.toMillis();

  return Array.from({ length: 864000 }, (_, i) => {
    const log = {
      _id: new Types.ObjectId(),
      kind: baseDateMillis + Math.floor(i / 1000) + '',
      name: i + '',
      message: 'message ' + i,
      createdAt: createdAt.toJSDate(),
    };
    createdAt = createdAt.plus({ second: 1 });

    return log;
  });
})();

let _buckets: BucketLogRaw[] | undefined;
export async function getBuckets() {
  if (_buckets == null) {
    _buckets = await BucketFactory.create(
      BucketLog,
      dataset,
    );
  }

  return _buckets;
}

export const chunks = dataset.reduce(
  (previousValue, currentValue, currentIndex) => {
    if (currentIndex > 0 && currentIndex % 100000 === 0) {
      previousValue.push([currentValue]);
    } else {
      const array = previousValue[previousValue.length - 1];

      array.push(currentValue);
    }

    return previousValue;
  },
  [[]] as { _id: Types.ObjectId, kind: string, name: string, message: string, createdAt: Date }[][],
);

(async () => {
  await connect(config.dbUrl);

  await BucketLog.ensureIndexes();
  await NormalLog.ensureIndexes();
  await TimeseriesLog.ensureIndexes();

  const bulk864000InsertionResults = await bulk864000InsertionSpeedBenchmark.run();
  console.log(bulk864000InsertionResults);

  const bulk86400IncrementalInsertionResults = await bulk86400IncrementalInsertionSpeedBenchmark.run();
  console.log(bulk86400IncrementalInsertionResults);

  const storageUsageResults = await storageUsageBenchmark.run();
  console.log(storageUsageResults);

  await disconnect();
})().then();
