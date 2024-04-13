import { BucketLogModel, BucketLogRaw, LogRaw } from '../models/bucket.model';
import { DateTime } from 'luxon';
import { calculateObjectSize } from 'bson';

interface BucketWrapper {
  bucket: BucketLogRaw,
  size: number,
}

export class BucketFactory {
  public static async create(model: BucketLogModel, logs: LogRaw[]) {
    const bucketMap = new Map<number, BucketWrapper[]>();
    for (const log of logs) {
      const startDate = DateTime.fromJSDate(log.createdAt)
        .startOf('week', { useLocaleWeeks: true })
        .toUTC();
      const startDateMillis = startDate.toMillis();
      const bucketWrappers = bucketMap.get(startDateMillis) ?? [];
      if (bucketWrappers.length === 0) {
        const bucket =
          (await model.findOne({ startDate }).sort({ order: -1 })) ?? new model({ startDate, order: 0 });

        bucketWrappers.push({ bucket, size: calculateObjectSize(bucket) });
        bucketMap.set(startDateMillis, bucketWrappers);
      }

      const wrapper = bucketWrappers.at(-1)!;
      const logSize = calculateObjectSize(log);
      if (wrapper.size + logSize >= 8 * 1024 * 1024) {
        const bucket = new model({ startDate, order: wrapper.bucket.order + 1 });

        bucketWrappers.push({
          bucket,
          size: logSize + calculateObjectSize(bucket),
        });
      } else {
        wrapper.bucket.logs.push(log);
        wrapper.size += logSize;
      }
    }

    return Array.from(bucketMap.values())
      .map((wrappers) => (
        wrappers.map((wrapper) => wrapper.bucket)
      ))
      .flat();
  }
}
