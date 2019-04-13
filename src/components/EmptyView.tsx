import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

export interface EmptyViewProps {
    icon: string;
    title: string;
    subtitle: string;
}

export class EmptyView extends React.Component<EmptyViewProps> {

    public render(): React.ReactNode {
        return (
            <View style={styles.container}>
                <Ionicons name={this.props.icon} size={64} />
                <Text style={styles.title}>{this.props.title}</Text>
                <Text style={styles.subtitle}>{this.props.subtitle}</Text>
            </View>
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
    }
});
