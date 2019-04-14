/**
 * @module screens
 */

import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Divider, ListItem } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";

import { ToggleButton } from "../../components/ToggleButton";
import Colors from "../../constants/Colors";
import { DayOfWeek } from "../../models/AlarmModel";
import { Schedule } from "../../models/Schedule";
import { UIScreen } from "../../utils/screen";
import { HeaderButtonRight } from "../../utils/screen/NavigationOptions";
import { Alarm } from "../../models/Alarm";
import { TimePicker } from "../../components/TimePicker";
import * as AlarmUtils from "../../utils/AlarmUtils";
import { ListHeader } from "../../components/ListHeader";
import { Time } from "../../utils/Time";

export interface EditAlarmScreenState {
    alarm?: Alarm;
    schedule: Schedule;
    sleepTime: Time;
    wakeTime: Time;
    getUpTime: Time;
}

@HeaderButtonRight((screen) => <Button type="clear" titleStyle={styles.saveButton} title="Save"
                                       onPress={() => (screen as EditAlarmScreen).onSavePress()} />)
export default class EditAlarmScreen extends UIScreen<{}, EditAlarmScreenState> {

    private timePicker: TimePicker;

    public constructor(props: NavigationScreenProps) {
        super(props);

        // build initial state
        const alarm: Alarm|undefined = this.props.navigation.getParam("alarm");
        this.state = {
            alarm: alarm,
            getUpTime: alarm ? alarm.getUpTime : Time.createFromTotalSeconds(25200), // 7:00 AM
            schedule: this.props.navigation.getParam("schedule"),
            sleepTime: alarm ? alarm.sleepTime : Time.createFromTotalSeconds(72000), // 8:00 PM
            wakeTime: alarm ? alarm.wakeTime : Time.createFromTotalSeconds(21600) // 6:00 AM
        };
    }

    public renderContent(): ReactNode {

        // render delete button if the alarm already exists
        let deleteButton: ReactNode|undefined;
        if (this.state.alarm) {
            deleteButton = <Button
                buttonStyle={styles.deleteButton}
                containerStyle={styles.deleteButtonContainer}
                onPress={this.onDeletePress.bind(this)}
                titleStyle={styles.deleteButtonTitle}
                title="Delete Alarm" />;
        }

        return (
            <View style={styles.viewScroller}>
                <TimePicker ref={(ref) => this.timePicker = ref}/>

                <ListHeader title="Days" />
                <Divider style={styles.divider}/>
                <View style={styles.daySelector}>
                    <ToggleButton title="M" isToggled={this.daysContains(DayOfWeek.Monday)}/>
                    <ToggleButton title="Tu" isToggled={this.daysContains(DayOfWeek.Tuesday)}/>
                    <ToggleButton title="W" isToggled={this.daysContains(DayOfWeek.Wednesday)}/>
                    <ToggleButton title="Th" isToggled={this.daysContains(DayOfWeek.Thursday)}/>
                    <ToggleButton title="F" isToggled={this.daysContains(DayOfWeek.Friday)}/>
                    <ToggleButton title="Sa" isToggled={this.daysContains(DayOfWeek.Saturday)}/>
                    <ToggleButton title="Su" isToggled={this.daysContains(DayOfWeek.Sunday)}/>
                </View>

                <Divider style={styles.divider}/>

                <ListHeader title="Alarm times" />
                <ListItem key={0}
                          title="Sleep"
                          subtitle={AlarmUtils.formatTime(this.state.sleepTime.totalSeconds)}
                          rightIcon={{ name: "arrow-forward" }}
                          onPress={this.onTimeSleepPress.bind(this)} />
                <ListItem key={1}
                          title="Wake up"
                          subtitle={AlarmUtils.formatTime(this.state.wakeTime.totalSeconds)}
                          rightIcon={{ name: "arrow-forward" }}
                          onPress={this.onTimeWakePress.bind(this)} />
                <ListItem key={2}
                          title="Get up"
                          subtitle={AlarmUtils.formatTime(this.state.getUpTime.totalSeconds)}
                          rightIcon={{ name: "arrow-forward" }}
                          onPress={this.onTimeGetUpPress.bind(this)} />

                {deleteButton}
            </View>
        );
    }

    private daysContains(specificDay: DayOfWeek): boolean {
        // FIXME: Add alarm days
        // return this.state.alarm && this.state.alarm.days && this.state.alarm.days.indexOf(specificDay) > -1;
        return false;
    }

    private onDeletePress(): void {
        this.state.alarm.delete()
            .then(() => this.dismiss());
    }

    private onSavePress(): void {
        if (!this.state.alarm) { // new alarm
            this.state.schedule.createAlarm(this.state.sleepTime, this.state.wakeTime, this.state.getUpTime)
                .then(() => {
                    this.dismiss();
                });
        } else {
            const promises: Array<Promise<void>> = [];
            if (!this.state.alarm.sleepTime.equals(this.state.sleepTime)) {
                promises.push(this.state.alarm.setSleepTime(this.state.sleepTime));
            }
            if (!this.state.alarm.wakeTime.equals(this.state.wakeTime)) {
                promises.push(this.state.alarm.setWakeTime(this.state.wakeTime));
            }
            if (!this.state.alarm.getUpTime.equals(this.state.getUpTime)) {
                promises.push(this.state.alarm.setGetUpTime(this.state.getUpTime));
            }
            Promise.all(promises)
                .then(() => {
                   this.dismiss();
                });
        }
    }

    private onTimeGetUpPress(): void {
        this.timePicker.present(this.state.getUpTime)
            .then((time: Time|undefined) => {
                if (time) {
                    this.setState({
                        getUpTime: time
                    });
                }
            });
    }

    private onTimeSleepPress(): void {
        this.timePicker.present(this.state.sleepTime)
            .then((time: Time|undefined) => {
                if (time) {
                    this.setState({
                        sleepTime: time
                    });
                }
            });
    }

    private onTimeWakePress(): void {
        this.timePicker.present(this.state.getUpTime)
            .then((time: Time|undefined) => {
                if (time) {
                    this.setState({
                        wakeTime: time
                    });
                }
            });
    }

}

const styles = StyleSheet.create({
    daySelector: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingHorizontal: 20
    },
    deleteButton: {
        backgroundColor: Colors.appleButtonRed
    },
    deleteButtonContainer: {
        padding: 20
    },
    deleteButtonTitle: {
        color: "#fff"
    },
    divider: {
        backgroundColor: Colors.headerBackground,
        marginBottom: 20,
        marginTop: 10
    },
    saveButton: {
        color: Colors.appleButtonBlue,
        fontWeight: "500",
        marginRight: 10
    },
    textSectionHeader: {
        color: Colors.subheaderColor,
        fontSize: 17,
        fontWeight: "600",
        marginBottom: 10
    },
    viewScroller: {
        flex: 1
    }
});
