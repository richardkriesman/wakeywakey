import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-elements";

export interface SnoozeButtonProps {
    onPress : VoidFunction
};

export class SnoozeButton extends React.Component<SnoozeButtonProps> {
    constructor(props : SnoozeButtonProps) {
        super(props);
    }

    render() {
        return (
            <Button
                buttonStyle={styles.button}
                title="Snooze"
                onPress={this.props.onPress}
            />
        );
    }
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'black',
        padding: 15
    }
});
