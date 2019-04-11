import { AppDatabase } from "./AppDatabase";

export abstract class Model {

    protected db: AppDatabase;

    protected _id: number;

    protected constructor(db: AppDatabase) {
        this.db = db;
    }

    public get id(): number {
        return this._id;
    }

}
