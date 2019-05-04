import * as React from "react";

import { StyleSheet, View } from "react-native";
import { BooleanPreference } from "../../components/AppSettingsScreen/BooleanPreference";
import { TouchPreference } from "../../components/AppSettingsScreen/TouchPreference";
import { ListHeader } from "../../components/list/ListHeader";
import { PreferenceService } from "../../services/PreferenceService";
import * as Log from "../../utils/Log";
import { BottomTabBarIcon, Title } from "../../utils/screen/NavigationOptions";
import { UIScreen } from "../../utils/screen/UIScreen";

export interface AppSettingsScreenState {
    loading: boolean;
    twentyFourHour: boolean;
}

@Title("Preferences")
@BottomTabBarIcon("ios-cog")
export class AppSettingsScreen extends UIScreen<{}, AppSettingsScreenState> {

    private static onPasscodeChanged(): void {
        Log.info("AppSettingsScreen", "passcode changed?");
    }

    public componentWillMount(): void {
        this.readAll().then((newState: AppSettingsScreenState) => {
            this.updateState(newState);
        });
    }

    public renderContent(): React.ReactNode {
        return (
            <View style={styles.viewScroller}>
                <ListHeader title="Preferences" />

                <BooleanPreference
                    disabled={this.state.loading}
                    value={this.state.twentyFourHour}
                    title="24-hour clock"
                    onValueChange={this.on24hTimeChanged.bind(this)}
                />

                <TouchPreference
                    disabled={this.state.loading}
                    title="Change passcode"
                    onValueChange={AppSettingsScreen.onPasscodeChanged.bind(this)}
                    onPress={this.changePasscode.bind(this)}
                    rightIcon={{ name: "arrow-forward" }}
                />

                <TouchPreference
                    disabled={this.state.loading}
                    title="About WakeyWakey"
                    onPress={() => this.present("About")}
                    rightIcon={{ name: "info" }}
                />
            </View>
        );
    }

    private async readAll(): Promise<AppSettingsScreenState> {
        this.updateState({ loading: true });

        const pref: PreferenceService = this.getService(PreferenceService);

        return {
            loading: false,
            twentyFourHour: await pref.get24HourTime()
        };
    }

    private async set24hTime(enabled: boolean): Promise<void> {
        await this.getService(PreferenceService).set24HourTime(enabled);
        this.updateState({ twentyFourHour: enabled });
    }

    private on24hTimeChanged(value: boolean): void {
        this.set24hTime(value).then(() => {
            this.updateState({ twentyFourHour: value });
        });
    }

    private changePasscode(): void {
        this.present("PasscodeChange");
    }
}

const styles = StyleSheet.create({
    footer: {
        flex: 1,
        justifyContent: "flex-end"
    },
    viewScroller: {
        flex: 1
    }
});
