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
const path_1 = __importDefault(require("path"));
const schemaParser_1 = require("./schemaParser");
const fs_1 = __importDefault(require("fs"));
const bson_1 = require("bson");
describe('generateDataFromSchema', () => {
    let invalidFilePath;
    let validFilePath;
    beforeEach(() => {
        jest.clearAllMocks();
        invalidFilePath = path_1.default.join(__dirname, 'invalidTemp.json');
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
        fs_1.default.writeFileSync(invalidFilePath, JSON.stringify(mockSchema));
    });
    afterEach(() => {
        // Delete the temporary files
    });
    it('should throw an error for an invalid schema file', () => __awaiter(void 0, void 0, void 0, function* () {
        // Act & Assert
        yield expect((0, schemaParser_1.generateDataFromSchema)({ schema: invalidFilePath }, 1, false)).rejects.toThrow();
        fs_1.default.unlinkSync(invalidFilePath);
    }));
    it('should validate the data with the correct Schema', () => __awaiter(void 0, void 0, void 0, function* () {
        validFilePath = path_1.default.join(__dirname, 'validTemp.json');
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
        fs_1.default.writeFileSync(validFilePath, JSON.stringify(validMockSchema));
        const result = yield (0, schemaParser_1.generateDataFromSchema)({ schema: validFilePath }, 1, false);
        if (result) {
            // Assert
            expect(result).toHaveProperty('data');
            expect(result.data).toHaveLength(1);
            expect(result.data[0]).toHaveProperty('_id', expect.any(bson_1.ObjectId));
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
            fs_1.default.unlinkSync(validFilePath);
        }
    }));
});
