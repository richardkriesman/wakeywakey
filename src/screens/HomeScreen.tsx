/**
 * @module screens
 */

import { Audio, KeepAwake, SplashScreen } from "expo";
import React, { ReactNode } from "react";
import {
    LayoutChangeEvent,
    LayoutRectangle,
    StyleSheet,
    Text,
    View
} from "react-native";
import { Button } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";

import { Clock, InactivityHandler, Slider } from "../components";
import { PasscodeInput } from "../components/PasscodeInput";
import { SliderPosition } from "../components/Slider";
import { Colors } from "../constants/Colors";
import { Schedule } from "../models/Schedule";
import { PasscodeService } from "../services/PasscodeService";
import { PreferenceService } from "../services/PreferenceService";
import { ScheduleService } from "../services/ScheduleService";
import { AlarmEvent, AlarmEventType, TimerService } from "../services/TimerService";
import { getAlarmSound } from "../utils/Audio";
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
    activeSchedule?: Schedule;
    activeSound?: Audio.Sound;
    hasPasscode?: boolean;
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

    public static defaultInitialMessageText: string = "";

    private static onRefreshError(err: any): void {
        Log.error("HomeScreen", err);
    }

    private passcodeInput: PasscodeInput;
    private slider: Slider;

    public constructor(props: HomeScreenProps & NavigationScreenProps) {
        super(props);
        this.state = {
            messageText: HomeScreen.defaultInitialMessageText,
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
                    ref={(ref) => this.slider = ref}
                    onIndicatorLayout={this.onIndicatorLayout.bind(this)}
                    onPositionChanged={this.onSliderPositionChanged.bind(this)}
                    initialTop={initialTop}>
                    <View style={styles.passcodeContainer}>
                        {this.state.hasPasscode ?
                            // a passcode exists. prompt for it
                            <PasscodeInput
                                ref={(ref) => this.passcodeInput = ref}
                                autoFocus={false}
                                handleSuccess={this.onPasscodeSuccess.bind(this)}
                                verifyPasscode={this.onPasscodeVerify.bind(this)}/>
                            :
                            // no passcode exists. require user to create one.
                            <PasscodeInput
                                ref={(ref) => this.passcodeInput = ref}
                                autoFocus={false}
                                confirmPasscode={true}
                                defaultPromptText="Enter a new passcode:"
                                handleSuccess={this.onPasscodeSet.bind(this)}
                            />
                        }

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

    protected componentDidLayoutChange(layout: LayoutRectangle): void {
        this.forceUpdate(); // some components depend on the height of the screen - force an update when it changes
    }

    protected componentWillFocus(): void {
        this.refresh().catch(HomeScreen.onRefreshError.bind(this));
    }

    private async refresh(): Promise<void> {
        if (!this.getService(PreferenceService)) {
            this.setState({ messageText: this.props.initialMessageText });
            return;
        }

        return this.fullDatabaseRead().then((partial: Partial<HomeScreenState>) => {
            this.updateState(partial);
        });
    }

    private async fullDatabaseRead(): Promise<Partial<HomeScreenState>> {
        const pref: PreferenceService = this.getService(PreferenceService);
        return {
            activeSchedule: await this.getService(ScheduleService).getEnabled(),
            hasPasscode: await this.getService(PasscodeService).hasPasscode(),
            messageText: this.state.messageText,
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

    private onIndicatorLayout(event: LayoutChangeEvent): void {
        this.setState({
            indicatorLayout: event.nativeEvent.layout
        });
    }

    private onPasscodeSuccess(): void {
        this.slider.close()
            .then(() => {
                this.present("Settings");
            });
    }

    private onPasscodeVerify(passcode: string): Promise<boolean> {
        return this.getService(PasscodeService).verifyPasscode(passcode);
    }

    private async onPasscodeSet(passcode: string): Promise<void> {
        await this.getService(PasscodeService).setPasscode(passcode);
        this.onPasscodeSuccess();
    }

    private onSliderPositionChanged(position: SliderPosition): void {
        if (position === SliderPosition.Expanded) {
            this.passcodeInput.focus();
        } else {
            this.passcodeInput.reset();
        }
    }

    private onSnoozePressed(): void {
        this.stopAudio()
            .then(() => {
                this.setState({
                    messageText: "Alarm snoozed!"
                });
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
                    getAlarmSound(this.state.activeSchedule.audio)
                        .then((sound: Audio.Sound) => {
                            this.setState({
                                activeSound: sound
                            }, () => { // active sound has been updated, load and play the alarm
                                sound.setStatusAsync({
                                    isLooping: true,
                                    shouldPlay: true
                                })
                                    .then(() => {
                                        resolve();
                                    })
                                    .catch((err) => {
                                        reject(err);
                                    });
                            });

                        })
                        .catch((err) => {
                            reject(err);
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

const messageTextMap: Map<AlarmEventType | null, string> = new Map([
    [null, HomeScreen.defaultInitialMessageText],
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
        alignItems: "center",
        backgroundColor: "black",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: 600,
        width: 400,
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
