import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

import { Text } from "react-native";

export interface HomeScreenClockProps {
    wrapperStyle?   : ViewStyle;
}

/**
 * The clock on the home screen.
 * 
 * @author Shawn Lutch
 */
export class HomeScreenClock extends React.Component<HomeScreenClockProps> {
    constructor(props : HomeScreenClockProps) {
        super(props);
    }

    _pad(num : number) : string {
        return (num < 10 ? '0' : '') + num;
    }

    render() : ReactNode {
        let now = new Date();

        return (
            <View style={this.props.wrapperStyle}>
                <Text style={styles.clock}>
                    {this._pad(now.getHours())}:{this._pad(now.getMinutes())}
                </Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    clock: {
        color: 'black',
        fontSize: 70,
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center'
    }
});
