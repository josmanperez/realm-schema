import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { readSchema, generateData } from './schemaParser';

yargs(hideBin(process.argv))
  .command('generate [schema]', 'Generate data', (yargs) => {
    return yargs.positional('schema', {
      describe: 'Path to the schema file',
      type: 'string',
    });
  }, (argv) => {
    if (typeof argv.schema === 'string') {
      console.log(`Generating data from schema: ${argv.schema}`);
      const schema = readSchema(argv.schema);
      const data = generateData(schema);
      console.log(data);
    }
  })
  .help()
  .argv;