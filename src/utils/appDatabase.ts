import {SQLite} from "expo";

const DATABASE_NAME: string = "app";

export class AppDatabase {

    private db: Database;

    public constructor() {
        this.db = SQLite.openDatabase(DATABASE_NAME);
    }

}
