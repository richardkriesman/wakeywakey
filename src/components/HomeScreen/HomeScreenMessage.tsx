/**
 * @module components
 */

import React, { ReactNode } from "react";
import { StyleSheet, Text } from "react-native";

export interface HomeScreenMessageProps {
    text: string;
}

export class HomeScreenMessage extends React.Component<HomeScreenMessageProps> {
    public constructor(props: HomeScreenMessageProps) {
        super(props);
    }

    public render(): ReactNode {
        return (
            <Text style={styles.message}>{this.props.text}</Text>
        );
    }
}

const styles = StyleSheet.create({
    message: {
        fontSize: 30,
        textAlign: "center"
    }
});
