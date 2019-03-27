/**
 * A database handle that executes all queries in the context of a transaction
 */
export class AppTransaction {

    private transaction: SQLTransaction;

    public constructor(transaction: SQLTransaction) {
        this.transaction = transaction;
    }

    /**
     * Executes a SQL query, returning a {@link Promise} that resolves to a {@link SQLResultSet}.
     *
     * @param sql The SQL query to execute
     * @param args An array of values to substitute for "?" placeholders in the SQL statement.
     */
    public execute(sql: DOMString, args?: ObjectArray): Promise<SQLResultSet> {
        return new Promise<SQLResultSet>((resolve, reject) => {
            this.transaction.executeSql(sql, args ? args : [], (transaction, resultSet) => {
                resolve(resultSet);
            }, (transaction, error) => {
                reject(error);
                return true;
            });
        });
    }

}
