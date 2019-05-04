/**
 * @module components
 */

import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { Text } from "react-native";

interface ClockProps {
    wrapperStyle?: ViewStyle;
    twentyFourHour: boolean;
}

interface ClockState {
    date?: Date;
}

/**
 * The clock on the home screen.
 *
 * @author Shawn Lutch
 */
export class Clock extends React.Component<ClockProps, ClockState> {

    /**
     * Get the number of hours past midnight
     */
    public get hours(): number {
        return this.state.date.getHours();
    }

    /**
     * Get the number of minutes since the last hour rollover
     */
    public get minutes(): number {
        return this.state.date.getMinutes();
    }

    /**
     * Get a 12- or 24-hour formatted time string, based on twentyFourHour prop
     */
    public get timeString(): string {
        return this.props.twentyFourHour ? this.get24hString() : this.get12hString();
    }

    /**
     * Pads a number out into a string with a minimum number of digits.
     * e.g. `pad(2, 2) => '02'`, `pad(12, 1) => '12'`
     *
     * @param num The number to pad
     * @param digits The minimum number of digits to pad to
     */
    private static pad(num: number, digits: number = 2): string {
        let result = "" + num;
        while (result.length < digits) {
            result = "0" + result;
        }
        return result;
    }

    public constructor(props: ClockProps) {
        super(props);

        this.state = { date: new Date() };
    }

    /**
     * Runs just before render().
     * Update internal date initially, then schedule another update every second.
     */
    public componentWillMount(): void {
        this.updateInternalDate();
    }

    /**
     * Rendering method.
     * Runs initially after componentWillMount(), and then again anytime the state changes.
     */
    public render(): ReactNode {
        return (
            <View style={this.props.wrapperStyle}>
                <View style={styles.innerWrapper}>
                    <Text style={styles.clockText}>
                        {this.timeString}
                    </Text>
                </View>
            </View>
        );
    }

    /**
     * Set the date displayed on the clock. Changes state, so render() will be called again as a result.
     * @param date The date to display on the clock
     * @param callback Callback passed to setState()
     */
    public setDate(date: Date, callback: () => void): void {
        this.setState({ date }, callback);
    }

    private get24hString(): string {
        return `${Clock.pad(this.hours)}:${Clock.pad(this.minutes)}`;
    }

    private get12hString(): string {
        let hours = this.hours;
        const ampm = this.hours >= 12 ? "pm" : "am";

        hours = hours % 12;
        hours = hours ? hours : 12;

        return `${hours}:${Clock.pad(this.minutes)} ${ampm}`;
    }

    /**
     * Schedules a clock update when the system time advances to the next second.
     * TODO will become obsolete once timer service is implemented -sL 3/26
     */
    private scheduleClockUpdate(): void {
        const msUntilNextSecond: number = 1000 - (new Date()).getMilliseconds();
        setTimeout(this.updateInternalDate.bind(this), msUntilNextSecond);
    }

    /**
     * Update the state using a `new Date()` as `now`.
     */
    private updateInternalDate(): void {
        // TODO needs to come from timer service once that's implemented -sL 3/26
        const now: Date = new Date();

        this.setDate(now, () => {
            this.scheduleClockUpdate();
        });
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
