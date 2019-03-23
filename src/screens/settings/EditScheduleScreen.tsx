import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Divider, ListItem, Text } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";

import { HeaderAddButton } from "../../components/MainSettingsScreen/HeaderAddButton";

// tslint:disable-next-line:no-empty-interface
export interface EditScheduleScreenState {
    headerTitle: string;
}

export default class EditScheduleScreen extends React.Component<NavigationScreenProps, EditScheduleScreenState> {

    public static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            headerLeft: (
                <Button type="clear" titleStyle={styles.cancelButton} title="Back"
                        onPress={() => {
                            navigation.navigate("SettingsMain");
                        }}/>
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
            headerTitle: this.props.navigation.getParam("title")
        });
    }

    public render(): ReactNode {
        return (
            <View style={styles.viewScroller}>
                <Text style={styles.textSectionHeader}>Alarms</Text>
                <ListItem key={0} title="8:00 PM - 6:00 AM" subtitle="M, Tu, W, Th, F"
                          rightIcon={{ name: "arrow-forward" }}/>
                <ListItem key={1} title="10:00 PM - 8:00 AM" subtitle="Sa, Su" rightIcon={{ name: "arrow-forward" }}/>
                <Divider style={styles.divider}/>
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
