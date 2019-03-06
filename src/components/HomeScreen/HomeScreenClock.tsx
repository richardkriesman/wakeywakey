import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle, YellowBox } from "react-native";

import { Text } from "react-native";
import { number } from "prop-types";

interface HomeScreenClockProps {
    wrapperStyle? : ViewStyle;
}

interface HomeScreenClockState {
    hours: string
    minutes: string
    am_pm: string
}

/**
 * The clock on the home screen.
 * 
 * @author Shawn Lutch
 */
export class HomeScreenClock extends React.Component<HomeScreenClockProps, HomeScreenClockState> {
    constructor(props : HomeScreenClockProps) {
        super(props);

        this.state = { hours: '', minutes: '', am_pm: '' };
    }

    /**
     * Runs just before render().
     * Update internal date initially, then schedule another update every second.
     */
    componentWillMount() : void {
        this.updateInternalDate();
        setInterval(this.updateInternalDate.bind(this), 1000);
    }

    /**
     * Update the state using a `new Date()` as `now`.
     */
    updateInternalDate() : void {
        let now : Date = new Date();

        let hours : number = now.getHours();
        hours = hours <= 12 ? hours : (hours % 12);

        let isPm : boolean = now.getHours() >= 12;

        this.setState({
            hours: this._pad(hours, 1),
            minutes: this._pad(now.getMinutes(), 2),
            am_pm: isPm ? 'PM' : 'AM'
        });
    }

    /**
     * Pads a number out into a string with a minimum number of digits.
     * e.g. `_pad(2, 2) => '02'`, `_pad(12, 1) => '12'`
     * 
     * @param num The number to pad
     * @param digits The minimum number of digits to pad to
     */
    _pad(num : number, digits : number = 2) : string {
        let result = '' + num;
        while (result.length < digits) { result = '0' + result; }
        return result;
    }

    render() : ReactNode {
        return (
            <View style={this.props.wrapperStyle}>
                <View style={styles.innerWrapper}>
                    <Text style={styles.clockText}>
                        {this.state.hours}:{this.state.minutes} {this.state.am_pm}
                    </Text>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    innerWrapper: {
        marginTop: 20,
        marginBottom: 20,
    },
    clockText: {
        textAlign: 'center',
        fontSize: 60,
    }
});
