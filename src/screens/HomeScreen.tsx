/**
 * @module screens
 */

import { KeepAwake, SplashScreen } from "expo";
import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationScreenProps } from "react-navigation";

import { EmptyView } from "../components/EmptyView";
import {
    Clock,
    HomeScreenAlarmState,
    HomeScreenAlarmStateType,
    SlideUpIndicator,
    SnoozeButton
} from "../components/HomeScreen";
import { AlarmState } from "../components/HomeScreen/AlarmState";
import { InactivityHandler } from "../components/InactivityHandler";
import { PasscodeService } from "../services/PasscodeService";
import { PreferencesService } from "../services/PreferencesService";
import { AlarmEvent, TimerService } from "../services/TimerService";
import * as Log from "../utils/Log";
import { NoHeader, UIScreen } from "../utils/screen";
import { Time } from "../utils/Time";

/**
 * Home screen properties. Navigation by Miika, intersection type by Richard Kriesman.
 * @author Miika Raina, Richard Kriesman, Shawn Lutch
 */
export interface HomeScreenProps {
    initialMessageText: string;
}

/**
 * Home screen state
 * @author Richard Kriesman
 */
interface HomeScreenState {
    alarmState: HomeScreenAlarmState;
    loaded: boolean;
    messageText: string;
    twentyFourHour: boolean;
}

/**
 * The home screen, where the current status, current time, and decorations will show.
 * @author Shawn Lutch, Miika Raina
 */
@NoHeader
export default class HomeScreen extends UIScreen<HomeScreenProps, HomeScreenState> {

    public static defaultInitialMessageText: string = "Hello, world!";

    private static onRefreshError(err: any): void {
        Log.error("HomeScreen", err);
    }

    public constructor(props: HomeScreenProps & NavigationScreenProps) {
        super(props);
        this.state = {
            alarmState: { type: HomeScreenAlarmStateType.NONE },
            loaded: false,
            messageText: "",
            twentyFourHour: false
        };
    }

    public componentWillMount(): void {
        this.refresh()
            .then(() => {
                // loaded fine. hide splash screen and bind events.
                SplashScreen.hide();

                this.getService(TimerService).on("alarm", this.onAlarmEventFired.bind(this));
            })
            .catch(HomeScreen.onRefreshError.bind(this));
    }

    public renderContent(): ReactNode {
        const loadedContent = (
            <View style={ExtraStyles.contentWrapper}>
                <Text style={ExtraStyles.message}>{this.state.messageText}</Text>
                <Clock wrapperStyle={ExtraStyles.clockWrapper} twentyFourHour={this.state.twentyFourHour}/>
                <SnoozeButton onPress={this.onSnoozePressed.bind(this)}/>
            </View>
        );

        // thanks to SplashScreen, this should never actually appear to the user. keeping it here just to be safe.
        const notLoadedContent = <EmptyView icon="ios-cog" title="Loading" subtitle="Just a sec!"/>;

        return (
            <InactivityHandler
                idleTime={15000}
                navigation={this.props.navigation}>
                <KeepAwake/>
                <View style={ExtraStyles.container}>
                    {this.state.loaded ? loadedContent : notLoadedContent}
                    <View style={ExtraStyles.bottom}>
                        <SlideUpIndicator onPress={this.switchToSettings.bind(this)}/>
                    </View>
                </View>
            </InactivityHandler>
        );
    }

    public async switchToSettings(): Promise<void> {
        const hasPasscode: boolean = await this.getService(PasscodeService).hasPasscode();
        this.present("PasscodeGate", {
            backButtonName: "Home",
            hasPasscode,
            screen: this,
            successScreenKey: "SettingsMain"
        });
    }

    public onSnoozePressed(): void {
        this.updateState({ messageText: "Alarm snoozed!" });
    }

    protected componentWillFocus(): void {
        this.refresh().catch(HomeScreen.onRefreshError.bind(this));
    }

    private async refresh(): Promise<void> {
        if (!this.getService(PreferencesService)) {
            this.setState({ messageText: this.props.initialMessageText });
            this.forceUpdate();
            return;
        }

        return this.fullDatabaseRead().then(this.updateState.bind(this));
    }

    private async fullDatabaseRead(): Promise<Partial<HomeScreenState>> {
        const pref: PreferencesService = this.getService(PreferencesService);
        return {
            loaded: true,
            messageText: "Hello, world!",
            twentyFourHour: await pref.get24HourTime()
        };
    }

    private onAlarmEventFired(when: Date, event: AlarmEvent): void {
        Log.debug("HomeScreen", `handling alarm event at ${Time.createFromDate(when)}: ${event.type}`);

        if (this.state.alarmState.alarm && event.alarm.id === this.state.alarmState.alarm.id) {
            // this is the same alarm that we are already aware of. bail out.
            return;
        }

        const newState: AlarmState = AlarmState.fromAlarmEvent(event);
        Log.debug("HomeScreen", `${when.getTime()} - alarm event fired. new alarm state: ${newState}`);
        this.updateState({ alarmState: newState, messageText: AlarmState.getMessageText(newState) });
    }
}

const ExtraStyles = StyleSheet.create({
    bottom: {
        alignItems: "center",
        bottom: -10,
        justifyContent: "center",
        position: "absolute",
        width: "100%",
        zIndex: 99
    },
    clockWrapper: {},
    container: {
        alignItems: "center",
        marginTop: 20,
        padding: 0
    },
    contentWrapper: {
        flex: 1,
        flexBasis: "100%",
        justifyContent: "center",
        width: "85%"
    },
    message: {
        fontSize: 30,
        textAlign: "center"
    }
});
