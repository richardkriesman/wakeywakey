import {AppDatabase} from "../utils/AppDatabase";

export abstract class Service {

    protected db: AppDatabase;

    protected constructor(db: AppDatabase) {
        this.db = db;
    }

}
