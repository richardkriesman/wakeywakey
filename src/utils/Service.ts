import {AppDatabase} from "./AppDatabase";

export abstract class Service {

    protected db: AppDatabase;

    public constructor(db: AppDatabase) {
        this.db = db;
    }

}
