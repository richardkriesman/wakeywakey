import {Service} from "../Service";
import {EmitterSet} from "../watcher";
import {Model} from "../Model";

export class AppDatabase {

    public static get initCount(): number {
        return 0;
    }

    public static async init(): Promise<AppDatabase> {
        return new AppDatabase();
    }

    /**
     * Stores mock preference data
     */
    public mockPreferences: { [key: string]: string } = {};

    private services: Map<string, Service> = new Map();
    private emitters: Map<string, EmitterSet<any>> = new Map();

    private constructor() {}

    public async doesTableExist(name: string): Promise<boolean> {
        throw new Error("Implement this mock function");
    }

    public getEmitterSet<T extends Model>(name: string): EmitterSet<T> {
        let emitters: EmitterSet<T>|undefined = this.emitters.get(name);
        if (!emitters) {
            emitters = new EmitterSet<T>();
            this.emitters.set(name, emitters);
        }
        return emitters;
    }

    public async getPreference(key: string): Promise<string|null> {
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

    public execute(sql: DOMString, args: ObjectArray = []): Promise<SQLResultSet> {
        return new Promise<SQLResultSet>((resolve, reject) => {
            reject(new Error("Implement this mock function"));
        });
    }

    public async setPreference(key: string, value: string): Promise<void> {
        this.mockPreferences[key] = value;
    }

}
