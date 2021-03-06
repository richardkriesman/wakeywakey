/**
 * @module components
 */

import { Icon } from "expo";
import React, { ReactNode } from "react";

import { Colors } from "../constants/Colors";

export interface TabBarIconProps {
    name: string;
    focused: boolean;
}

export class TabBarIcon extends React.Component<TabBarIconProps> {
    public render(): ReactNode {
        return (
            <Icon.Ionicons
                name={this.props.name}
                size={26}
                style={{ marginBottom: -3 }}
                color={this.props.focused ? Colors.common.tab.icon.selected : Colors.common.tab.icon.default}
            />
        );
    }
}
