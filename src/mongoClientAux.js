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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBClient = void 0;
const mongodb_1 = require("mongodb");
class MongoDBClient {
    constructor(uri, db, col) {
        this.client = new mongodb_1.MongoClient(uri);
        this.db = db;
        this.col = col;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.connect();
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.close();
        });
    }
    insertMany(dbName, colName, documents) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.client.db(dbName);
            const collection = db.collection(colName);
            yield collection.insertMany(documents);
        });
    }
    dropCollection(dbName, colName) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.client.db(dbName);
            if ((yield db.collection(colName).countDocuments({})) > 0) {
                yield db.collection(colName).drop();
            }
        });
    }
    insertDocuments(documents) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connect();
                yield this.dropCollection(this.db, this.col);
                yield this.insertMany(this.db, this.col, documents);
                yield this.disconnect();
            }
            catch (error) {
                throw new Error(`Error inserting documents: ${error.message}`);
            }
        });
    }
}
exports.MongoDBClient = MongoDBClient;
