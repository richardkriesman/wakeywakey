/**
 * @module screens
 */

import { Audio, KeepAwake, SplashScreen } from "expo";
import React, { ReactNode } from "react";
import { LayoutChangeEvent, LayoutRectangle, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";

import { Clock } from "../components";
import { InactivityHandler, Slider } from "../components";
import { Colors } from "../constants/Colors";
import { PasscodeService } from "../services/PasscodeService";
import { PreferenceService } from "../services/PreferenceService";
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
    indicatorLayout?: LayoutRectangle;
    messageText: string;
    twentyFourHour: boolean;
}

/**
 * The home screen, where the current status, current time, and decorations will show.
 * @author Shawn Lutch, Miika Raina
 */
@NoHeader
export class HomeScreen extends UIScreen<HomeScreenProps, HomeScreenState> {

    public static defaultInitialMessageText: string = "Hello, world!";

    private static onRefreshError(err: any): void {
        Log.error("HomeScreen", err);
    }

    public constructor(props: HomeScreenProps & NavigationScreenProps) {
        super(props);
        this.state = {
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

        // render passcode slider once the layout has become available
        let passcodeSlider: ReactNode;
        if (this.height > 0) { // once the screen height is known, it should be greater than 0
            // FIXME: Why are we having to add +11 here? Because I have no idea
            const initialTop: number = this.height -
                (this.state.indicatorLayout ? this.state.indicatorLayout.height : 0) + 11;
            passcodeSlider = (
                <Slider
                    onIndicatorLayout={this.onIndicatorLayout.bind(this)}
                    initialTop={initialTop}>
                    <View style={styles.passcodeContainer}>
                        <ScrollView>
                            <Text style={styles.passcodeInnerText}>
                                Spongebob me boy, enter that password! Arghegegegegegh
                            </Text>
                            <Text style={styles.passcodeInnerText}>
                                Spongebob me boy, enter that password! Arghegegegegegh
                            </Text>
                        </ScrollView>
                    </View>
                </Slider>
            );
        }

        // render screen
        return (
            <InactivityHandler
                idleTime={15000}
                navigation={this.props.navigation}>
                <KeepAwake/>
                <View style={styles.container}>
                    <View style={styles.contentWrapper}>
                        <Text style={styles.message}>{this.state.messageText}</Text>
                        <Clock wrapperStyle={styles.clockWrapper} twentyFourHour={this.state.twentyFourHour}/>
                        <Button
                            buttonStyle={styles.snoozeButton}
                            title="Snooze"
                            onPress={this.onSnoozePressed.bind(this)}
                        />
                    </View>
                    {passcodeSlider}
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
            successScreenKey: "Settings"
        });
    }

    public onSnoozePressed(): void {
        this.stopAudio()
            .then(() => {
                this.setState({
                    messageText: "Alarm snoozed!"
                });
            });
    }

    protected componentDidLayoutChange(layout: LayoutRectangle): void {
        this.forceUpdate(); // some components depend on the height of the screen - force an update when it changes
    }

    protected componentWillFocus(): void {
        this.refresh().catch(HomeScreen.onRefreshError.bind(this));
    }

    private onIndicatorLayout(event: LayoutChangeEvent): void {
        this.setState({
            indicatorLayout: event.nativeEvent.layout
        });
    }

    private async refresh(): Promise<void> {
        if (!this.getService(PreferenceService)) {
            this.setState({ messageText: this.props.initialMessageText });
            this.forceUpdate(); // FIXME: this shouldn't do anything - test it and remove if so?
            return;
        }

        return this.fullDatabaseRead().then((partial: Partial<HomeScreenState>) => {
            this.updateState(partial);
        });
    }

    private async fullDatabaseRead(): Promise<Partial<HomeScreenState>> {
        const pref: PreferenceService = this.getService(PreferenceService);
        return {
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

    private startAlarm(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Audio.setAudioModeAsync({
                allowsRecordingIOS: false, // we're not recording anything
                interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX, // interrupt other apps on iOS
                interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX, // interrupt other apps' audio on iOS
                playThroughEarpieceAndroid: false, // don't play through the earpiece on android
                playsInSilentModeIOS: true, // ignore silent mode on iOS
                shouldDuckAndroid: false // don't duck on android for other apps,
            })
                .catch((err) => {
                    reject(err);
                })
                .then(() => { // audio mode has been set, play the alarm
                    const sound = new Audio.Sound();
                    this.setState({
                        activeSound: sound
                    }, () => { // active sound has been updated, load and play the alarm
                        sound.loadAsync(require("../../assets/audio/MusicBox.mp3"))
                            .then(() => {
                                return sound.setStatusAsync({
                                    isLooping: true,
                                    shouldPlay: true
                                });
                            })
                            .catch((err) => {
                                reject(err);
                            });
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
                .catch(reject);
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
    },
    passcodeContainer: {
        alignSelf: "center",
        backgroundColor: "black",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: 600,
        width: 300,
        zIndex: 2
    },
    passcodeInnerText: {
        color: "white",
        padding: 50
    },
    snoozeButton: {
        backgroundColor: Colors.black,
        padding: 15
    }
});
