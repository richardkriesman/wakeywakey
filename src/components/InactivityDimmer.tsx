/**
 * @module components
 */

import { Brightness } from "expo";
import React, { ReactNode } from "react";
import ReactNative, { PanResponder, PanResponderInstance, TouchableWithoutFeedback, View } from "react-native";
import { NavigationEvents } from "react-navigation";

const DEFAULT_BRIGHTNESS = .8;
const DEFAULT_DIM_BRIGHTNESS = 0;
const DEFAULT_IDLE_TIME = 2000; // 2 seconds

export interface InactivityDimmerProps {
    dimBrightness: number; // optional
    idleTime: number;
    navigation: any; // required for detecting focus/blur
}

export interface InactivityDimmerState {
    active: boolean;
}

/**
 * This component dims the screen when inactive.
 * If screen is unfocused, the timer stops until refocused.
 */
export class InactivityDimmer extends React.Component<InactivityDimmerProps, InactivityDimmerState> {
    public static defaultProps = {
        dimBrightness: DEFAULT_DIM_BRIGHTNESS,
        idleTime: DEFAULT_IDLE_TIME
    };

    private _panResponder: PanResponderInstance;
    private idleTimer: any;

    public constructor(props: InactivityDimmerProps) {
        super(props);
    }

    public componentWillMount(): void {
        this.setState({ active: true });

        this.props.navigation.addListener("didFocus", () => this.componentDidFocus());
        this.props.navigation.addListener("didBlur", () => this.componentDidBlur());

        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => false,
            onStartShouldSetPanResponder: () => false,

            onMoveShouldSetPanResponderCapture: this.handlePanResponderCapture.bind(this),
            onStartShouldSetPanResponderCapture: this.handlePanResponderCapture.bind(this)
        });
    }

    public render(): ReactNode {
        return (
            <View style={{ flex: 1 }} {...this._panResponder.panHandlers} >
                <TouchableWithoutFeedback style={{ flex: 1 }} >
                    <View style={{ flex: 1 }} >
                        {this.props.children}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    /**
     * Screen focused. Resets timer.
     */
    public componentDidFocus(): void {
        clearTimeout(this.idleTimer);
        this.setIdleTimer();
    }

    /**
     * Screen loses focus. Removes timer.
     */
    public componentDidBlur(): void {
        clearTimeout(this.idleTimer);
        this.onActiveChange(true);
    }

    /**
     * If movement is detected, active is set to true and idleTimer is set.
     */
    public handlePanResponderCapture(): boolean {
        clearTimeout(this.idleTimer);

        // set as active
        if (!this.state.active) {
            this.setState({ active: true });
            this.onActiveChange(true);
        }

        // set idle timer
        this.setIdleTimer();

        return false;
    }

    /**
     * Sets idle timer. When timer stops, active is set to false.
     */
    public setIdleTimer(): void {
        this.idleTimer = setTimeout(() => {
            this.setState({ active: false });
            this.onActiveChange(false);
        }, this.props.idleTime);
    }

    /**
     * Called to handle active change.
     * If active, set brightness to system brightness.
     * If inactive, dim brightness to 0.
     */
    public onActiveChange(active: boolean): void {
        if (active) {
            Brightness.getSystemBrightnessAsync()
                .then((res) => { // set to system brightness
                    Brightness.setBrightnessAsync(res);
                })
                .catch(() => { // otherwise, set to default brightness
                    Brightness.setBrightnessAsync(DEFAULT_BRIGHTNESS);
                });
        } else { // inactive
            Brightness.setBrightnessAsync(this.props.dimBrightness);
        }
    }
}
