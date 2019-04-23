import * as React from "react";

import { StyleSheet, Text, View } from "react-native";
import { BooleanPreference } from "../../components/AppSettingsScreen/BooleanPreference";
import Colors from "../../constants/Colors";
import { PreferencesService } from "../../services/PreferencesService";
import { BottomTabBarIcon, Title } from "../../utils/screen/NavigationOptions";
import { UIScreen } from "../../utils/screen/UIScreen";

export interface AppSettingsScreenState {
    loading: boolean;

    twentyFourHour: boolean;
}

@Title("Preferences")
@BottomTabBarIcon("ios-cog")
export class AppSettingsScreen extends UIScreen<{}, AppSettingsScreenState> {

    public componentWillMount(): void {
        this.readAll().then((newState: AppSettingsScreenState) => {
            this.updateState(newState);
        });
    }

    public renderContent(): React.ReactNode {
        return (
            <View style={styles.viewScroller}>
                <Text style={styles.textSectionHeader}>Preferences</Text>

                <BooleanPreference
                    disabled={this.state.loading}
                    value={this.state.twentyFourHour}
                    title="24-Hour Clock"
                    onValueChange={this.on24hTimeChanged.bind(this)}/>
            </View>
        );
    }

    private updateState(newValues: object, cb?: () => void): void {
        const temp = Object.assign({}, this.state);
        const newState = Object.assign(temp, newValues);
        this.setState(newState, cb);
    }

    private async readAll(): Promise<AppSettingsScreenState> {
        this.updateState({ loading: true });

        const pref: PreferencesService = this.getService(PreferencesService);

        return {
            loading: false,
            twentyFourHour: await pref.get24HourTime()
        };
    }

    private async set24hTime(enabled: boolean): Promise<void> {
        await this.getService(PreferencesService).set24HourTime(enabled);
        this.updateState({ twentyFourHour: enabled });
    }

    private on24hTimeChanged(value: boolean): void {
        this.set24hTime(value).then(() => {
            this.updateState({ twentyFourHours: value });
        });
    }

}

const styles = StyleSheet.create({
    footer: {
        flex: 1,
        justifyContent: "flex-end"
    },
    textSectionHeader: {
        color: Colors.subheaderColor,
        fontSize: 17,
        fontWeight: "600",
        marginBottom: 10
    },
    viewScroller: {
        flex: 1,
        padding: 20
    }
});
