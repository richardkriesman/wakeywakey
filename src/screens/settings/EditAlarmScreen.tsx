import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Divider, ListItem, Text } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";

import {ToggleButton} from "../../components/ToggleButton";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";

// tslint:disable-next-line:no-empty-interface
export interface EditAlarmScreenState {
    headerTitle: string;
}

export default class EditAlarmScreen extends React.Component<NavigationScreenProps, EditAlarmScreenState> {

    public static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            headerLeft: (
                <Button type="clear" titleStyle={styles.cancelButton} title="Cancel"
                        onPress={() => {
                            navigation.navigate("SettingsMain");
                        }}/>
            ),
            headerRight: (
                <Button type="clear" titleStyle={styles.saveButton} title="Save"
                        onPress={() => {
                            navigation.navigate("SettingsMain");
                        }}/>
            ),
            title: navigation.getParam("title")
        };
    }

    public constructor(props: NavigationScreenProps) {
        super(props);
    }

    public componentWillMount(): void {
        this.setState({
            headerTitle: this.props.navigation.getParam("title")
        });
    }

    public render(): ReactNode {
        return (
            <View style={styles.viewScroller}>
                <Text style={styles.textSectionHeader}>Days</Text>
                <View style={styles.daySelector}>
                    <ToggleButton title="M"/>
                    <ToggleButton title="Tu"/>
                    <ToggleButton title="W"/>
                    <ToggleButton title="Th"/>
                    <ToggleButton title="F"/>
                    <ToggleButton title="Sa"/>
                    <ToggleButton title="Su"/>
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
