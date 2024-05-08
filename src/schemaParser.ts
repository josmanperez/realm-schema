import fs from 'fs';
import { faker }  from '@faker-js/faker';
import { ObjectId } from 'bson';

export function readSchema(path: string) {
  const schemaJson = fs.readFileSync(path, 'utf-8');
  return JSON.parse(schemaJson);
}

function generateStringData() {
  return faker.string.alpha({ length: { min: 5, max: 5*100*Math.random() } });
}

function generateArrayData(itemSchema: any) {
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
      switch (itemSchema.bsonType) {
        case 'objectId':
          arrayData.push(new ObjectId());
          break;
        case 'string':
          arrayData.push(generateStringData());
          break;
        case 'int':
          arrayData.push(faker.number.int());
          break;
        case 'bool':
          arrayData.push(faker.datatype.boolean());
          break;
        default:
          arrayData.push(null);
      }
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
    switch (property.bsonType) {
      case 'objectId':
        data[key] = new ObjectId();
        break;
      case 'string':
        data[key] = generateStringData();
        break;
      case 'int':
        data[key] = faker.number.int();
        break;
      case 'bool':
        data[key] = faker.datatype.boolean();
        break;
      case 'array':
        data[key] = generateArrayData(property.items);
        break;
      case 'object':
        data[key] = generateData(property);
        break;
      default:
        data[key] = null;
    }
  }
  return data;
}