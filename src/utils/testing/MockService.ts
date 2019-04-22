/**
 * @module services
 */
import { AppDatabase } from "../AppDatabase";
import { MockDatabase } from "./MockDatabase";

export abstract class MockService {

    /**
     * AppDatabase mock.
     *
     * Everything works except for `execute()`. If you need to add or remove data to a backing database,
     * use `this.mockDb`.
     */
    protected readonly appDb: AppDatabase;

    /**
     * A in-memory database for storing persistence data during tests.
     */
    protected readonly mockDb: MockDatabase;

    public constructor(db: AppDatabase) {
        this.appDb = db;
        this.mockDb = (db as any).db;
    }

}
