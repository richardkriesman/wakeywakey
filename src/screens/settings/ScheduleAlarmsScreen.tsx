/**
 * @module screens
 */

import React, { ReactNode } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ListItem, Text } from "react-native-elements";
import { NavigationScreenProps, StackActions } from "react-navigation";
import { HeaderBackButton, HeaderIconButton } from "../../components";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { Schedule } from "../../models";
import { AlarmModel } from "../../models/AlarmModel";
import AlarmUtils from "../../utils/AlarmUtils";
import { HeaderButtonLeft, HeaderButtonRight } from "../../utils/screen/NavigationOptions";
import { UIScreen } from "../../utils/screen/UIScreen";

export interface EditScheduleScreenState {
    headerTitle: string;
    schedule?: Schedule;
}

@HeaderButtonLeft((screen) => <HeaderBackButton title="Cancel" onPress={() => screen.dismiss()} />)
@HeaderButtonRight((screen) =>
    <HeaderIconButton
        icon="add"
        onPress={() => screen.present("EditAlarm", { title: "Add Alarm" })} />)
export default class EditScheduleScreen extends UIScreen<{}, EditScheduleScreenState> {

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
        this.present("EditAlarm", {
            alarm: null, // this.state.schedule.alarms[key],
            title: this.state.headerTitle
        });
    }

    public renderContent(): ReactNode {
        return (
            <View style={styles.viewScroller}>
                <Text style={styles.textSectionHeader}>Alarms</Text>

                <FlatList
                    data={this.state.schedule ? /*this.state.schedule.alarms */ [] : []}
                    keyExtractor={(item: AlarmModel): string => String(item.key)}
                    renderItem={({ item }) => (
                        <ListItem
                            onPress={this.onAlarmPressed.bind(this, item.key)}
                            title={AlarmUtils.getAlarmTitle(item)}
                            subtitle={AlarmUtils.getAlarmSubtitle(item)}
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
