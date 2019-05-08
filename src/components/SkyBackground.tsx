import React, { ReactNode } from "react";
import { Animated, LayoutChangeEvent, LayoutRectangle, SafeAreaView, StyleSheet, View, ViewStyle } from "react-native";
import { AnimationCurves } from "../constants/Animation";
import { Alarm } from "../models/Alarm";
import { Time } from "../utils/Time";

export interface SkyBackgroundProps {
    alarm?: Alarm;
    onThemeTransition?: (isDarkTheme: boolean) => void;
    time: Time;
}

enum SkyBackgroundDirection {
    Sunrise = 0,
    Sunset = 1
}

interface SkyBackgroundState {
    direction: SkyBackgroundDirection;
    isDarkTheme?: boolean;
    value: number;
    valueAnim: Animated.Value;
}

const BACKGROUND_HEIGHT: number = 270;
const FOREGROUND_HEIGHT: number = 230;

export class SkyBackground extends React.Component<SkyBackgroundProps, SkyBackgroundState> {

    private layout?: LayoutRectangle;

    public constructor(props: SkyBackgroundProps) {
        super(props);
        const value: number = this.getValueFromTime(props.time, props.alarm);
        this.state = {
            direction: SkyBackgroundDirection.Sunset,
            value,
            valueAnim: new Animated.Value(value)
        };
    }

    public componentDidUpdate(prevProps: Readonly<SkyBackgroundProps>, prevState: Readonly<SkyBackgroundState>,
                              snapshot?: any): void {

        // if time has changed, animate to new time
        if (!prevProps.time.equals(this.props.time) || prevProps.alarm !== this.props.alarm) {
            this.animateToValue(this.getValueFromTime(this.props.time, this.props.alarm));
        }

    }

    public componentWillMount(): void {

        // fire theme transition handler on update
        this.state.valueAnim.addListener((state) => {
            this.setState({
                value: state.value
            }, () => {
                if (this.props.onThemeTransition) {
                    const isDarkTheme: boolean = this.isDarkTheme(this.state.direction, state.value);
                    if (isDarkTheme !== this.state.isDarkTheme) { // theme transition
                        this.props.onThemeTransition(isDarkTheme);
                    }
                }
            });
        });

    }

    public render(): ReactNode {

        // build background color interpolator
        const containerStyle: any = {};
        if (this.state.direction === SkyBackgroundDirection.Sunset) { // sunset interpolation
            containerStyle.backgroundColor = this.state.valueAnim.interpolate({
                inputRange: [0.0, 0.75, 0.8, 0.9, 1.0],
                outputRange: ["#0a0a2b", "#8b4789", "#ffb90f", "#ffd700", "#d4d4f7" ]
            });
        } else { // sunrise interpolation
            containerStyle.backgroundColor = this.state.valueAnim.interpolate({
                inputRange: [0.0, 0.2, 0.6, 0.7, 1.0],
                outputRange: ["#0a0a2b", "#8b4789", "#ffb90f", "#ffd700", "#d4d4f7" ]
            });
        }

        // build sun position interpolator
        const sunStyle = {
            left: this.state.valueAnim.interpolate({
                inputRange: [0.0, 1.0],
                outputRange: ["50%", "5%"]
            }),
            top: this.state.valueAnim.interpolate({
                inputRange: [0.0, 1.0],
                outputRange: [this.layout ? (this.layout.height - 200) : 0, 50]
            })
        };

        // build landscape foreground style
        const foregroundStyle: ViewStyle = {
            borderTopLeftRadius: this.layout ? ((this.layout.width * 1.5) / 2) : 0,
            borderTopRightRadius: this.layout ? ((this.layout.width * 1.5) / 2) : 0,
            left: this.layout ? -(this.layout.width * 0.85) : 0,
            top: this.layout ? this.layout.height - FOREGROUND_HEIGHT : 0
        };

        // build landscape background style
        const backgroundStyle: ViewStyle = {
            borderTopLeftRadius: this.layout ? ((this.layout.width * 1.5) / 2) : 0,
            borderTopRightRadius: this.layout ? ((this.layout.width * 1.5) / 2) : 0,
            left: this.layout ? (this.layout.width * 0.3) : 0,
            top: this.layout ? this.layout.height - BACKGROUND_HEIGHT : 0
        };

        // render view
        return (
            <View
                onLayout={this.onLayout.bind(this)}
                style={styles.content}>
                <Animated.View
                    style={[styles.content, containerStyle]}>
                    <SafeAreaView style={styles.content}>
                        <Animated.View style={[styles.sun, sunStyle]} />
                        <View style={[styles.background, backgroundStyle]} />
                        <View style={[styles.foreground, foregroundStyle]} />
                        <View>{this.props.children}</View>
                    </SafeAreaView>
                </Animated.View>
            </View>
        );
    }

    /**
     * Animates to a specific value in the range [0, 1] representing the percentage of a sunrise/sunset.
     *
     * @param value The new value
     */
    private animateToValue(value: number): void {
        const direction: SkyBackgroundDirection = value >= this.state.value ? SkyBackgroundDirection.Sunrise :
            SkyBackgroundDirection.Sunset;
        this.setState({
            direction
        }, () => {
            Animated.timing(this.state.valueAnim, {
                duration: 3000,
                easing: AnimationCurves.standardBezier,
                toValue: value
            }).start();
        });
    }

    /**
     * Returns a value in the range [0, 1] specifying the percentage of the sunrise is completed based on a specified
     * time of day.
     *
     * @param time Time of day.
     * @param alarm An alarm around which the sunrise/sunset times should be based.
     */
    private getValueFromTime(time: Time, alarm?: Alarm): number {
        const sunriseStartTime: Time = alarm ? alarm.wakeTime : Time.createFromDisplayTime(7, 0);
        const sunriseEndTime: Time = alarm ? alarm.getUpTime : Time.createFromDisplayTime(8, 0);
        const sunsetStartTime: Time = alarm ? alarm.sleepTime.sub(1, 0) :
            Time.createFromDisplayTime(18, 0);
        const sunsetEndTime: Time = alarm ? alarm.sleepTime : Time.createFromDisplayTime(19, 0);

        if (time.greaterThanOrEquals(sunriseStartTime) && time.lessThanOrEquals(sunriseEndTime)) { // sunrise
            return (time.sub(sunriseStartTime.hour, sunriseStartTime.minute, sunriseStartTime.second).totalSeconds
                + 60) / (sunriseEndTime.sub(sunriseStartTime.hour, sunriseStartTime.minute, sunriseStartTime.second)
                .totalSeconds + 60);
        } else if (time.greaterThan(sunriseEndTime) && time.lessThan(sunsetStartTime)) { // sun is up
            return 1;
        } else if (time.greaterThanOrEquals(sunsetStartTime) && time.lessThanOrEquals(sunsetEndTime)) { // sunset
            return 1 - ((time.sub(sunsetStartTime.hour, sunsetStartTime.minute, sunsetStartTime.second).totalSeconds
                + 60) / (sunsetEndTime.sub(sunsetStartTime.hour, sunsetStartTime.minute,
                sunsetStartTime.second).totalSeconds + 60));
        } else { // sun is down
            return 0;
        }
    }

    private isDarkTheme(direction: SkyBackgroundDirection, value: number): boolean {
        if (direction === SkyBackgroundDirection.Sunset) {
            return value <= 0.75;
        } else {
            return value <= 0.2;
        }
    }

    private onLayout(layout: LayoutChangeEvent): void {
        this.layout = layout.nativeEvent.layout;
    }

}

const styles = StyleSheet.create({
    background: {
        backgroundColor: "#1f601f",
        height: BACKGROUND_HEIGHT,
        position: "absolute",
        width: "150%"
    },
    content: {
        flex: 1
    },
    foreground: {
        backgroundColor: "green",
        height: FOREGROUND_HEIGHT,
        position: "absolute",
        width: "150%"
    },
    sun: {
        backgroundColor: "yellow",
        borderRadius: 50,
        height: 100,
        position: "absolute",
        width: 100
    }
});
