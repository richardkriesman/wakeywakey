import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import Colors from "../constants/Colors";

export interface EmptyViewProps {
    icon: string;
    title: string;
    subtitle: string;
    onPress?: () => void;
}

export class EmptyView extends React.Component<EmptyViewProps> {

    public render(): React.ReactNode {
        return (
            <TouchableWithoutFeedback onPress={this.props.onPress}>
                <View style={styles.container}>
                    <Ionicons name={this.props.icon} size={64} />
                    <Text style={styles.title}>{this.props.title}</Text>
                    <Text style={[styles.subtitle, this.props.onPress && styles.touchableSubtitle]}>
                        {this.props.subtitle}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

}

export const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center"
    },
    subtitle: {
        color: Colors.subheaderColor,
        fontSize: 15
    },
    title: {
        fontSize: 17
    },
    touchableSubtitle: {
        color: Colors.common.tint.constructive
    }
});
