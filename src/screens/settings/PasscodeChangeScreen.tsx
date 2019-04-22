/**
 * @module screens
 */

import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationScreenProps, StackActions } from "react-navigation";

import { PasscodeInput } from "../../components/PasscodeInput";
import { PasscodeService } from "../../services/PasscodeService";
import * as Log from "../../utils/Log";
import { NoHeader, UIScreen } from "../../utils/screen";

const PASSCODE_LOG_TAG: string = "Security";

@NoHeader
export default class PasscodeChangeScreen extends UIScreen<{}, {}> {

    public constructor(props: NavigationScreenProps) {
        super(props);
    }

    // handles passcodeinput success
    public async handleSuccess(passcode: string): Promise<void> {
        try {
            await this.getService(PasscodeService).setPasscode(passcode); // set the passcode in the database
        } catch (err) {
            Log.error(PASSCODE_LOG_TAG, "Failed to update user passcode");
            Log.error(PASSCODE_LOG_TAG, err);
        }
        this.dismiss();
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
