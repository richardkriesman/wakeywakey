/**
 * @module screens
 */

/**
 * schedule options lists Chelsea Greer
 */

import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationScreenProps } from "react-navigation";

import { DestructiveButton } from "../../components/DestructiveButton";
import { ListHeader } from "../../components/list/ListHeader";
import { ListItem } from "../../components/list/ListItem";
import { ConfirmationModal } from "../../components/modal/ConfirmationModal";
import { SelectPicker } from "../../components/SelectPicker";
import { Colors } from "../../constants/Colors";
import { Schedule, ScheduleClockStyle, ScheduleColors } from "../../models/Schedule";
import { AlarmAudio } from "../../utils/Audio";
import * as Log from "../../utils/Log";
import { BottomTabBarIcon, Title } from "../../utils/screen/NavigationOptions";
import { UIScreen } from "../../utils/screen/UIScreen";

export interface OptionsListScreenState {
    audio: AlarmAudio;
    clockStyle: ScheduleClockStyle;
    colorScheme: ScheduleColors;
    isDeleteModalVisible: boolean;
    snoozeTime: number;
}

const AudioStrings: string[] = ["MusicBox", "Birds", "Pager Beeps", "Computer", "Loud Alarm", "Normal Alarm",
    "Special"];
const ColorSchemeStrings: string[] = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple"];
const SnoozeTimeStrings: string[] = ["5 min", "10 min", "15 min", "20 min", "25 min", "30 min"];
const ClockStyleStrings: string[] = ["Digital", "Analog"];

@BottomTabBarIcon("ios-cog")
@Title("Options")
export class OptionsListScreen extends UIScreen<{}, OptionsListScreenState> {

    private readonly schedule: Schedule;
    private colorPicker: SelectPicker;
    private audioPicker: SelectPicker;
    private snoozePicker: SelectPicker;
    private clockPicker: SelectPicker;

    public constructor(props: NavigationScreenProps) {
        super(props);
        this.schedule = this.props.navigation.getParam("schedule");
        this.state = {
            audio: this.schedule.audio,
            clockStyle: this.schedule.clockStyle,
            colorScheme: this.schedule.colorScheme,
            isDeleteModalVisible: false,
            snoozeTime: SnoozeTimeStrings.indexOf(`${this.schedule.snoozeTime} min`)
        };
    }

    public renderContent(): ReactNode {
        return (
            <View style={styles.viewScroller}>
                <ConfirmationModal
                    isDestructiveAction={true}
                    isVisible={this.state.isDeleteModalVisible}
                    positiveLabel="Delete"
                    negativeLabel="Cancel"
                    title="Delete this schedule?"
                    onCompleted={this.onDeleteModalCompleted.bind(this)} />

                <ListHeader title="Options" />

                <ListItem leftIcon={schemeIcon}
                          title="Color Scheme"
                          rightIcon={forwardIcon}
                          onPress={this.onColorPickerPress.bind(this)}
                          subtitle={ColorSchemeStrings[this.state.colorScheme]} />
                <SelectPicker ref={(ref) => this.colorPicker = ref}
                              title={"Color Scheme"}
                              value={this.state.colorScheme}
                              values={ColorSchemeStrings}/>

                <ListItem leftIcon={audioIcon}
                          title="Audio"
                          rightIcon={forwardIcon}
                          onPress={this.onAudioPickerPress.bind(this)}
                          subtitle={AudioStrings[this.state.audio]} />
                <SelectPicker ref={(ref) => this.audioPicker = ref}
                              title={"Audio"}
                              value={this.state.audio}
                              values={AudioStrings}/>

                <ListItem leftIcon={snoozeIcon}
                          title="Snooze"
                          rightIcon={forwardIcon}
                          onPress={this.onSnoozePickerPress.bind(this)}
                          subtitle={SnoozeTimeStrings[this.state.snoozeTime]} />
                <SelectPicker ref={(ref) => this.snoozePicker = ref}
                              title={"Snooze"}
                              value={this.state.snoozeTime}
                              values={SnoozeTimeStrings}/>

                <ListItem leftIcon={clockIcon}
                          title="Clock Style"
                          rightIcon={forwardIcon}
                          onPress={this.onClockPickerPress.bind(this)}
                          subtitle={ClockStyleStrings[this.state.clockStyle]}/>
                <SelectPicker ref={(ref) => this.clockPicker = ref}
                              title={"Clock"}
                              value={this.state.clockStyle}
                              values={ClockStyleStrings}/>

                <View style={styles.footer}>
                    <DestructiveButton
                        onPress={this.onDeleteButtonPress.bind(this)}
                        title="Delete schedule" />
                </View>
            </View>
        );
    }

    private onColorPickerPress(): void {
        this.colorPicker.present()
            .then((colorString: string) => {
                if (colorString === undefined) {
                    return;
                }

                const color = ColorSchemeStrings.indexOf(colorString);
                this.schedule.setColorScheme(color)
                    .then(() => {
                        this.setState({
                            colorScheme: color
                        });
                    })
                    .catch((err) => {
                        Log.error("Options", err);
                    });
            });
    }

    private onAudioPickerPress(): void {
        this.audioPicker.present()
            .then((audioString: string) => {
                if (audioString === undefined) {
                    return;
                }

                const audio: number = AudioStrings.indexOf(audioString);
                this.schedule.setAudio(audio)
                    .then(() => {
                        this.setState({
                            audio
                        });
                    })
                    .catch((err) => {
                        Log.error("Options", err);
                    });
            });
    }

    private onSnoozePickerPress(): void {
        this.snoozePicker.present()
            .then((timeString: string) => {
                if (timeString === undefined) {
                    return;
                }

                this.schedule.setSnoozeTime(parseInt(timeString.split(" ")[0], 10))
                    .then(() => {
                        this.setState({
                            snoozeTime: SnoozeTimeStrings.indexOf(timeString)
                        });
                    })
                    .catch((err) => {
                        Log.error("Options", err);
                    });
            });
    }

    private onClockPickerPress(): void {
        this.clockPicker.present()
            .then((clockString: string) => {
                if (clockString === undefined) {
                    return;
                }

                const clockStyle = ClockStyleStrings.indexOf(clockString);
                this.schedule.setClockStyle(clockStyle)
                    .then(() => {
                        this.setState({
                            clockStyle
                        });
                    })
                    .catch((err) => {
                        Log.error("Options", err);
                    });
            });
    }

    private onDeleteButtonPress(): void {
        this.setState({
            isDeleteModalVisible: true
        });
    }

    private onDeleteModalCompleted(shouldDelete: boolean): void {
        this.setState({
            isDeleteModalVisible: false
        }, () => {
            if (shouldDelete) {
                this.schedule.delete()
                    .then(() => {
                        this.dismiss();
                    });
            }
        });
    }

}

const forwardIcon = { name: "arrow-forward", type: "ionicons" };
const schemeIcon = {name: "color-lens", type: "ionicons" };
const audioIcon = {name: "headset", type: "ionicons"};
const snoozeIcon = {name: "snooze", type: "ionicons"};
const clockIcon = {name: "access-time", type: "ionicons"};

const styles = StyleSheet.create({
    footer: {
        flex: 1,
        justifyContent: "flex-end",
        padding: 20
    },
    textSectionHeader: {
        color: Colors.common.text.subheader,
        fontSize: 17,
        fontWeight: "600",
        marginBottom: 10
    },
    viewScroller: {
        flex: 1
    }
});
