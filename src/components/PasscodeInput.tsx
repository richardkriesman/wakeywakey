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
    confirmPasscode: boolean; // whether to confirm, does nothing if verifyPasscode is set
    defaultConfirmText: string;
    defaultPromptText: string;
    verifyPasscode?(passcode: string): Promise<boolean>; // checks if passcode is correct

    // required
    handleSuccess(passcode: string): void;
}

export interface PasscodeInputState {
    errorMessage: string;
    isConfirming: boolean;
    passcode: string;
    promptText: string;
}

type PasscodeEnteredEvent = ReactNative.NativeSyntheticEvent<ReactNative.TextInputSubmitEditingEventData>;

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
        defaultPromptText: "Enter passcode:"
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

    public async handleChangeText(passcode: string): Promise<void> {
        if (passcode.length === PASSCODE_LENGTH) { // passcode correct length
            if (!this.state.isConfirming) {
                await this.handleChoosingPasscode(passcode);
            } else {
                this.handleConfirmingPasscode(passcode);
            }
        } else { // clear error message
            if (this.state.errorMessage.length !== 0) {
                this.setState({ errorMessage: "" });
            }
        }
    }

    public handleSubmitEditing(event: PasscodeEnteredEvent): void {
        const passcode: string = event.nativeEvent.text;

        if (passcode.length !== PASSCODE_LENGTH) { // passcode too short
            this.setState({
                errorMessage: "Passcode must be " + PASSCODE_LENGTH + " digits long!"
            });
        }
    }

    /**
     * handles choosing passcode
     * Sets the state to confirming.
     * If verifyPasscode is set, checks if passcode is equal. If not equal, resets.
     */
    public async handleChoosingPasscode(passcode: string): Promise<void> {
        if (this.props.verifyPasscode) {
            if (await this.props.verifyPasscode(passcode)) { // correct passcode
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
                    errorMessage: "",
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
                    errorStyle={styles.errorStyle}
                    inputContainerStyle={styles.inputContainerStyle}
                    inputStyle={styles.inputStyle}

                    autoFocus={true}
                    blurOnSubmit={false}
                    caretHidden={true}
                    contextMenuHidden={true}
                    errorMessage={this.state.errorMessage}
                    keyboardType="numeric"
                    leftIcon={ <AntDesign name="lock" size={32} /> }
                    maxLength={PASSCODE_LENGTH}
                    onChangeText={this.handleChangeText.bind(this)}
                    onSubmitEditing={this.handleSubmitEditing.bind(this)}
                    ref={this.inputRef}
                    returnKeyType={"done"}
                    secureTextEntry={true}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    containerStyle: {
        height: "55%"
    },
    errorStyle: {
        color: "darkred",
        fontSize: 15,
        textAlign: "center"
    },
    inputContainerStyle: {
        backgroundColor: "white",
        width: "70%"
    },
    inputStyle: {
        fontSize: 30,
        letterSpacing: 20,
        marginRight: 32,
        textAlign: "center"
    },
    mainContainer: {
        alignItems: "center",
        flex: 1,
        justifyContent: "flex-end"
    },
    promptStyle: {
        fontSize: 32,
        fontWeight: "bold",
        paddingBottom: 20,
        textAlign: "center"
    }
});
