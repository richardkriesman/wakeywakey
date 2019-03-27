import {Service} from "../db/Service";

const PREF_NAME = "passcode";

export class PasscodeService extends Service {

    /**
     * Replaces the user's passcode with a new passcode. The new passcode must be exactly 4 digits.
     *
     * @param passcode The new passcode.
     */
    public setPasscode(passcode: string): Promise<void> {
        return this.db.setPreference(PREF_NAME, passcode);
    }

    /**
     * Determines whether the provided passcode matches the set passcode.
     *
     * @param attempt The passcode to test.
     */
    public async verifyPasscode(attempt: string): Promise<boolean> {
        return (await this.db.getPreference(PREF_NAME)) === attempt;
    }

}
