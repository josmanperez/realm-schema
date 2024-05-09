import yargs, { CommandModule, Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generateDataFromSchema } from './schemaParser';

const command: CommandModule = {
  command: 'generate [schema]',
  describe: 'Generate data',
  builder: (yargs: Argv) => {
    return yargs
      .positional('schema', {
        describe: 'Path to the schema file',
        type: 'string',
      })
      .option('uri', {
        describe: 'MongoDB Atlas conection URI with username and password',
        type: 'string',
      })
      .option('number', {
        describe: 'Number of documents to generate',
        type: 'number',
        default: 1,
        demandOption: true,
      });
  },
  handler: async (argv: any) => {
    let nDocuments = argv.number;
    if (argv.uri) {
      console.log(`Connecting to MongoDB Atlas with URI: ${argv.uri}`);
    } else {
      await generateDataFromSchema(argv, nDocuments, true);
    }
  },
};

yargs(hideBin(process.argv))
  .command(command)
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .argv;