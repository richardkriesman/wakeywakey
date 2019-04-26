/**
 * @module screens
 */

import { Audio, KeepAwake, SplashScreen } from "expo";
import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationScreenProps } from "react-navigation";

import { EmptyView } from "../components/EmptyView";
import {
    Clock,
    SlideUpIndicator,
    SnoozeButton
} from "../components/HomeScreen";
import { InactivityHandler } from "../components/InactivityHandler";
import { PasscodeService } from "../services/PasscodeService";
import { PreferencesService } from "../services/PreferencesService";
import { AlarmEvent, AlarmEventType, TimerService } from "../services/TimerService";
import * as Log from "../utils/Log";
import { getEnumKeyByValue } from "../utils/ObjectUtils";
import { NoHeader, UIScreen } from "../utils/screen";

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
    activeAlarmEvent?: AlarmEvent;
    activeSound?: Audio.Sound;
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
            <View style={styles.contentWrapper}>
                <Text style={styles.message}>{this.state.messageText}</Text>
                <Clock wrapperStyle={styles.clockWrapper} twentyFourHour={this.state.twentyFourHour}/>
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
                <View style={styles.container}>
                    {this.state.loaded ? loadedContent : notLoadedContent}
                    <View style={styles.bottom}>
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
        this.stopAudio()
            .then(() => {
                this.updateState({
                    messageText: "Alarm snoozed!"
                });
            });
    }

    protected componentWillFocus(): void {
        this.refresh().catch(HomeScreen.onRefreshError.bind(this));
    }

    private async refresh(): Promise<void> {
        if (!this.getService(PreferencesService)) {
            this.setState({ messageText: this.props.initialMessageText });
            this.forceUpdate(); // FIXME: this shouldn't do anything - test it and remove if so?
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

        // log the event change
        const eventName: string = getEnumKeyByValue(AlarmEventType, event.type);
        Log.info("HomeScreen", `Responding to event ${eventName} for Alarm ${event.alarm.id}`);

        // set this event as the active one
        this.setState({
            activeAlarmEvent: event,
            messageText: messageTextMap.get(event.type)
        }, () => { // update alarm state

            // start playing sound until dismissed
            this.startAlarm();

        });
    }

    private async startAlarm(): Promise<void> {

        // set the audio mode to prevent interruptions by other apps
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false, // we're not recording anything
                interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX, // interrupt other apps on iOS
                interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX, // interrupt other apps' audio on iOS
                playsInSilentModeIOS: true, // ignore silent mode on iOS
                shouldDuckAndroid: false // don't duck on android for other apps,
            });
        } catch (ex) {
            Log.error("HomeScreen", "Audio mode configuration was rejected by the OS");
        }

        // play audio
        const sound = new Audio.Sound();
        this.setState({
            activeSound: sound
        }, () => {
            // FIXME: proper async
            sound.loadAsync(require("../../assets/audio/MusicBox.mp3")).then(() => {
                return sound.setStatusAsync({
                    isLooping: true,
                    shouldPlay: true
                });
            });
        });

    }

    private async stopAudio(): Promise<void> {
        return new Promise<void>((accept, reject) => {
            this.state.activeSound.stopAsync()
                .then(() => {
                    this.setState({
                        activeSound: undefined
                    }, () => {
                        accept();
                    });
                })
                .catch((err) => reject);
        });
    }
}

const messageTextMap: Map<AlarmEventType|null, string> = new Map([
    [null, "Hello, world!"],
    [AlarmEventType.SLEEP, "Time for bed!"],
    [AlarmEventType.WAKE, "Time to wake up!"],
    [AlarmEventType.GET_UP, "Time to get up!"]
]);

const styles = StyleSheet.create({
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
