import yargs from 'yargs';

export const config = yargs.env('')
  .options({
    dbUrl: { type: 'string', demandOption: true },
  })
  .parseSync();
export type Config = typeof config;
