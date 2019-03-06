import React, { ReactNode } from "react";
import { Text, StyleSheet } from "react-native";

export interface HomeScreenMessageProps {
    text : string;
}

export class HomeScreenMessage extends React.Component<HomeScreenMessageProps> {
    constructor(props : HomeScreenMessageProps) {
        super(props);
    }

    render() : ReactNode {
        return (
            <Text style={styles.message}>{this.props.text}</Text>
        );
    }
};

const styles = StyleSheet.create({
    message: {
        fontSize: 30,
        textAlign: 'center'
    }
});
