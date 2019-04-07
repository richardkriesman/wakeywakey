/**
 * @module components
 */

import React, { ReactNode } from "react";
import { Animated, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Colors from "../constants/Colors";

export interface ToggleButtonProps {
    backgroundColor?: string;
    isToggled?: boolean;
    onToggle?: (isToggled: boolean) => void;
    textColorIn?: string;
    textColorOut?: string;
    title: string;
}

interface ToggleButtonState {
    isToggled: boolean;
}

const ANIMATION_TIME_MS = 75;

export class ToggleButton extends React.Component<ToggleButtonProps, ToggleButtonState> {

    public get isToggled(): boolean {
        return this.state.isToggled;
    }

    private readonly backgroundColor: string;
    private readonly colorAnimation: Animated.Value;
    private readonly textColorIn: string;
    private readonly textColorOut: string;

    public constructor(props: ToggleButtonProps) {
        super(props);
        this.backgroundColor = props.backgroundColor || Colors.appleButtonBlue;
        this.textColorIn = props.textColorIn || Colors.white;
        this.textColorOut = props.textColorOut || Colors.black;

        this.state = {
            isToggled: this.props.isToggled || false
        };
        this.colorAnimation = this.state.isToggled ? new Animated.Value(1) : new Animated.Value(0);
    }

    public render(): ReactNode {

        // build dynamic styles based on current state
        const borderDynamicStyle = {
            backgroundColor: this.backgroundColor
        };
        const containerDynamicStyle = {
            backgroundColor: this.colorAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [Colors.white, this.backgroundColor]
            })
        };
        const textDynamicStyle = {
            color: this.colorAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [this.textColorOut, this.textColorIn]
            })
        };

        // build view
        return (
            <View style={[borderDynamicStyle, styles.border]}>
                <TouchableWithoutFeedback onPress={this.onPress.bind(this)}>
                    <Animated.View style={[containerDynamicStyle, styles.container]}>
                        <Animated.Text style={textDynamicStyle}>{this.props.title}</Animated.Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    private animateIn(): void {
        this.colorAnimation.setValue(0);
        Animated.timing(this.colorAnimation, {
            duration: ANIMATION_TIME_MS,
            toValue: 1
        }).start();
    }

    private animateOut(): void {
        this.colorAnimation.setValue(1);
        Animated.timing(this.colorAnimation, {
            duration: ANIMATION_TIME_MS,
            toValue: 0
        }).start();
    }

    private onPress(): void {

        // start animation
        if (!this.state.isToggled) {
            this.animateIn();
        } else {
            this.animateOut();
        }

        // update state
        this.setState({ isToggled: !this.state.isToggled }, () => { // fire listener after update
            if (this.props.onToggle) {
                this.props.onToggle(this.state.isToggled);
            }
        });
    }

}

const styles = StyleSheet.create({
    border: {
        alignItems: "center",
        borderRadius: 24,
        height: 48,
        justifyContent: "center",
        width: 48
    },
    container: {
        alignItems: "center",
        borderRadius: 22,
        height: 44,
        justifyContent: "center",
        width: 44
    }
});
