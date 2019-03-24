import React, { ReactNode } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ListItem, Text } from "react-native-elements";
import { NavigationScreenProps, StackActions } from "react-navigation";
import { HeaderBackButton } from "../../components/HeaderBackButton";

import { HeaderAddButton } from "../../components/MainSettingsScreen/HeaderAddButton";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { AlarmModel } from "../../models/AlarmModel";

// tslint:disable-next-line:no-empty-interface
export interface EditScheduleScreenState {
    headerTitle: string;
    alarms: AlarmModel[];
}

export default class EditScheduleScreen extends React.Component<NavigationScreenProps, EditScheduleScreenState> {

    public static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            headerLeft: (
                <HeaderBackButton title="Cancel" navigation={ navigation }/>
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

    // noinspection JSUnusedLocalSymbols
    private static getAlarmTitle(alarm: AlarmModel): string {
        return "title";
    }

    // noinspection JSUnusedLocalSymbols
    private static getAlarmSubtitle(alarm: AlarmModel): string {
        return "subtitle";
    }

    public constructor(props: NavigationScreenProps) {
        super(props);
    }

    public componentWillMount(): void {
        this.setState({
            headerTitle: this.props.navigation.getParam("title")
        });
    }

    public onAlarmPressed(key: number): void {
        this.props.navigation.dispatch(StackActions.push({
            params: {
                alarm: this.state.alarms[key],
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
                    data={this.state.alarms}
                    renderItem={({ item }) => (
                              <ListItem
                                  onPress={this.onAlarmPressed.bind(this, item.key)}
                                  title={EditScheduleScreen.getAlarmTitle(item)}
                                  subtitle={EditScheduleScreen.getAlarmSubtitle(item)}
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
