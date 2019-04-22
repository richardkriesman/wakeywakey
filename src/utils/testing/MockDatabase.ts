import { AppDatabase } from "../AppDatabase";

interface MockTable {
    nextId: number;
    [id: number]: MockRow;
}

export interface MockRow {
    id: number;
    [col: string]: any;
}

/**
 * An in-memory data structure used for storing and retrieving data for mock models.
 */
export class MockDatabase {

    public readonly appDb: AppDatabase;

    private readonly data: { [table: string]: MockTable } = {};

    public constructor(appDb: AppDatabase) {
        this.appDb = appDb;
    }

    /**
     * Creates a new "table" if one does not exist.
     *
     * @param name Name of the table to create
     */
    public createTable(name: string): void {
        if (!this.data.hasOwnProperty(name)) {
            this.data[name] = {
                nextId: 1
            };
        }
    }

    /**
     * Deletes a row from the {@link MockDatabase}.
     *
     * @param table Name of the table
     * @param row Row to delete
     */
    public delete(table: string, row: any): void {
        if (!this.hasTable(table)) {
            throw new Error(`Table ${table} does not exist`);
        }

        delete this.data[table][row.id];
    }

    /**
     * Looks to see if the table is in the mock database.
     *
     * @param name Name of the table to look for
     */
    public hasTable(name: string): boolean {
        return this.data.hasOwnProperty(name);
    }

    /**
     * Inserts a new row into the {@link MockDatabase}.
     *
     * @param table Name of the table
     * @param row Row to insert
     */
    public insert(table: string, row: any): MockRow {
        if (!this.hasTable(table)) {
            throw new Error(`Table ${table} does not exist`);
        }

        const id: number = this.data[table].nextId++;
        this.data[table][id] = {
            id,
            ...row
        };
        return this.data[table][id];
    }

    /**
     * Select a row by ID from the {@link MockDatabase}.
     *
     * @param table Table to select from
     * @param id ID of row to select
     */
    public select(table: string, id: number): MockRow|undefined {
        if (!this.hasTable(table)) {
            throw new Error(`Table ${table} does not exist`);
        }

        return this.data[table][id] || undefined;
    }

    /**
     * Selects all rows from a table.
     *
     * @param table Table to select from
     */
    public selectAll(table: string): MockRow[] {
        const rows: MockRow[] = [];
        for (const key of Object.keys(this.data[table])) {
            if (key !== "nextId") {
                rows.push(this.data[table][key as any]);
            }
        }
        return rows;
    }

    /**
     * Replaces a row in the {@link MockDatabase}.
     *
     * @param table Name of the table
     * @param row Row to replace
     */
    public update(table: string, row: any): MockRow {
        if (!this.hasTable(table)) {
            throw new Error(`Table ${table} does not exist`);
        }

        this.data[table][row.id] = row;
        return row;
    }

}
