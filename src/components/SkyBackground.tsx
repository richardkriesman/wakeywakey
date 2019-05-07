import React, { ReactNode } from "react";
import { Animated, LayoutChangeEvent, LayoutRectangle, SafeAreaView, StyleSheet, View, ViewStyle } from "react-native";
import { AnimationCurves } from "../constants/Animation";

enum SkyBackgroundDirection {
    Sunrise = 0,
    Sunset = 1
}

interface SkyBackgroundState {
    direction: SkyBackgroundDirection;
    value: Animated.Value;
}

const BACKGROUND_HEIGHT: number = 270;
const FOREGROUND_HEIGHT: number = 230;

export class SkyBackground extends React.Component<{}, SkyBackgroundState> {

    private layout?: LayoutRectangle;

    public constructor(props: any) {
        super(props);
        this.state = {
            direction: SkyBackgroundDirection.Sunset,
            value: new Animated.Value(1)
        };

        setTimeout(() => {
            this.setState({
                direction: SkyBackgroundDirection.Sunset
            }, () => {
                Animated.timing(this.state.value, {
                    duration: 5000,
                    easing: AnimationCurves.standardBezier,
                    toValue: 0
                }).start(() => {
                    setTimeout(() => {
                        this.setState({
                            direction: SkyBackgroundDirection.Sunrise
                        }, () => {
                            Animated.timing(this.state.value, {
                                duration: 5000,
                                easing: AnimationCurves.standardBezier,
                                toValue: 1
                            }).start();
                        });
                    }, 5000);
                });
            });
        }, 5000);
    }

    public render(): ReactNode {

        // build background color interpolator
        const containerStyle: any = {};
        if (this.state.direction === SkyBackgroundDirection.Sunset) { // sunset interpolation
            containerStyle.backgroundColor = this.state.value.interpolate({
                inputRange: [0.0, 0.75, 0.8, 0.9, 1.0],
                outputRange: ["#0a0a2b", "#8b4789", "#ffb90f", "#ffd700", "#d4d4f7" ]
            });
        } else { // sunrise interpolation
            containerStyle.backgroundColor = this.state.value.interpolate({
                inputRange: [0.0, 0.2, 0.6, 0.7, 1.0],
                outputRange: ["#0a0a2b", "#8b4789", "#ffb90f", "#ffd700", "#d4d4f7" ]
            });
        }

        // build sun position interpolator
        const sunStyle = {
            left: this.state.value.interpolate({
                inputRange: [0.0, 1.0],
                outputRange: ["50%", "5%"]
            }),
            top: this.state.value.interpolate({
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
                        <View>{this.props.children}</View>
                        <View style={[styles.background, backgroundStyle]} />
                        <View style={[styles.foreground, foregroundStyle]} />
                    </SafeAreaView>
                </Animated.View>
            </View>
        );
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
