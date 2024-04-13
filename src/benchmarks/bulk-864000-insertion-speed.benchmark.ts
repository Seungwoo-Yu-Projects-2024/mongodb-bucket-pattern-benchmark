import Bench from 'tinybench';
import { BucketLog } from '../models/bucket.model';
import { NormalLog } from '../models/normal.model';
import { TimeseriesLog } from '../models/timeseries.model';
import { getBuckets, chunks } from '.';

const bulk864000InsertionSpeedBenchmark = new Bench({
  iterations: 10,
});

async function afterEach() {
  await BucketLog.deleteMany({});
  await NormalLog.deleteMany({});
  await TimeseriesLog.deleteMany({});
}

export async function run() {
  const buckets = await getBuckets();
  bulk864000InsertionSpeedBenchmark
    .add('bucket - 864000 insertion', async () => {
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
    }, { afterEach })
    .add('normal - 864000 insertion', async () => {
      try {
        await Promise.all(chunks.map(async (chunk) => {
          await NormalLog.insertMany(chunk);
        }));
      } catch (e) {
        console.error(e);
        throw e;
      }
    }, { afterEach })
    .add('timeseries - 864000 insertion', async () => {
      try {
        await Promise.all(chunks.map(async (chunk) => {
          await TimeseriesLog.insertMany(chunk);
        }));
      } catch (e) {
        console.error(e);
        throw e;
      }
    }, { afterEach });

  await bulk864000InsertionSpeedBenchmark.warmup();
  await bulk864000InsertionSpeedBenchmark.run();

  return bulk864000InsertionSpeedBenchmark.table();
}
