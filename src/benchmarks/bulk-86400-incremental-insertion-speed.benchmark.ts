import Bench from 'tinybench';
import { DateTime } from 'luxon';
import { BucketLog, LogRaw } from '../models/bucket.model';
import { Types } from 'mongoose';
import { BucketFactory } from '../factories';
import { NormalLog } from '../models/normal.model';
import { TimeseriesLog } from '../models/timeseries.model';

const bulk86400IncrementalInsertionSpeedBenchmark = new Bench({
  iterations: 100,
});

async function afterAll() {
  await BucketLog.deleteMany({});
  await NormalLog.deleteMany({});
  await TimeseriesLog.deleteMany({});
}

export async function run() {
  let createdAt = DateTime.now();
  bulk86400IncrementalInsertionSpeedBenchmark
    .add('bucket - 86400 incremental insertion', async () => {
      const baseDateMillis = createdAt.toMillis();
      const buckets = await BucketFactory.create(
        BucketLog,
        Array.from({ length: 86400 }, (_, i) => {
          const log: LogRaw = {
            _id: new Types.ObjectId(),
            kind: baseDateMillis + (i % 1000) + '',
            name: i + '',
            message: 'message ' + i,
            createdAt: createdAt.toJSDate(),
          };
          createdAt = createdAt.plus({ second: 1 });

          return log;
        }),
      );

      try {
        await BucketLog.bulkWrite(
          buckets.map((bucket) => ({
            updateOne: {
              filter: {
                _id: bucket._id,
              },
              update: {
                $set: bucket,
              },
              upsert: true,
            },
          })),
        );
      } catch (e) {
        console.error(e);
        throw e;
      }
    }, { afterAll })
    .add('normal - 86400 incremental insertion', async () => {
      const baseDateMillis = createdAt.toMillis();

      try {
        await NormalLog.insertMany(
          Array.from({ length: 86400 }, (_, i) => {
            const log = {
              _id: new Types.ObjectId(),
              kind: baseDateMillis + (i % 1000) + '',
              name: i + '',
              message: 'message ' + i,
              createdAt: createdAt.toJSDate(),
            };
            createdAt = createdAt.plus({ second: 1 });

            return log;
          }),
        );
      } catch (e) {
        console.error(e);
        throw e;
      }
    }, { afterAll })
    .add('timeseries - 86400 incremental insertion', async () => {
      const baseDateMillis = createdAt.toMillis();

      try {
        await TimeseriesLog.insertMany(
          Array.from({ length: 86400 }, (_, i) => {
            const log = {
              _id: new Types.ObjectId(),
              kind: baseDateMillis + (i % 1000) + '',
              name: i + '',
              message: 'message ' + i,
              createdAt: createdAt.toJSDate(),
            };
            createdAt = createdAt.plus({ second: 1 });

            return log;
          }),
        );
      } catch (e) {
        console.error(e);
        throw e;
      }
    }, { afterAll });

  await bulk86400IncrementalInsertionSpeedBenchmark.warmup();
  await bulk86400IncrementalInsertionSpeedBenchmark.run();

  return bulk86400IncrementalInsertionSpeedBenchmark.table();
}
