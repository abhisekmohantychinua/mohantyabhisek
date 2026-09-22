import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const connectMock = vi.fn();
const dbMock = vi.fn();

// eslint-disable-next-line @typescript-eslint/naming-convention
const MongoClientMock = vi.fn(function () {
  return {
    connect: connectMock,
  };
});

vi.mock("mongodb", () => ({
  MongoClient: MongoClientMock,
}));

describe("mongodb", () => {
  const originalMongoUri = process.env.MONGODB_URI;
  const originalMongoDbName = process.env.MONGODB_DB_NAME;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    delete (globalThis as { mongoCache?: unknown }).mongoCache;
  });

  afterEach(() => {
    process.env.MONGODB_URI = originalMongoUri;
    process.env.MONGODB_DB_NAME = originalMongoDbName;

    delete (globalThis as { mongoCache?: unknown }).mongoCache;
  });

  describe("module initialization", () => {
    test("throws when MONGODB_URI is missing", async () => {
      delete process.env.MONGODB_URI;
      process.env.MONGODB_DB_NAME = "test-db";

      await expect(import("./mongodb")).rejects.toThrow(
        "MONGODB_URI or MONGODB_DB_NAME is not defined",
      );
    });

    test("throws when MONGODB_DB_NAME is missing", async () => {
      process.env.MONGODB_URI = "mongodb://localhost:27017";
      delete process.env.MONGODB_DB_NAME;

      await expect(import("./mongodb")).rejects.toThrow(
        "MONGODB_URI or MONGODB_DB_NAME is not defined",
      );
    });
  });

  describe("getMongoDb", () => {
    test("creates a connection and returns the database on first call", async () => {
      process.env.MONGODB_URI = "mongodb://localhost:27017";
      process.env.MONGODB_DB_NAME = "test-db";

      const database = { collection: vi.fn() };

      const client = {
        db: dbMock.mockReturnValue(database),
      };

      connectMock.mockResolvedValue(client);

      const { getMongoDb } = await import("./mongodb");

      const result = await getMongoDb();

      expect(result).toBe(database);

      expect(MongoClientMock).toHaveBeenCalledTimes(1);
      expect(MongoClientMock).toHaveBeenCalledWith("mongodb://localhost:27017");

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(dbMock).toHaveBeenCalledWith("test-db");
    });

    test("returns the cached database on subsequent calls", async () => {
      process.env.MONGODB_URI = "mongodb://localhost:27017";
      process.env.MONGODB_DB_NAME = "test-db";

      const database = { collection: vi.fn() };

      const client = {
        db: dbMock.mockReturnValue(database),
      };

      connectMock.mockResolvedValue(client);

      const { getMongoDb } = await import("./mongodb");

      const firstResult = await getMongoDb();
      const secondResult = await getMongoDb();

      expect(firstResult).toBe(secondResult);

      expect(MongoClientMock).toHaveBeenCalledTimes(1);
      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(dbMock).toHaveBeenCalledTimes(1);
    });

    test("reuses the same connection promise for concurrent calls", async () => {
      process.env.MONGODB_URI = "mongodb://localhost:27017";
      process.env.MONGODB_DB_NAME = "test-db";

      const database = { collection: vi.fn() };

      const client = {
        db: dbMock.mockReturnValue(database),
      };

      let resolveConnection!: (value: typeof client) => void;

      connectMock.mockReturnValue(
        new Promise<typeof client>((resolve) => {
          resolveConnection = resolve;
        }),
      );

      const { getMongoDb } = await import("./mongodb");

      const firstCall = getMongoDb();
      const secondCall = getMongoDb();

      expect(MongoClientMock).toHaveBeenCalledTimes(1);
      expect(connectMock).toHaveBeenCalledTimes(1);

      resolveConnection(client);

      const [firstResult, secondResult] = await Promise.all([
        firstCall,
        secondCall,
      ]);

      expect(firstResult).toBe(database);
      expect(secondResult).toBe(database);
    });

    test("uses an existing global cache", async () => {
      process.env.MONGODB_URI = "mongodb://localhost:27017";
      process.env.MONGODB_DB_NAME = "test-db";

      const database = { collection: vi.fn() };

      (
        globalThis as {
          mongoCache?: {
            client: null;
            db: typeof database;
            promise: null;
          };
        }
      ).mongoCache = {
        client: null,
        db: database,
        promise: null,
      };

      const { getMongoDb } = await import("./mongodb");

      const result = await getMongoDb();

      expect(result).toBe(database);

      expect(MongoClientMock).not.toHaveBeenCalled();
      expect(connectMock).not.toHaveBeenCalled();
    });
  });
});
