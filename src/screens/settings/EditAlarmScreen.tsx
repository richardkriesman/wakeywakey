import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Divider, ListItem, Text } from "react-native-elements";
import { NavigationScreenProps, StackActions } from "react-navigation";
import { HeaderBackButton } from "../../components/HeaderBackButton";

import { ToggleButton } from "../../components/ToggleButton";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { AlarmModel, DayOfWeek } from "../../models/AlarmModel";

export interface EditAlarmScreenState {
    headerTitle: string;
    alarm?: AlarmModel;
}

export default class EditAlarmScreen extends React.Component<NavigationScreenProps, EditAlarmScreenState> {

    public static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            headerLeft: (
                <HeaderBackButton title="Cancel" navigation={navigation}/>
            ),
            headerRight: (
                <Button type="clear" titleStyle={styles.saveButton} title="Save"
                        onPress={() => {
                            // TODO persistence
                            navigation.dispatch(StackActions.pop({ n: 1 }));
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
            alarm: this.props.navigation.getParam("alarm"),
            headerTitle: this.props.navigation.getParam("title")
        });
    }

    public render(): ReactNode {
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

                <Button buttonStyle={styles.deleteButton} containerStyle={styles.deleteButtonContainer}
                        titleStyle={styles.deleteButtonTitle} title="Delete Alarm"/>
            </View>
        );
    }

    private daysContains(specificDay: DayOfWeek): boolean {
        return this.state.alarm && this.state.alarm.days.indexOf(specificDay) > -1;
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
