"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const schemaParser_1 = require("./schemaParser");
const Logger_1 = require("./Logger");
const mongoClientAux_1 = require("./mongoClientAux");
const command = {
    command: 'generate [schema]',
    describe: 'Generate data',
    builder: (yargs) => {
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
    handler: (argv) => __awaiter(void 0, void 0, void 0, function* () {
        let nDocuments = argv.number;
        if (argv.uri && argv.db && argv.col) {
            console.log(`Connecting to MongoDB Atlas with URI: ${argv.uri}`);
            const data = yield (0, schemaParser_1.generateDataFromSchema)(argv, nDocuments, false);
            try {
                const client = new mongoClientAux_1.MongoDBClient(argv.uri, argv.db, argv.col);
                yield client.insertDocuments(data.data);
            }
            catch (error) {
                Logger_1.Logger.log(Logger_1.LogType.error, error.message);
            }
        }
        else {
            try {
                yield (0, schemaParser_1.generateDataFromSchema)(argv, nDocuments, true);
            }
            catch (error) {
                Logger_1.Logger.log(Logger_1.LogType.error, error.message);
            }
        }
    }),
};
(0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .command(command)
    .demandCommand(1, 'You need at least one command before moving on')
    .help()
    .argv;
