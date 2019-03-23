import React, {ReactNode} from "react";
import {StyleSheet, Text, View} from "react-native";
import Colors from "../constants/Colors";

export interface ToggleButtonProps {
    backgroundColor?: string;
    textColor?: string;
    title: string;
}

export class ToggleButton extends React.Component<ToggleButtonProps> {

    private backgroundColor: string;
    private textColor: string;

    public constructor(props: ToggleButtonProps) {
        super(props);
        this.backgroundColor = props.backgroundColor || Colors.black;
        this.textColor = props.textColor || Colors.white;
    }

    public render(): ReactNode {
        return (
            <View style={[styles.container, { backgroundColor: this.props.backgroundColor }]}>
                <Text>{this.props.title}</Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        height: 100,
        width: 100
    },
    text: {
        alignContent: "center",
        justifyContent: "center"
    }
});
