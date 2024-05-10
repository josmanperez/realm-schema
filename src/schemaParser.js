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
exports.generateData = exports.readSchema = exports.generateDataFromSchema = void 0;
const fs_1 = __importDefault(require("fs"));
const faker_1 = require("@faker-js/faker");
const bson_1 = require("bson");
const Logger_1 = require("./Logger");
const customErrors_1 = require("./customErrors");
/**
 * This function generates data from a schema.
 * @throws {JsonParseError} When the JSON file can't be parsed.
 */
function generateDataFromSchema(argv_1, nDocuments_1) {
    return __awaiter(this, arguments, void 0, function* (argv, nDocuments, writeToFile = false) {
        if (typeof argv.schema === 'string') {
            const schema = yield readSchema(argv.schema);
            const data = yield generateData(schema, nDocuments);
            Logger_1.Logger.log(Logger_1.LogType.trace, bson_1.EJSON.stringify(data));
            if (writeToFile) {
                fs_1.default.writeFileSync('output.json', bson_1.EJSON.stringify(data, { relaxed: false }, 2));
            }
            return { data };
        }
        throw new customErrors_1.FileNameMustBeString('argv.schema must be a string');
    });
}
exports.generateDataFromSchema = generateDataFromSchema;
function readSchema(path) {
    try {
        const schemaJson = fs_1.default.readFileSync(path, 'utf-8');
        return JSON.parse(schemaJson);
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            throw new customErrors_1.JsonParseError(`File can't be parsed as a JSON: ${error.message}`);
        }
        else {
            throw error;
        }
    }
}
exports.readSchema = readSchema;
function generateString() {
    return faker_1.faker.string.alpha({ length: { min: 5, max: 10 } });
}
function generateInt() {
    return faker_1.faker.number.int({ min: 4, max: 10 });
}
function handleSwitch(data) {
    switch (data.bsonType) {
        case 'objectId':
            return new bson_1.ObjectId();
        case 'string':
            return generateString();
        case 'int':
            return generateInt();
        case 'bool':
            return faker_1.faker.datatype.boolean();
        case 'date':
            return faker_1.faker.date.anytime();
        case 'double':
            return faker_1.faker.number.float({ min: 10, max: 100, multipleOf: 0.02 });
        case 'long':
            return faker_1.faker.number.float(3);
        case 'decimal':
            return faker_1.faker.number.int({ max: 100 });
        case 'uuid':
            return faker_1.faker.string.uuid();
        case 'timestamp':
            return new Date(faker_1.faker.date.anytime()).getTime();
        case 'array':
            return generateArrayData(data.items);
        case 'object':
            return generateData(data)[0];
        case 'binData':
            return faker_1.faker.number.binary();
        default:
            return null;
    }
}
function generateArrayData(itemSchema) {
    const arrayData = [];
    const arrayLength = faker_1.faker.number.int({ min: 2, max: 10 });
    // Check if the items in the array are of type 'object'
    if (itemSchema.bsonType === 'object') {
        for (let i = 0; i < arrayLength; i++) {
            arrayData.push(generateData(itemSchema)[0]);
        }
    }
    else {
        // If the items are not objects, generate data based on their type
        for (let i = 0; i < arrayLength; i++) {
            arrayData.push(handleSwitch(itemSchema));
        }
    }
    return arrayData;
}
function generateData(schema, nDocuments = 1) {
    // Generate data based on schema using faker
    // This is a simplified example, you'll need to handle different data types and nested objects
    const data = []; // Initialize data as an array
    for (let i = 0; i < nDocuments; i++) {
        const document = {}; // Create a new document for each iteration
        if (!schema.properties)
            throw new customErrors_1.PropertiesMissingParseError('Schema must have a `properties` root object key');
        for (const key in schema.properties) {
            const property = schema.properties[key];
            document[key] = handleSwitch(property); // Generate data for each property in the schema
        }
        data.push(document); // Add the generated document to the data array
    }
    return data;
}
exports.generateData = generateData;
