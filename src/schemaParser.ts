import fs from 'fs';
import { faker } from '@faker-js/faker';
import { ObjectId, EJSON } from 'bson';
import { Logger, LogType } from './Logger';

export async function generateDataFromSchema(argv: any, nDocuments: number, writeToFile: boolean = false) {
  if (typeof argv.schema === 'string') {
    const schema = await readSchema(argv.schema);
    const data = await generateData(schema, nDocuments);
    Logger.log(LogType.trace, EJSON.stringify(data));
    if (writeToFile) {
      fs.writeFileSync('output.json', EJSON.stringify(data, { relaxed: false }, 2));
    }
    return { data };
  }
}

export function readSchema(path: string) {
  const schemaJson = fs.readFileSync(path, 'utf-8');
  return JSON.parse(schemaJson);
}

function generateString() {
  return faker.string.alpha({ length: { min: 5, max: 10 } });
}

function generateInt() {
  return faker.number.int({ min: 4, max: 10 })
}

function handleSwitch(data: any) {
  switch (data.bsonType) {
    case 'objectId':
      return new ObjectId();
    case 'string':
      return generateString();
    case 'int':
      return generateInt();
    case 'bool':
      return faker.datatype.boolean();
    case 'date':
      return faker.date.anytime();
    case 'double':
      return faker.number.float({ min: 10, max: 100, multipleOf: 0.02 });
    case 'long':
      return faker.number.float(3);
    case 'decimal':
      return faker.number.int({ max: 100 });
    case 'uuid':
      return faker.string.uuid();
    case 'timestamp':
      return new Date(faker.date.anytime()).getTime();
    case 'array':
      return generateArrayData(data.items);
    case 'object':
      return generateData(data)[0];
    case 'binData':
      return faker.number.binary();
    default:
      return null;
  }
}

function generateArrayData(itemSchema: any): any[] {
  const arrayData = [];
  const arrayLength = faker.number.int({ min: 2, max: 10 });

  // Check if the items in the array are of type 'object'
  if (itemSchema.bsonType === 'object') {
    for (let i = 0; i < arrayLength; i++) {
      arrayData.push(generateData(itemSchema)[0]);
    }
  } else {
    // If the items are not objects, generate data based on their type
    for (let i = 0; i < arrayLength; i++) {
      arrayData.push(handleSwitch(itemSchema));
    }
  }

  return arrayData;
}

export function generateData(schema: any, nDocuments = 1) {
  // Generate data based on schema using faker
  // This is a simplified example, you'll need to handle different data types and nested objects
  const data: any[] = []; // Initialize data as an array
  for (let i = 0; i < nDocuments; i++) {
    const document: { [key: string]: any } = {}; // Create a new document for each iteration
    for (const key in schema.properties) {
      const property = schema.properties[key];
      document[key] = handleSwitch(property); // Generate data for each property in the schema
    }
    data.push(document); // Add the generated document to the data array
  }
  return data;
}