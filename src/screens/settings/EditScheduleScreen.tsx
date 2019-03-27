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

import AlarmUtils from "../../utils/AlarmUtils";

export interface EditScheduleScreenState {
    headerTitle: string;
    schedule?: ScheduleModel;
}

export default class EditScheduleScreen extends React.Component<NavigationScreenProps, EditScheduleScreenState> {

    // TODO how to test?
    public static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            headerLeft: (
                <HeaderBackButton title="Cancel" navigation={navigation}/>
            ),
            headerRight: (
                <HeaderAddButton
                    // TODO instead navigate to "Add Alarm" with proper params
                    onPress={() => {
                        navigation.navigate(
                            "EditAlarm",
                            { title: "Add Alarm" }
                        );
                    }}
                />
            ),
            title: navigation.getParam("title")
        };
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

    public render(): ReactNode {
        return (
            <View style={styles.viewScroller}>
                <Text style={styles.textSectionHeader}>Alarms</Text>

                <FlatList
                    data={this.state.schedule ? this.state.schedule.alarms : []}
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
