import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { ListItem, Text } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { UIScreen } from "../../utils/screen/UIScreen";

// tslint:disable-next-line:no-empty-interface
export interface ScheduleOptionsScreenState {

}

export class ScheduleOptionsScreen extends UIScreen<{}, ScheduleOptionsScreenState> {

    public constructor(props: NavigationScreenProps) {
        super(props);
    }

    public renderContent(): ReactNode {
        return (
            <View style={styles.viewScroller}>
                <Text style={styles.textSectionHeader}>Options</Text>

                <ListItem title="Color Scheme" subtitle="Summer" rightIcon={forwardIcon}/>
                <ListItem title="Audio" rightIcon={forwardIcon}/>
                <ListItem title="Snooze" rightIcon={forwardIcon}/>
                <ListItem title="Clock Style" subtitle="Digital" rightIcon={forwardIcon}/>
            </View>
        );
    }
}

const forwardIcon = { name: "arrow-forward", type: "ionicons" };

const styles = StyleSheet.create({
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
