/**
 * @module screens
 */

import React, { ReactNode } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import { NavigationScreenProps } from "react-navigation";

import { EmptyView } from "../../components/EmptyView";
import { ListHeader, ListItem } from "../../components/list";
import Colors from "../../constants/Colors";
import { Schedule } from "../../models";
import { Alarm } from "../../models/Alarm";
import { AlarmService } from "../../services/AlarmService";
import AlarmUtils from "../../utils/AlarmUtils";
import { BottomTabBarIcon, Title } from "../../utils/screen/NavigationOptions";
import { UIScreen } from "../../utils/screen/UIScreen";
import { Watcher } from "../../utils/watcher/Watcher";

export interface EditScheduleScreenState {
    alarms: Map<number, Alarm>;
    schedule?: Schedule;
}

@Title("Alarms")
@BottomTabBarIcon("ios-alarm")
export default class EditScheduleScreen extends UIScreen<{}, EditScheduleScreenState> {

    private dataSetChangedHandler: (alarms: Alarm[]) => void;
    private watcher: Watcher<Alarm>;

    public constructor(props: NavigationScreenProps) {
        super(props);
    }

    public componentWillMount(): void {
        this.setState({
            alarms: new Map(),
            schedule: this.props.navigation.getParam("schedule") || null
        }, () => { // got the schedule, watch for alarms
            this.watcher = this.getService(AlarmService).watchBySchedule(this.state.schedule);
            this.dataSetChangedHandler = this.onDataSetChanged.bind(this);
            this.watcher.on(this.dataSetChangedHandler);
        });
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
                                title={AlarmUtils.getAlarmTitle(item)}
                                subtitle={AlarmUtils.getAlarmSubtitle(item)}
                                rightIcon={{ name: "arrow-forward", type: "ionicons" }}
                            />
                        )}
                        renderSectionHeader={({ section }) => <ListHeader title={section.title}/>}
                        sections={[ { data: Array.from(this.state.alarms.values()), title: "Alarms"} ]}
                    />
                </View>
            );
        } else { // no alarms, render an empty state
            return (
                <EmptyView
                    icon="ios-alarm"
                    title="No alarms yet"
                    subtitle="Create an alarm to set your child's bedtime" />
            );
        }
    }

    public onAlarmPressed(key: number): void {
        this.present("EditAlarm", {
            alarm: this.state.alarms.get(key),
            schedule: this.state.schedule,
            title: "Edit alarm"
        });
    }

    private onDataSetChanged(alarms: Alarm[]): void {

        // build a new map of alarms
        const alarmItems: Map<number, Alarm> = new Map();
        for (const alarm of alarms) {
            alarmItems.set(alarm.id, alarm);
        }

        // replace the existing alarm map
        this.setState({
            alarms: alarmItems
        });
    }

}

const styles = StyleSheet.create({
    cancelButton: {
        color: Colors.appleButtonRed,
        marginLeft: 10
    },
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
    viewScroller: {
        flex: 1
    }
});
