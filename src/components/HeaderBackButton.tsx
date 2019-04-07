/**
 * @module components
 */

import * as React from "react";
import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-elements";

import Colors from "../constants/Colors";

export interface HeaderBackButtonProps {
    title: string;
    onPress: () => void;
}

export class HeaderBackButton extends React.Component<HeaderBackButtonProps> {
    public constructor(props: HeaderBackButtonProps) {
        super(props);
    }

    public render(): ReactNode {
        return (
            <Button type="clear" titleStyle={styles.title} title={this.props.title}
                    onPress={this.props.onPress}/>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        color: Colors.appleButtonRed,
        marginLeft: 10
    }
});
