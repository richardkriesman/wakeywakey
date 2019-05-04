import * as React from "react";
import { StyleSheet, View } from "react-native";
import { NavigationScreenProps } from "react-navigation";
import { FloatingDismissButton } from "../components/FloatingDismissButton";
import { PasscodeInput } from "../components/PasscodeInput";
import { PasscodeService } from "../services/PasscodeService";
import * as Log from "../utils/Log";

import { NoHeader } from "../utils/screen/NavigationOptions";
import { UIScreen } from "../utils/screen/UIScreen";

export interface PasscodeGateScreenState {
    hasPasscode: boolean;
    successScreenKey: string;
}

/* hey remember that long readme block comment i had about this being a hack? miika saved it and it's good now - sL */

@NoHeader
export default class PasscodeGateScreen extends UIScreen<{}, PasscodeGateScreenState> {
    public constructor(props: NavigationScreenProps) {
        super(props);
        this.state = {
            hasPasscode: props.navigation.getParam("hasPasscode"),
            successScreenKey: props.navigation.getParam("successScreenKey")
        };
    }

    protected renderContent(): React.ReactNode {
        return (
            <View style={styles.mainContainer}>
                <FloatingDismissButton onPress={this.onDismiss.bind(this)}/>
                <View style={styles.centered}>
                    {
                        this.state.hasPasscode
                            ?
                            // a passcode exists. prompt for it
                            <PasscodeInput
                                handleSuccess={this.onSuccess.bind(this)}
                                verifyPasscode={this.verifyPasscode.bind(this)}
                            />
                            :
                            // no passcode exists. require user to create one.
                            <PasscodeInput
                                confirmPasscode={true}
                                defaultPromptText={"Enter new Settings passcode:"}
                                handleSuccess={this.onSuccess.bind(this)}
                            />
                    }
                </View>
            </View>
        );
    }

    private onDismiss(): void {
        Log.info("PasscodeGateScreen", "dismiss button pressed");
        this.dismiss();
    }

    private async onSuccess(passcode: string): Promise<void> {
        await this.getService(PasscodeService).setPasscode(passcode);
        this.replace(this.state.successScreenKey);
    }

    private async verifyPasscode(passcode: string): Promise<boolean> {
        return this.getService(PasscodeService).verifyPasscode(passcode);
    }
}

const styles = StyleSheet.create({
    centered: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center"
    },
    mainContainer: {
        backgroundColor: "lightsteelblue",
        flex: 1
    }
});
