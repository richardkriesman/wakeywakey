/**
 * @module screens
 */

import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Divider, ListItem, Text } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";

import { ToggleButton } from "../../components/ToggleButton";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { DayOfWeek } from "../../models/AlarmModel";
import { Schedule } from "../../models/Schedule";
import { UIScreen } from "../../utils/screen";
import { HeaderButtonRight } from "../../utils/screen/NavigationOptions";
import { Alarm } from "../../models/Alarm";

export interface EditAlarmScreenState {
    alarm?: Alarm;
    schedule: Schedule;
}

@HeaderButtonRight((screen) => <Button type="clear" titleStyle={styles.saveButton} title="Save"
                                       onPress={() => (screen as EditAlarmScreen).onSavePress()} />)
export default class EditAlarmScreen extends UIScreen<{}, EditAlarmScreenState> {

    public constructor(props: NavigationScreenProps) {
        super(props);
    }

    public componentWillMount(): void {
        this.setState({
            alarm: this.props.navigation.getParam("alarm"),
            schedule: this.props.navigation.getParam("schedule")
        });
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
                <Text style={styles.textSectionHeader}>Days</Text>

                { /* TODO use a map here? wow this looks bad */}
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

                <Text style={styles.textSectionHeader}>Alarm Times</Text>
                <ListItem key={0} title="Sleep" subtitle="8:00 PM" rightIcon={{ name: "arrow-forward" }}/>
                <ListItem key={1} title="Wake up" subtitle="6:00 AM" rightIcon={{ name: "arrow-forward" }}/>
                <ListItem key={2} title="Get up" subtitle="7:00 AM" rightIcon={{ name: "arrow-forward" }}/>

                <Divider style={styles.divider}/>

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
            // TODO: actually get times from the UI
            this.state.schedule.createAlarm(72000, 21600, 25200)
                .then(() => {
                    this.dismiss();
                });
        } else {
            // TODO: update existing alarm
            this.dismiss();
        }
    }
}

const styles = StyleSheet.create({
    daySelector: {
        flexDirection: "row",
        justifyContent: "space-around"
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
        height: Layout.window.height,
        padding: 20
    }
});
