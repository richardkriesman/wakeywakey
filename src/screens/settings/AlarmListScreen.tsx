/**
 * @module screens
 */

import React, { ReactNode } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import { NavigationScreenProps } from "react-navigation";

import { Button } from "react-native-elements";
import { EmptyView } from "../../components/EmptyView";
import { ListHeader, ListItem } from "../../components/list";
import { Colors } from "../../constants/Colors";
import { Schedule } from "../../models";
import { Alarm, AlarmDay } from "../../models/Alarm";
import { AlarmService } from "../../services/AlarmService";
import { PreferenceService } from "../../services/PreferenceService";
import * as AlarmUtils from "../../utils/AlarmUtils";
import { BottomTabBarIcon, Title } from "../../utils/screen/NavigationOptions";
import { UIScreen } from "../../utils/screen/UIScreen";
import { Watcher } from "../../utils/watcher/Watcher";

export interface AlarmListScreenState {
    alarms: Map<number, Alarm>;
    isAddButtonDisabled: boolean;
    is24HourTime: boolean;
    schedule?: Schedule;
}

@Title("Alarms")
@BottomTabBarIcon("ios-alarm")
export class AlarmListScreen extends UIScreen<{}, AlarmListScreenState> {

    private dataSetChangedHandler: (alarms: Alarm[]) => void;
    private watcher: Watcher<Alarm>;

    public constructor(props: NavigationScreenProps) {
        super(props);
        this.state = {
            alarms: new Map(),
            is24HourTime: false,
            isAddButtonDisabled: false,
            schedule: this.props.navigation.getParam("schedule") || null
        };
    }

    public componentWillMount(): void {

        // check if 24-hour time is enabled
        this.getService(PreferenceService).get24HourTime()
            .then((is24HourTime: boolean) => {
                this.setState({
                    is24HourTime
                });
            });

        // watch for alarms
        this.watcher = this.getService(AlarmService).watchBySchedule(this.state.schedule);
        this.dataSetChangedHandler = this.onDataSetChanged.bind(this);
        this.watcher.on(this.dataSetChangedHandler);

    }

    public componentWillUnmount(): void {
        this.watcher.off(this.dataSetChangedHandler);
    }

    public renderContent(): ReactNode {
        if (this.state.alarms.size > 0) { // alarms exist, render the list
            return (
                <View style={styles.viewScroller}>
                    <SectionList
                        keyExtractor={(item: Alarm): string => item.id.toString()}
                        renderItem={({ item }) => (
                            <ListItem
                                onPress={this.onAlarmPressed.bind(this, item.id)}
                                title={AlarmUtils.getAlarmTitle(item, this.state.is24HourTime)}
                                subtitle={AlarmUtils.getAlarmSubtitle(item)}
                                rightIcon={{ name: "arrow-forward", type: "ionicons" }}
                            />
                        )}
                        renderSectionHeader={({ section }) => <ListHeader title={section.title}/>}
                        sections={[ { data: Array.from(this.state.alarms.values()), title: "Alarms"} ]}
                    />
                    <View style={styles.footer}>
                        <Button
                            disabled={this.state.isAddButtonDisabled}
                            raised={true}
                            title="Add alarm"
                            onPress={this.onCreateAlarmPressed.bind(this)}
                        />
                    </View>
                </View>
            );
        } else { // no alarms, render an empty state
            return (
                <EmptyView
                    icon="ios-alarm"
                    onPress={this.onCreateAlarmPressed.bind(this)}
                    title="No alarms yet"
                    subtitle="Tap here to create one!" />
            );
        }
    }

    public onAlarmPressed(key: number): void {
        this.getActiveDays().then((activeDays: number) => {
            this.present("EditAlarm", {
                activeDays,
                alarm: this.state.alarms.get(key),
                schedule: this.state.schedule,
                title: "Edit alarm"
            });
        });
    }

    private async getActiveDays(): Promise<number> {
        const alarms: Alarm[] = await this.getService(AlarmService).getBySchedule(this.state.schedule);

        // build characteristic vector of days in use in alarms
        let activeDays: number = 0;
        for (const alarm of alarms) {
            activeDays |= alarm.days; // add days in the alarm to the characteristic vector
        }

        return activeDays;
    }

    private onDataSetChanged(alarms: Alarm[]): void {

        // build a new map of alarms
        let remainingDays: number = AlarmDay.Monday | AlarmDay.Tuesday | AlarmDay.Wednesday | AlarmDay.Thursday |
            AlarmDay.Friday | AlarmDay.Saturday | AlarmDay.Sunday;
        const alarmItems: Map<number, Alarm> = new Map();
        for (const alarm of alarms) {
            remainingDays &= ~alarm.days; // remove alarm's days from remaining days
            alarmItems.set(alarm.id, alarm);
        }

        // replace the existing alarm map
        this.setState({
            alarms: alarmItems,
            isAddButtonDisabled: remainingDays === 0
        });
    }

    private onCreateAlarmPressed(): void {

        // present the edit alarm screen
        this.getActiveDays().then((activeDays: number) => {
            this.present("EditAlarm", {
                activeDays,
                is24HourTime: this.state.is24HourTime,
                schedule: this.state.schedule,
                title: "Add alarm"
            });
        });

    }

}

const styles = StyleSheet.create({
    cancelButton: {
        color: Colors.common.tint.destructive,
        marginLeft: 10
    },
    daySelector: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    deleteButton: {
        backgroundColor: Colors.common.tint.destructive
    },
    deleteButtonContainer: {
        padding: 20
    },
    deleteButtonTitle: {
        color: "#fff"
    },
    footer: {
        flex: 1,
        justifyContent: "flex-end",
        padding: 20
    },
    saveButton: {
        color: Colors.common.tint.constructive,
        fontWeight: "500",
        marginRight: 10
    },
    viewScroller: {
        flex: 1
    }
});
