import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle} from "react-native";

import { Text } from "react-native";

interface HomeScreenClockProps {
    wrapperStyle?: ViewStyle;
}

interface HomeScreenClockState {
    hours: string;
    minutes: string;
    am_pm: string;
}

/**
 * The clock on the home screen.
 *
 * @author Shawn Lutch
 */
export class HomeScreenClock extends React.Component<HomeScreenClockProps, HomeScreenClockState> {
    public constructor(props: HomeScreenClockProps) {
        super(props);

        this.state = { hours: "", minutes: "", am_pm: "" };
    }

    /**
     * Runs just before render().
     * Update internal date initially, then schedule another update every second.
     */
    public componentWillMount(): void {
        this.updateInternalDate();
        setInterval(this.updateInternalDate.bind(this), 1000);
    }

    public render(): ReactNode {
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

    /**
     * Update the state using a `new Date()` as `now`.
     */
    private updateInternalDate(): void {
        const now: Date = new Date();

        let hours: number = now.getHours();
        hours = hours <= 12 ? hours : (hours % 12);

        const isPm: boolean = now.getHours() >= 12;

        this.setState({
            am_pm: isPm ? "PM" : "AM",
            hours: this.pad(hours, 1),
            minutes: this.pad(now.getMinutes(), 2)
        });
    }

    /**
     * Pads a number out into a string with a minimum number of digits.
     * e.g. `_pad(2, 2) => '02'`, `_pad(12, 1) => '12'`
     *
     * @param num The number to pad
     * @param digits The minimum number of digits to pad to
     */
    private pad(num: number, digits: number = 2): string {
        let result = "" + num;
        while (result.length < digits) { result = "0" + result; }
        return result;
    }
}

const styles = StyleSheet.create({
    clockText: {
        fontSize: 60,
        textAlign: "center"
    },
    innerWrapper: {
        marginBottom: 20,
        marginTop: 20
    }
});
