/**
 * @module components
 */

import React, { ReactNode } from "react";
import { Animated, GestureResponderEvent, LayoutChangeEvent, StyleSheet, View, ViewStyle } from "react-native";

import { Button, Icon } from "react-native-elements";
import Colors from "../constants/Colors";
import Timeout = NodeJS.Timeout;

enum SliderAnimationDirection {
    Bottom = 0,
    Top = 1
}

enum SliderMotionState {
    Idle = 0,
    Dragging = 1,
    Press = 3,
    Animating = 2
}

interface PasscodeGateSliderState {
    yAnim?: Animated.Value; // y value used when animating
    yDrag?: number;         // y value used when dragging and idle
}

export interface PasscodeGateSliderProps {
    initialTop: number;
    onIndicatorLayout?: (event: LayoutChangeEvent) => void;
}

// TODO: tapping to expand/contract, rotating the arrow, and test on iOS

export class Slider extends React.Component<PasscodeGateSliderProps, PasscodeGateSliderState> {

    private contentHeight: number = 0; // computed height of the content
    private motionState: SliderMotionState = SliderMotionState.Idle; // whether the slider is moving or idle
    private pressTimeout?: Timeout;
    private yDragStart: number = 0; // y value when the drag was started
    private yOffset: number = 0; // offset from the point of the user's touch - prevents jumping during responder grant

    public constructor(props: PasscodeGateSliderProps) {
        super(props);
        this.state = {};
    }

    public render(): ReactNode {

        // create dynamic style for parent view, allowing us to set the x and y coords
        const posStyle = {
            top: this.motionState === SliderMotionState.Animating ? this.state.yAnim : this.yDrag
        };

        return (
            <Animated.View
                onStartShouldSetResponder={() => true}
                onStartShouldSetResponderCapture={() => true}
                onResponderGrant={this.onResponderGrant.bind(this)}
                onResponderMove={this.onResponderMove.bind(this)}
                onResponderRelease={this.onResponderRelease.bind(this)}
                style={[posStyle, styles.container]}>
                <Button
                    buttonStyle={styles.indicator}
                    onLayout={this.onIndicatorLayout.bind(this)}
                    onPress={() => { return; }}
                    icon={
                        <Icon
                            name="up"
                            type="antdesign"
                            size={32}
                            color="white"
                        />
                    }
                />
                <View
                    onLayout={this.onContentLayout.bind(this)}
                    style={styles.content}>
                    {this.props.children}
                </View>
            </Animated.View>
        );
    }

    private animate(direction: SliderAnimationDirection): Promise<void> {
        return new Promise<void>((resolve) => {

            // update motion state
            this.motionState = SliderMotionState.Animating;

            // update yAnim
            this.setState({
                yAnim: new Animated.Value(this.yDrag)
            }, () => { // yAnim has been updated

                // determine which bound to animate to
                let toValue: number;
                if (direction === SliderAnimationDirection.Top) {
                    toValue = (this.props.initialTop - this.contentHeight);
                } else { // animate to bottom
                    toValue = this.props.initialTop;
                }

                // start the animation
                Animated.timing(this.state.yAnim, {
                    duration: 250, // TODO: use a timing curve from material design for this, they look way better
                    toValue
                }).start(() => {
                    this.setState({ // update yDrag so dragging starts from the correct position
                        yDrag: toValue
                    }, () => { // yDrag has been updated, set motion state to idle so we can drag again
                        this.motionState = SliderMotionState.Idle;
                        resolve();
                    });
                });

            });
        });
    }

    private onPress(): void {
        const distanceToTop = this.yDrag - (this.props.initialTop - this.contentHeight);
        const distanceToBottom = this.props.initialTop - this.yDrag;
        if (distanceToTop >= distanceToBottom) { // move in the direction opposite to where we currently are
            this.animate(SliderAnimationDirection.Top);
        } else {
            this.animate(SliderAnimationDirection.Bottom);
        }
    }

    private onContentLayout(event: LayoutChangeEvent): void {
        this.contentHeight = event.nativeEvent.layout.height;
    }

    private onResponderGrant(event: GestureResponderEvent): void {
        if (this.motionState !== SliderMotionState.Idle) { // only allow dragging if slider is idle
            return;
        }

        // set y offset for drag
        this.yOffset = event.nativeEvent.pageY - this.yDrag;
        this.yDragStart = event.nativeEvent.pageY;

        // by default, we're going to consider this a press - if it's dragged too far, we'll consider it a drag
        this.motionState = SliderMotionState.Press;

    }

    private onResponderMove(event: GestureResponderEvent): void {

        // if the slider was dragged too far, we should consider it a drag
        if (this.motionState === SliderMotionState.Press
                && Math.abs(event.nativeEvent.pageY - this.yDragStart) > 20) {
            this.motionState = SliderMotionState.Dragging;
        }

        // only move the slider if it's draggable
        if (this.motionState !== SliderMotionState.Dragging) {
            return;
        }

        // compute new y
        let newY: number = event.nativeEvent.pageY - this.yOffset;
        if (newY > this.props.initialTop) { // y would exceed bottom bound, constrain y to initial top
            newY = this.props.initialTop;
        }
        if (newY < (this.props.initialTop - this.contentHeight)) { // y would exceed top bound, constrain to top
            newY = this.props.initialTop - this.contentHeight;
        }

        // update y
        this.setState({
            yDrag: newY
        });
    }

    private onResponderRelease(event: GestureResponderEvent): void {
        if (this.motionState === SliderMotionState.Press) { // press, fire the press handler
            this.motionState = SliderMotionState.Idle;
            this.onPress();
            return;
        }

        if (this.yDrag >= this.props.initialTop || this.yDrag <= this.props.initialTop - this.contentHeight) { // bounds
            this.motionState = SliderMotionState.Idle;
        } else { // slider is not at bounds, animate to bounds
            const distanceToTop = this.yDrag - (this.props.initialTop - this.contentHeight);
            const distanceToBottom = this.props.initialTop - this.yDrag;

            // TODO: adjust this to bias in the opposite direction?
            if (distanceToTop <= distanceToBottom) {
                this.animate(SliderAnimationDirection.Top);
            } else {
                this.animate(SliderAnimationDirection.Bottom);
            }
        }
    }

    private onIndicatorLayout(event: LayoutChangeEvent): void {
        if (this.props.onIndicatorLayout) {
            this.props.onIndicatorLayout(event);
        }
    }

    private get yDrag(): number {
        return this.state.yDrag ? this.state.yDrag : this.props.initialTop;
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        position: "absolute"
    },
    content: {

    },
    indicator: {
        backgroundColor: Colors.black,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        width: 200
    }
});
