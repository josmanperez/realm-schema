import path from 'path';
import { generateDataFromSchema, readSchema, generateData } from './schemaParser';
import fs from 'fs';
import { ObjectId } from 'bson';

describe('generateDataFromSchema', () => {
  let invalidFilePath: string;
  let validFilePath: string;

  beforeEach(() => {
    jest.clearAllMocks();
    invalidFilePath = path.join(__dirname, 'invalidTemp.json');
    const mockSchema = {
      "propertie": {
        "_id": {
          "bsonType": "objectId"
        },
        "eventId": {
          "bsonType": "objectId"
        },
        "location": {
          "bsonType": "string"
        }
      }
    };
    fs.writeFileSync(invalidFilePath, JSON.stringify(mockSchema));
  });

  afterEach(() => {
    // Delete the temporary files
  });

  it('should throw an error for an invalid schema file', async () => {
    // Act & Assert
    await expect(generateDataFromSchema({ schema: invalidFilePath }, 1, false)).rejects.toThrow();
    fs.unlinkSync(invalidFilePath);
  });

  it('should validate the data with the correct Schema', async () => {
    validFilePath = path.join(__dirname, 'validTemp.json');
    const validMockSchema = {
      "properties": {
        "_id": {
          "bsonType": "objectId"
        },
        "string": {
          "bsonType": "string"
        },
        "integer": {
          "bsonType": "int"
        },
        "boolean": {
          "bsonType": "bool"
        },
        "float": {
          "bsonType": "double"
        },
        "long": {
          "bsonType": "long"
        },
        "uuid": {
          "bsonType": "uuid"
        },
        "binary": {
          "bsonType": "binData"
        },
        "null": {
          "bsonType": "unknown"
        },
        "date": {
          "bsonType": "date"
        },
        "timestamp": {
          "bsonType": "timestamp"
        }
      }
    };
    fs.writeFileSync(validFilePath, JSON.stringify(validMockSchema));
    const result = await generateDataFromSchema({ schema: validFilePath }, 1, false);
    if (result) {
      // Assert
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toHaveProperty('_id', expect.any(ObjectId));
      expect(result.data[0]).toHaveProperty('string', expect.any(String));
      expect(result.data[0]).toHaveProperty('integer', expect.any(Number));
      expect(result.data[0]).toHaveProperty('boolean', expect.any(Boolean));
      expect(result.data[0]).toHaveProperty('float', expect.any(Number));
      expect(result.data[0]).toHaveProperty('long', expect.any(Number));
      expect(result.data[0]).toHaveProperty('uuid', expect.any(String));
      expect(result.data[0]).toHaveProperty('binary', expect.any(String));
      expect(result.data[0]).toHaveProperty('null', null);
      expect(result.data[0]).toHaveProperty('date', expect.any(Date));
      expect(result.data[0]).toHaveProperty('timestamp', expect.any(Number));
      fs.unlinkSync(validFilePath);
    }
  });
});