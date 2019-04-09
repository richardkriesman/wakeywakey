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

    private constructor() {}

    public async doesTableExist(name: string): Promise<boolean> {
        throw new Error("Implement this mock function");
    }

    public async getPreference(key: string): Promise<string|null> {
        if (this.mockPreferences.hasOwnProperty(key)) {
            return this.mockPreferences[key];
        } else {
            return null;
        }
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
