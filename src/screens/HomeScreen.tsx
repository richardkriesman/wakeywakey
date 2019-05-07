/**
 * @module screens
 */

import { Audio, KeepAwake, SplashScreen } from "expo";
import React, { ReactNode } from "react";
import { LayoutChangeEvent, LayoutRectangle, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Button } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";

import { Clock, InactivityHandler, PasscodeInput, SkyBackground, Slider } from "../components";
import { SliderPosition } from "../components/Slider";
import { Colors } from "../constants/Colors";
import { Alarm } from "../models/Alarm";
import { Schedule } from "../models/Schedule";
import { AlarmService } from "../services/AlarmService";
import { PasscodeService } from "../services/PasscodeService";
import { PreferenceService } from "../services/PreferenceService";
import { ScheduleService } from "../services/ScheduleService";
import { TimerService } from "../services/TimerService";
import { AlarmEvent, AlarmEventType } from "../utils/AlarmEvent";
import * as AlarmUtils from "../utils/AlarmUtils";
import { getAlarmSound } from "../utils/Audio";
import * as Log from "../utils/Log";
import { getEnumKeyByValue } from "../utils/ObjectUtils";
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
 * Snooze button state. Determines what happens when the snooze button is pressed.
 */
export enum SnoozeState {
    Disabled = 0,
    Snooze = 1,
    Dismiss = 2
}

/**
 * Home screen state
 * @author Richard Kriesman
 */
interface HomeScreenState {
    activeAlarm?: Alarm;
    activeAlarmEvent?: AlarmEvent;
    activeSchedule?: Schedule;
    activeSound?: Audio.Sound;
    hasPasscode?: boolean;
    indicatorLayout?: LayoutRectangle;
    isDarkTheme: boolean;
    messageText: string;
    snoozeState: SnoozeState;
    time: Time;
    twentyFourHour: boolean;
}

/**
 * The home screen, where the current status, current time, and decorations will show.
 * @author Shawn Lutch, Miika Raina
 */
@NoHeader
export class HomeScreen extends UIScreen<HomeScreenProps, HomeScreenState> {

    public static defaultInitialMessageText: string = " ";

    private static onRefreshError(err: any): void {
        Log.error("HomeScreen", err);
    }

    private passcodeInput: PasscodeInput;
    private slider: Slider;

    public constructor(props: HomeScreenProps & NavigationScreenProps) {
        super(props);
        this.shouldRenderSafeArea = false; // disable the safe area for this screen, we're handling it manually
        this.shouldRenderStatusBarTranslucent = true; // render the status bar as translucent for this screen
        this.state = {
            isDarkTheme: false,
            messageText: HomeScreen.defaultInitialMessageText,
            snoozeState: SnoozeState.Disabled,
            time: new Time(),
            twentyFourHour: false
        };
    }

    public componentWillMount(): void {
        this.refresh()
            .then(() => {
                // loaded fine. hide splash screen and bind events.
                SplashScreen.hide();

                this.getService(TimerService).on("second", this.onSecond.bind(this));
                this.getService(TimerService).on("alarm", this.onAlarmEventFired.bind(this));
            })
            .catch(HomeScreen.onRefreshError.bind(this));
    }

    public renderContent(): ReactNode {

        // build text dynamic style
        const textDynamicStyle: TextStyle = {
            color: this.state.isDarkTheme ? Colors.white : Colors.black
        };

        // render passcode slider once the layout has become available
        let passcodeSlider: ReactNode;
        if (this.height > 0) { // once the screen height is known, it should be greater than 0
            const initialTop: number = this.height -
                (this.state.indicatorLayout ? this.state.indicatorLayout.height : 0);
            const contentDynamicStyle: ViewStyle = {
                width: this.width
            };

            passcodeSlider = (
                <Slider
                    ref={(ref) => this.slider = ref}
                    onIndicatorLayout={this.onIndicatorLayout.bind(this)}
                    onPositionChanged={this.onSliderPositionChanged.bind(this)}
                    initialTop={initialTop}>
                    <View style={[styles.passcodeContainer, contentDynamicStyle]}>
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

        // determine snooze button text
        let snoozeButtonText: string;
        let isSnoozeDisabled: boolean = false;
        if (this.state.snoozeState === SnoozeState.Dismiss) {
            snoozeButtonText = "Dismiss";
        } else {
            snoozeButtonText = "Snooze";
            if (this.state.snoozeState === SnoozeState.Disabled) {
                isSnoozeDisabled = true;
            }
        }

        // render screen
        return (
            <InactivityHandler
                idleTime={15000}
                navigation={this.props.navigation}>
                <KeepAwake/>
                <SkyBackground
                    alarm={this.state.activeAlarm}
                    onThemeTransition={this.onThemeTransition.bind(this)}
                    time={this.state.time}>
                    <View style={styles.container}>
                        <View style={styles.contentWrapper}>
                            <Text style={[styles.message, textDynamicStyle]}>{this.state.messageText}</Text>
                            <Clock
                                textStyle={textDynamicStyle}
                                twentyFourHour={this.state.twentyFourHour}
                                wrapperStyle={styles.clockWrapper}/>
                            <Button
                                buttonStyle={styles.snoozeButton}
                                disabled={isSnoozeDisabled}
                                title={snoozeButtonText}
                                onPress={this.onSnoozePressed.bind(this)}
                            />
                        </View>
                    </View>
                </SkyBackground>
                {passcodeSlider}
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

        // determine the active alarm if there is one
        const activeSchedule: Schedule|undefined = await this.getService(ScheduleService).getEnabled();
        let activeAlarm: Alarm|undefined;
        if (activeSchedule) {
            const alarms: Alarm[] = await this.getService(AlarmService).getBySchedule(activeSchedule);
            for (const alarm of alarms) {
                if (AlarmUtils.isActiveToday(alarm)) {
                    activeAlarm = alarm;
                    break;
                }
            }
        }

        return {
            activeAlarm,
            activeSchedule,
            hasPasscode: await this.getService(PasscodeService).hasPasscode(),
            messageText: this.state.messageText,
            twentyFourHour: await pref.get24HourTime()
        };
    }

    private onAlarmEventFired(when: Date, event: AlarmEvent): void {

        // log the event change
        console.log(event);
        const eventName: string = getEnumKeyByValue(AlarmEventType, event.type);
        Log.info("HomeScreen", `Responding to event ${eventName} for Alarm ${event.alarm.id}`);

        // determine new snooze state
        const snoozeState: SnoozeState = event.type === AlarmEventType.Wake ? SnoozeState.Snooze : SnoozeState.Dismiss;
        if (snoozeState !== SnoozeState.Snooze) { // alarm is not snoozeable, dismiss any snoozed events
            this.getService(TimerService).cancelSnooze();
        }

        // set this event as the active one
        this.setState({
            activeAlarmEvent: event,
            messageText: messageTextMap.get(event.type),
            snoozeState
        }, () => { // update alarm state

            // start playing sound until dismissed if there isn't already an alarm going off
            if (!this.state.activeSound) {
                this.startAlarm();
            }

            // set the active alarm to the next alarm if this was the get up time
            if (event.type === AlarmEventType.GetUp) {
                this.refresh();
            }

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

    private onSecond(date?: Date): void {
        const time: Time = Time.createFromDate(date);
        this.setState({
            time
        });
    }

    private onSnoozePressed(): void {
        switch (this.state.snoozeState) {

            // snooze the alarm
            case SnoozeState.Snooze:
                this.state.activeAlarmEvent.snooze()
                    .catch((err) => {
                        Log.error("HomeScreen", err);
                    })
                    .then(() => {
                        return this.stopAudio();
                    })
                    .then(() => {
                        this.setState({
                            messageText: `Snoozed for ${this.state.activeSchedule.snoozeTime} minutes`,
                            snoozeState: SnoozeState.Dismiss
                        });
                    });
                break;

            // dismiss the alarm
            case SnoozeState.Dismiss:
                this.getService(TimerService).cancelSnooze();
                if (this.state.activeSound) {
                    this.stopAudio()
                        .then(() => {
                            this.setState({
                                activeAlarmEvent: undefined,
                                messageText: HomeScreen.defaultInitialMessageText,
                                snoozeState: SnoozeState.Disabled
                            });
                        });
                } else {
                    this.setState({
                        messageText: HomeScreen.defaultInitialMessageText,
                        snoozeState: SnoozeState.Disabled
                    });
                }
                break;

        }
    }

    private onThemeTransition(isDarkTheme: boolean): void {
        this.statusBarStyle = isDarkTheme ? "light-content" : "dark-content";
        this.setState({
            isDarkTheme
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
    [AlarmEventType.Sleep, "Time for bed!"],
    [AlarmEventType.Wake, "Time to wake up!"],
    [AlarmEventType.GetUp, "Time to get up!"]
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
