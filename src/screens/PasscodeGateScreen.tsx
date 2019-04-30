import * as React from "react";
import { StyleSheet, View } from "react-native";
import { NavigationScreenProps } from "react-navigation";
import { PasscodeInput } from "../components/PasscodeInput";
import { PasscodeService } from "../services/PasscodeService";

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
        );
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
    mainContainer: {
        alignItems: "center",
        backgroundColor: "lightsteelblue",
        flex: 1,
        justifyContent: "center"
    }
});
