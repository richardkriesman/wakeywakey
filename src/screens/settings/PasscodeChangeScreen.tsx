import React, { ReactNode } from "react";
import { Keyboard, StyleSheet, Text, TextInput, View } from "react-native";
import { NavigationScreenProps } from "react-navigation";

import { NoHeader, UIScreen } from "../../utils/screen";

@NoHeader
export default class PasscodeChangeScreen extends UIScreen<{}, {}> {
    public keyboardDidHideListener: any;

    public constructor(props: NavigationScreenProps) {
        super(props);
    }

    public componentWillMount(): void {
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

    public handleChangeText(text: string): void {
        console.debug("password:", text);
        if (text.length === 4) {
            this.dismiss();
        }
    }

    public renderContent(): ReactNode {
        return (
            <View style={styles.main}>
                <Text>Enter new Settings passcode:</Text>
                <TextInput
                    autoFocus={true}
                    caretHidden={true}
                    keyboardType={"number-pad"}
                    maxLength={4}
                    onChangeText={this.handleChangeText.bind(this)}
                    secureTextEntry={true}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center"
    }
});
