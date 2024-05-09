import fs from 'fs';
import { faker }  from '@faker-js/faker';
import { ObjectId } from 'bson';

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
      return generateData(data);
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
      arrayData.push(generateData(itemSchema));
    }
  } else {
    // If the items are not objects, generate data based on their type
    for (let i = 0; i < arrayLength; i++) {
      arrayData.push(handleSwitch(itemSchema));
    }
  }

  return arrayData;
}

export function generateData(schema: any) {
  // Generate data based on schema using faker
  // This is a simplified example, you'll need to handle different data types and nested objects
  const data: { [key: string]: any } = {}; // Add type annotation to specify string keys and any values
  for (const key in schema.properties) {
    const property = schema.properties[key];
    data[key] = handleSwitch(property);
  }
  return data;
}