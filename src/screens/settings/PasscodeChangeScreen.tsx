import React, { ReactNode } from "react";
import { Keyboard, StyleSheet, Text, TextInput, View } from "react-native";
import { NavigationActions, NavigationScreenProps, StackActions } from "react-navigation";

import { NoHeader, UIScreen } from "../../utils/screen";

const PASSCODE_LENGTH = 4;

interface PasscodeChangeScreenState {
    confirmText: string;
    errorText: string;
    isConfirming: boolean;
    promptText: string;
    passcode: string;
}

@NoHeader
export default class PasscodeChangeScreen extends UIScreen<{}, PasscodeChangeScreenState> {
    public defaultConfirmText: string = "Confirm your passcode:";
    public defaultErrorText: string = " ";
    public defaultPromptText: string = "Enter new Settings passcode:";
    public keyboardDidHideListener: any;
    public textInputRef = React.createRef<TextInput>();

    public constructor(props: NavigationScreenProps) {
        super(props);
    }

    public componentWillMount(): void {
        this.setState({
            confirmText: this.defaultConfirmText,
            errorText: this.defaultErrorText,
            isConfirming: false,
            passcode: "",
            promptText: this.defaultPromptText
        });
        this.keyboardDidHideListener = Keyboard.addListener(
            "keyboardDidHide",
            this.keyboardDidHide.bind(this)
        );
    }

    public componentWillUnmount(): void {
        this.keyboardDidHideListener.remove();
    }

    // closes screen if keyboard is closed
    public keyboardDidHide(): void {
        console.debug("keyboard closed");
        this.dismiss();
    }

    public setPasscode(passcode: string): void {
        this.keyboardDidHideListener.remove();
        console.debug("passcode set");

        // TODO: logic for saving passcode
    }

    public handleChangeText(passcode: string): void {
        this.setState({ errorText: this.defaultErrorText });

        if (passcode.length === PASSCODE_LENGTH) {
            console.debug("passcode received: " + passcode);

            if (this.state.isConfirming) {
                if (passcode === this.state.passcode) {
                    this.setPasscode(passcode);
                    // this.dismiss();
                    this.props.navigation.dispatch(StackActions.replace({
                        routeName: "SettingsMain"
                    }));
                } else {
                    this.setState({
                        errorText: "Passcodes don't match",
                        isConfirming: false,
                        passcode: "",
                        promptText: this.defaultPromptText
                    });
                    this.textInputRef.current.clear();
                }
            } else { // choosing
                this.setState({
                    isConfirming: true,
                    passcode,
                    promptText: this.defaultConfirmText
                });
                this.textInputRef.current.clear();
            }
        }
    }

    public handleSubmitEditing(): void {
        this.setState({ errorText: "password must be " + PASSCODE_LENGTH + " digits long" });
    }

    public renderContent(): ReactNode {
        return (
            <View style={styles.mainContainer}>
                <Text style={styles.promptText}>{this.state.promptText}</Text>
                <Text style={styles.errorText}>{this.state.errorText}</Text>
                <TextInput style={styles.textInput}
                    autoFocus={true}
                    blurOnSubmit={false}
                    caretHidden={true}
                    keyboardType={"number-pad"}
                    maxLength={PASSCODE_LENGTH}
                    onChangeText={this.handleChangeText.bind(this)}
                    onSubmitEditing={this.handleSubmitEditing.bind(this)}
                    ref={this.textInputRef}
                    secureTextEntry={true}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    errorText: {
        color: "red",
        fontSize: 15
    },
    mainContainer: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center"
    },
    promptText: {
        fontSize: 20
    },
    textInput: {
        fontSize: 50
    }
});
