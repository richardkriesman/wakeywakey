import {Icon} from "expo";
import React, {ReactNode} from "react";

import Colors from "../constants/Colors";

export interface TabBarIconProps {
    name: string;
    focused: boolean;
}

export default class TabBarIcon extends React.Component<TabBarIconProps> {

    public render(): ReactNode {
        return (
            <Icon.Ionicons
                name={this.props.name}
                size={26}
                style={{marginBottom: -3}}
                color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
            />
        );
    }

}
