import { AppDatabase } from "./AppDatabase";

export abstract class Model {

    protected db: AppDatabase;

    protected constructor(db: AppDatabase) {
        this.db = db;
    }

}
