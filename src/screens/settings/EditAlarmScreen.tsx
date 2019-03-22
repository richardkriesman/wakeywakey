import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";

import Colors from "../../constants/Colors";

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
            <View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    cancelButton: {
        color: Colors.appleButtonRed,
        marginLeft: 10
    },
    saveButton: {
        color: Colors.appleButtonBlue,
        fontWeight: "500",
        marginRight: 10
    }
});
