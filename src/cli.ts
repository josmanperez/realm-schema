import yargs, { CommandModule, Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generateDataFromSchema } from './schemaParser';
import { LogType, Logger } from './Logger';
import { MongoDBClient } from './mongoClientAux';

const command: CommandModule = {
  command: 'generate [schema]',
  describe: 'Generate data',
  builder: (yargs: Argv) => {
    return yargs
      .positional('schema', {
        describe: 'Path to the schema file',
        type: 'string',
      })
      .option('number', {
        describe: 'Number of documents to generate',
        type: 'number',
        default: 1,
        demandOption: true,
      })
      .option('uri', {
        describe: 'MongoDB Atlas conection URI with username and password',
        type: 'string',
      })
      .option('col', {
        describe: 'Atlas Collection name',
        type: 'string',
      })
      .option('db', {
        describe: 'Atlas Database name',
        type: 'string',
      })
      .check(argv => {
        if (argv.uri && (!argv.col || !argv.db)) {
          throw new Error('When uri is provided, col and db are mandatory');
        }
        return true;
      });
  },
  handler: async (argv: any) => {
    let nDocuments = argv.number;
    if (argv.uri && argv.db && argv.col) {
      console.log(`Connecting to MongoDB Atlas with URI: ${argv.uri}`);
      const data = await generateDataFromSchema(argv, nDocuments, false);
      try {
        const client = new MongoDBClient(argv.uri, argv.db, argv.col);
        await client.insertDocuments(data.data);
      } catch (error: any) {
        Logger.log(LogType.error, error.message);
      }
    } else {
      try {
        await generateDataFromSchema(argv, nDocuments, true);
      } catch (error: any) {
        Logger.log(LogType.error, error.message);
      }
    }
  },
};

yargs(hideBin(process.argv))
  .command(command)
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .argv;