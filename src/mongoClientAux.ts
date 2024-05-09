import { MongoClient } from 'mongodb';

export class MongoDBClient {
  private client: MongoClient;
  private db: string;
  private col: string;

  constructor(uri: string, db: string, col: string) {
    this.client = new MongoClient(uri);
    this.db = db;
    this.col = col;
  }

  private async connect() {
    await this.client.connect();
  }

  private async disconnect() {
    await this.client.close();
  }

  private async insertMany(dbName: string, colName: string, documents: any[]) {
    const db = this.client.db(dbName);
    const collection = db.collection(colName);
    await collection.insertMany(documents);
  }

  private async dropCollection(dbName: string, colName: string) {
    const db = this.client.db(dbName);
    if (await db.collection(colName).countDocuments({}) > 0) {
      await db.collection(colName).drop();
    }
  }

  public async insertDocuments(documents: any[]) {
    try {
      await this.connect();
      await this.dropCollection(this.db, this.col);
      await this.insertMany(this.db, this.col, documents);
      await this.disconnect();
    } catch (error: any) {
      throw new Error(`Error inserting documents: ${error.message}`);
    }

  }
}