import * as React from "react";
import { StyleSheet } from "react-native";
import { Button, ButtonProps } from "react-native-elements";
import Colors from "../constants/Colors";

export class FloatingDismissButton extends React.Component<ButtonProps> {
    public constructor(props: ButtonProps) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <Button
                icon={{ name: "close" }}
                buttonStyle={styles.floatButton}
                onPress={this.props.onPress}
            />
        );
    }
}

const styles = StyleSheet.create({
    floatButton: {
        backgroundColor: Colors.common.tint.destructive,
        height: 50,
        left: 10,
        position: "absolute",
        top: 10,
        width: 50
    }
});
