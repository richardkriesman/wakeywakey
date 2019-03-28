import React, { ReactNode } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ListItem, Text } from "react-native-elements";
import { NavigationScreenProps, StackActions } from "react-navigation";
import { HeaderBackButton } from "../../components/HeaderBackButton";

import { HeaderAddButton } from "../../components/MainSettingsScreen/HeaderAddButton";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { AlarmModel } from "../../models/AlarmModel";
import { ScheduleModel } from "../../models/ScheduleModel";
import { HeaderButtonLeft, HeaderButtonRight } from "../../utils/screen/NavigationOptions";
import { UIScreen } from "../../utils/screen/UIScreen";

// tslint:disable-next-line:no-empty-interface
export interface EditScheduleScreenState {
    headerTitle: string;
    schedule?: ScheduleModel;
}

@HeaderButtonLeft((screen) => <HeaderBackButton title="Cancel" onPress={() => screen.dismiss()} />)
@HeaderButtonRight((screen) =>
    <HeaderAddButton onPress={() => screen.present("EditAlarm", { title: "Add Alarm" })} />)
export default class EditScheduleScreen extends UIScreen<{}, EditScheduleScreenState> {

    private static padTime(time: number): string {
        return ("0" + time).slice(-2);
    }

    private static formatTime(date: Date): string {
        return `${this.padTime(date.getHours())}:${this.padTime(date.getMinutes())}`;
    }

    // noinspection JSUnusedLocalSymbols
    private static getAlarmTitle(alarm: AlarmModel): string {
        const start = this.formatTime(alarm.sleepTime);
        const end = this.formatTime(alarm.getUpTime);
        return `${start} – ${end}`;
    }

    // noinspection JSUnusedLocalSymbols
    private static getAlarmSubtitle(alarm: AlarmModel): string {
        return alarm.days.join(", ");
    }

    public constructor(props: NavigationScreenProps) {
        super(props);
    }

    public componentWillMount(): void {
        this.setState({
            headerTitle: this.props.navigation.getParam("title"),
            schedule: this.props.navigation.getParam("schedule") || null
        });
    }

    public onAlarmPressed(key: number): void {
        this.props.navigation.dispatch(StackActions.push({
            params: {
                alarm: this.state.schedule.alarms[key],
                title: this.state.headerTitle
            },
            routeName: "EditAlarm"
        }));
    }

    public renderContent(): ReactNode {
        return (
            <View style={styles.viewScroller}>
                <Text style={styles.textSectionHeader}>Alarms</Text>

                <FlatList
                    data={this.state.schedule ? this.state.schedule.alarms : []}
                    keyExtractor={(item: AlarmModel): string => String(item.key)}
                    renderItem={({ item }) => (
                        <ListItem
                            onPress={this.onAlarmPressed.bind(this, item.key)}
                            title={EditScheduleScreen.getAlarmTitle(item)}
                            subtitle={EditScheduleScreen.getAlarmSubtitle(item)}
                            rightIcon={{ name: "arrow-forward", type: "ionicons" }}
                        />
                    )}
                />

            </View>
        );
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
