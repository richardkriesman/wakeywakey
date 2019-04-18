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

    private data: { [table: string]: MockTable };

    /**
     * Inserts a new row into the {@link MockDatabase}.
     *
     * @param table Name of the table
     * @param row Row to insert
     */
    public insert(table: string, row: any): any {
        this.createTable(table);
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
    public select(table: string, id: number): MockRow {
        if (!this.data.hasOwnProperty(table)) {
            return null;
        }

        return this.data[table][id] || null;
    }

    /**
     * Deletes a row from the {@link MockDatabase}.
     *
     * @param table Name of the table
     * @param row Row to delete
     */
    public delete(table: string, row: any): void {
        this.createTable(table);
        delete this.data[table][row.id];
    }

    /**
     * Replaces a row in the {@link MockDatabase}.
     *
     * @param table Name of the table
     * @param row Row to replace
     */
    public update(table: string, row: any): void {
        this.createTable(table);
        this.data[table][row.id] = row;
        return row;
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
     * Creates a new "table" if one does not exist.
     *
     * @param name Name of the table to create
     */
    private createTable(name: string): void {
        if (!this.data.hasOwnProperty(name)) {
            this.data[name] = {
                nextId: 1
            };
        }
    }
}
