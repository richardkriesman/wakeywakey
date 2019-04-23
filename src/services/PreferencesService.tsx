import { Service } from "../utils/Service";

export class PreferencesService extends Service {

    private static readonly KEY_24HOUR: string = "24_hour";

    /**
     * Set 24-hour time preference.
     *
     * @param enabled Whether 24h is enabled
     */
    public set24HourTime(enabled: boolean): Promise<void> {
        return this.db.setPreference(PreferencesService.KEY_24HOUR, JSON.stringify(enabled));
    }

    /** Get 24-hour time preference. Set it to false if it does not exist yet. */
    public async get24HourTime(): Promise<boolean> {
        const value: string = await this.db.getPreference(PreferencesService.KEY_24HOUR);

        // if DB has no 24-hour time preference set, set it to false and return it
        if (!value) {
            await this.set24HourTime(false);
            return false;
        }

        return JSON.parse(value);
    }

}
