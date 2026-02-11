import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

if (!uri || !dbName) {
  throw new Error("MONGODB_URI or MONGODB_DB_NAME is not defined");
}

type MongoCache = {
  client: MongoClient | null;
  db: Db | null;
  promise: Promise<MongoClient> | null;
};

const globalForMongo = globalThis as unknown as {
  mongoCache?: MongoCache;
};

const mongoCache: MongoCache = globalForMongo.mongoCache ?? {
  client: null,
  db: null,
  promise: null,
};

export async function getMongoDb(): Promise<Db> {
  // Fast path: DB already initialized
  if (mongoCache.db) {
    return mongoCache.db;
  }

  // If no connection attempt exists, start one
  if (!mongoCache.promise) {
    const client = new MongoClient(uri!);
    mongoCache.promise = client.connect();
  }

  // Await the shared connection promise
  mongoCache.client = await mongoCache.promise;

  // Select DB exactly once
  mongoCache.db = mongoCache.client.db(dbName);

  return mongoCache.db;
}

globalForMongo.mongoCache = mongoCache;
