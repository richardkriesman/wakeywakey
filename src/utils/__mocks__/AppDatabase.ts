import { Model } from "../Model";
import { Service } from "../service/Service";
import { MockDatabase } from "../testing/MockDatabase";
import { EmitterSet } from "../watcher";

interface MockPreferences {
    [key: string]: string;
}

export class AppDatabase {

    public static get initCount(): number {
        return AppDatabase._initCount;
    }

    public static async init(): Promise<AppDatabase> {
        return new AppDatabase();
    }

    private static _initCount = 0;

    public readonly db: MockDatabase = new MockDatabase(this as any);

    private mockPreferences: MockPreferences = {};
    private services: Map<string, Service> = new Map();
    private emitters: Map<string, EmitterSet<any>> = new Map();

    private constructor() {
        this.db.createTable("schedule");
        this.db.createTable("alarm");
    }

    public async doesTableExist(name: string): Promise<boolean> {
        return this.db.hasTable(name);
    }

    public async execute(sql: DOMString, args: ObjectArray = []): Promise<SQLResultSet> {
        throw new Error("AppDatabase.execute() cannot be mocked. Use the MockDatabase for manipulating persistence " +
            "data.");
    }

    public getEmitterSet<T extends Model>(name: string): EmitterSet<T> {
        let emitters: EmitterSet<T> | undefined = this.emitters.get(name);
        if (!emitters) {
            emitters = new EmitterSet<T>();
            this.emitters.set(name, emitters);
        }
        return emitters;
    }

    public async getPreference(key: string): Promise<string | null> {
        if (this.mockPreferences.hasOwnProperty(key)) {
            return this.mockPreferences[key];
        } else {
            return null;
        }
    }

    public getService<T extends Service>(service: new(db: AppDatabase) => T): T {
        if (!this.services.has(service.name)) {
            this.services.set(service.name, new service(this));
        }
        return this.services.get(service.name) as any;
    }

    public async setPreference(key: string, value: string): Promise<void> {
        this.mockPreferences[key] = value;
    }

}
