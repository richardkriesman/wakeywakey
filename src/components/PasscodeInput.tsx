/**
 * @module components
 */

import { AntDesign } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import ReactNative, { StyleSheet, View } from "react-native";
import { Input, Text } from "react-native-elements";

const PASSCODE_LENGTH = 4;

export interface PasscodeInputProps {
    // optional
    confirmPasscode: boolean; // whether to confirm, does nothing if mustEqual is set
    defaultConfirmText: string;
    defaultPromptText: string;
    mustEqual: string; // passcode must equal this for success

    // required
    handleSuccess(passcode: string): void;
}

export interface PasscodeInputState {
    errorMessage: string;
    isConfirming: boolean;
    passcode: string;
    promptText: string;
}

/**
 * PasscodeInput
 * This component allows the user to enter a passcode.
 * You can set whether to confirm or match password to a set password.
 * When success, handleSuccess is called.
 */

export class PasscodeInput extends React.Component<PasscodeInputProps, PasscodeInputState> {
    public static defaultProps = {
        confirmPasscode: false,
        defaultConfirmText: "Confirm your passcode:",
        defaultPromptText: "Enter passcode:",
        mustEqual: ""
    };

    private inputRef = React.createRef<Input>();

    public constructor(props: PasscodeInputProps) {
        super(props);
    }

    public componentWillMount(): void {
        this.setState({
            errorMessage: "",
            isConfirming: false,
            passcode: "",
            promptText: this.props.defaultPromptText
        });
    }

    public handleChangeText(): void {
        if (this.state.errorMessage.length !== 0) {
            this.setState({ errorMessage: "" });
        }
    }

    public handleSubmitEditing(event:
            ReactNative.NativeSyntheticEvent<ReactNative.TextInputSubmitEditingEventData>): void {
        const passcode: string = event.nativeEvent.text;

        if (passcode.length !== PASSCODE_LENGTH) { // passcode too short
            this.setState({
                errorMessage: "Passcode must be " + PASSCODE_LENGTH + " digits long!"
            });
        } else { // passcode long enough

            // check state of input (choosing or confirming)
            if (!this.state.isConfirming) {
                this.handleChoosingPasscode(passcode);
            } else {
                this.handleConfirmingPasscode(passcode);
            }
        }
    }

    /**
     * handles choosing passcode
     * Sets the state to confirming.
     * If mustEqual is set, checks if passcode is equal. If not equal, resets.
     */
    public handleChoosingPasscode(passcode: string): void {
        if (this.props.mustEqual !== "") {
            if (passcode === this.props.mustEqual) { // correct passcode
                this.props.handleSuccess(passcode); // done!
            } else { // incorrect passcode
                this.setState({
                    errorMessage: "Incorrect passcode!",
                    passcode: ""
                });
                this.inputRef.current.clear();
            }
        } else {
            if (this.props.confirmPasscode) { // switch to confirming
                this.setState({
                    isConfirming: true,
                    passcode,
                    promptText: this.props.defaultConfirmText
                });
                this.inputRef.current.clear();
            } else { // not confirming passcode
                this.props.handleSuccess(passcode);
            }
        }
    }

    /**
     * handles confirming passcode
     * Checks if passcode is correct and calls handleSuccess if yes.
     */
    public handleConfirmingPasscode(passcode: string): void {
        if (passcode === this.state.passcode) { // correct passcode
            this.props.handleSuccess(passcode); // done!
        } else { // incorrect passcode
            this.setState({
                errorMessage: "Passcodes don't match!",
                isConfirming: false,
                passcode: "",
                promptText: this.props.defaultPromptText
            });
            this.inputRef.current.clear();
        }
    }

    public render(): ReactNode {
        return (
            <View style={styles.mainContainer}>
                <Text style={styles.promptStyle}>
                    {this.state.promptText}
                </Text>
                <Input
                    containerStyle={styles.containerStyle}
                    inputContainerStyle={styles.inputContainerStyle}
                    inputStyle={styles.inputStyle}

                    autoFocus={true}
                    blurOnSubmit={false}
                    caretHidden={true}
                    errorMessage={this.state.errorMessage}
                    keyboardType="numeric"
                    leftIcon={ <AntDesign name="lock" size={32} /> }
                    maxLength={PASSCODE_LENGTH}
                    onChangeText={this.handleChangeText.bind(this)}
                    onSubmitEditing={this.handleSubmitEditing.bind(this)}
                    ref={this.inputRef}
                    secureTextEntry={true}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: "white",
        borderRadius: 5,
        marginTop: 20,
        width: "70%"
    },
    errorStyle: {
        color: "red",
        textAlign: "center"
    },
    inputContainerStyle: {
        marginBottom: 5,
        marginTop: 5
    },
    inputStyle: {
        fontSize: 32,
        letterSpacing: 30,
        marginLeft: 10,
        textAlign: "left"
    },
    mainContainer: {
        alignItems: "center",
        bottom: 50,
        flex: 1,
        justifyContent: "center",
        width: "100%"
    },
    promptStyle: {
        color: "black",
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center"
    }
});
