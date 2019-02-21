import React, {ReactNode} from "react";
import {StyleProp, Text, TextStyle} from "react-native";

export interface MonoTextProps {
    style?: StyleProp<TextStyle>;
}

export class MonoText extends React.Component<MonoTextProps> {

    public render(): ReactNode {
        return <Text {...this.props} style={[this.props.style, { fontFamily: "SpaceMono" }]}/>;
    }

}
