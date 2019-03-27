import {SQLite} from "expo";
import {AppTransaction} from "./AppTransaction";

const DATABASE_NAME: string = "app";

export class AppDatabase {

    private db: Database;

    public constructor() {
        this.db = SQLite.openDatabase(DATABASE_NAME);
    }

    /**
     * Starts a new read-only transaction.
     *
     * @param callback A callback in which the transaction's statements will be executed.
     */
    public readTransaction(callback: (transaction: AppTransaction) => Promise<void>): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.db.readTransaction(transaction => { // we've got our transaction, pass back an AppTransaction
                callback(new AppTransaction(transaction))
                    .catch(reason => { // transaction callback failed, reject
                        reject(reason);
                    })
            }, error => { // error occurred, reject
                reject(error);
            }, () => { // transaction completed, resolve the promise
                resolve();
            });
        });
    }

}