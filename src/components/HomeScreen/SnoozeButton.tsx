/**
 * @module components
 */

import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { Colors } from "../../constants/Colors";

export interface SnoozeButtonProps {
    onPress: VoidFunction;
}

export class SnoozeButton extends React.Component<SnoozeButtonProps> {
    public constructor(props: SnoozeButtonProps) {
        super(props);
    }

    public render(): ReactNode {
        return (
            <Button
                buttonStyle={styles.button}
                title="Snooze"
                onPress={this.props.onPress}
            />
        );
    }
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.black,
        padding: 15
    }
});
