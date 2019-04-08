import React, { ReactNode } from "react";
import { Keyboard, StyleSheet, Text, TextInput, View } from "react-native";
import { NavigationActions, NavigationScreenProps, StackActions } from "react-navigation";

import { PasscodeInput } from "../../components/PasscodeInput";
import { NoHeader, UIScreen } from "../../utils/screen";

@NoHeader
export default class PasscodeChangeScreen extends UIScreen<{}, {}> {

    public constructor(props: NavigationScreenProps) {
        super(props);
    }

    // handles passcodeinput success
    public handleSuccess(passcode: string): void {

        // TODO: set passcode logic here

        this.props.navigation.dispatch(StackActions.replace({
            routeName: "SettingsMain"
        }));
    }

    public renderContent(): ReactNode {
        return (
            <View style={styles.mainContainer}>
                <PasscodeInput
                    confirmPasscode={true}
                    defaultPromptText={"Enter new Settings passcode:"}
                    handleSuccess={this.handleSuccess.bind(this)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    mainContainer: {
        alignItems: "center",
        backgroundColor: "lightsteelblue",
        flex: 1,
        justifyContent: "center"
    }
});
