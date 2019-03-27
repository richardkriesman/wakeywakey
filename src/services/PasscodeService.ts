import {Service} from "./Service";

export class PasscodeService extends Service {

    /**
     * Replaces the user's passcode with a new passcode. The new passcode must be exactly 4 digits.
     *
     * @param passcode The new passcode.
     */
    public async setPasscode(passcode: string): Promise<void> {
        await this.db.readTransaction(async transaction => {
            await transaction.execute(`
                
            `);
        });
    }

}
