/**
 * @module services
 */

import { AppDatabase } from "../AppDatabase";

export interface ServiceStaticBase {
    SERVICE_NAME: string;
    new(db: AppDatabase): Service;
}

export abstract class Service {

    protected db: AppDatabase;

    public constructor(db: AppDatabase) {
        this.db = db;
    }

}
