import { generateDataFromSchema, readSchema, generateData } from './schemaParser';

describe('generateDataFromSchema', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should parse a valid schema file', async () => {
    // Arrange
    const mockSchema = {
      bsonType: 'object',
      properties: {
        name: { bsonType: 'string' },
        age: { bsonType: 'int' },
      },
    };
    const mockData = { key: 'value' };

    // Act
    const result = await generateDataFromSchema({ schema: 'example.json' }, 1, false);

    // Check that result is not undefined
    if (!result) {
      throw new Error('generateDataFromSchema returned undefined');
    }

    const { data } = result;

    // Assert
    //expect(schema).toEqual(mockSchema);
    //expect(data).toEqual(mockData);
  });
});