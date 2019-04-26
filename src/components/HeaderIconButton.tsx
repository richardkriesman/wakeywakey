/**
 * @module components
 */

import React, { ReactNode } from "react";
import {StyleProp, StyleSheet, ViewStyle} from "react-native";
import { Button, Icon } from "react-native-elements";

import Colors from "../constants/Colors";

export interface HeaderButtonProps {
    color?: string;
    icon: string;
    iconSet?: string;
    onPress: VoidFunction;
    position?: "left" | "right";
}

/**
 * A header button that displays an icon.
 */
export class HeaderIconButton extends React.Component<HeaderButtonProps> {

    public constructor(props: HeaderButtonProps) {
        super(props);
    }

    public render(): ReactNode {
        const color: string = this.props.color || Colors.common.tint.constructive;
        const iconSet: string = this.props.iconSet || "ionicons";
        const style: StyleProp<ViewStyle> = this.props.position === "left" ? styles.topLeftButton :
            styles.topRightButton;

        return (
            <Button
                type="clear"
                buttonStyle={style}
                onPress={this.props.onPress.bind(this)}
                icon={<Icon name={this.props.icon} type={iconSet} color={color} />}
            />
        );
    }

}

const styles = StyleSheet.create({
    topLeftButton: {
        marginLeft: 10
    },
    topRightButton: {
        marginRight: 10
    }
});
