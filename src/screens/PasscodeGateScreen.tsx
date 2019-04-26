import * as React from "react";
import { StyleSheet, View } from "react-native";
import { NavigationScreenProps } from "react-navigation";
import { PasscodeInput } from "../components/PasscodeInput";
import { PasscodeService } from "../services/PasscodeService";

import { NoHeader, Title } from "../utils/screen/NavigationOptions";
import { UIScreen } from "../utils/screen/UIScreen";

export interface PasscodeGateScreenState {
    hasPasscode: boolean;
    verified: boolean;
    successScreenKey: string;
}

/*  README BELOW README BELOW README BELOW README BELOW README BELOW README BELOW README BELOW README BELOW
*
*   this is an absolute hack and i would prefer to instead have this screen remove itself from the stack;
*   however, react-navigation does not have a way to do this natively and i really don't feel like hacking
*   around the Router, especially with all of the work Richard did on UIScreen's navigation handling.
*
*   eventually we can refactor this into a Modal, which would probably be the best option, but this is all
*   i have time to do right now. sorry for this terrible hack.
*
*   should ABSOLUTELY UNDER NO CIRCUMSTANCES hard-code the title like this for something of this nature,
*   but since we're only using this in one specific instance i've done it to save time.
*
*   jesus christ this hack is god awful
*
*   - shawn, 25 apr 2019 (23:30, night before demo)
*
*   README ABOVE README ABOVE README ABOVE README ABOVE README ABOVE README ABOVE README ABOVE README ABOVE
*/

@NoHeader
@Title("Home") // DON'T DO THIS NEVER DO THIS
export default class PasscodeGateScreen extends UIScreen<{}, PasscodeGateScreenState> {
    public constructor(props: NavigationScreenProps) {
        super(props);
        this.state = {
            hasPasscode: props.navigation.getParam("hasPasscode"),
            successScreenKey: props.navigation.getParam("successScreenKey"),
            verified: false
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

    protected componentWillFocus(): void {
        // if we've already completed this gate, dismiss it immediately
        if (this.state.verified) {
            this.dismiss();
        }
    }

    private onSuccess(): void {
        this.updateState({ verified: true });
        this.present(this.state.successScreenKey);
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
