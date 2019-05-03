/**
 * @module components
 */

import React, { ReactNode } from "react";
import { Animated, GestureResponderEvent, LayoutChangeEvent, StyleSheet, View, ViewStyle } from "react-native";

import { Button, Icon } from "react-native-elements";
import Colors from "../constants/Colors";

enum MotionState {
    IDLE = 0,
    DRAGGING = 1,
    ANIMATING = 2
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
    private motionState: MotionState = MotionState.IDLE; // whether the slider is animated, being dragged, or idle
    private yOffset: number = 0; // offset from the point of the user's touch - prevents jumping during responder grant

    public constructor(props: PasscodeGateSliderProps) {
        super(props);
        this.state = {};
    }

    public render(): ReactNode {

        // create dynamic style for parent view, allowing us to set the x and y coords
        const posStyle = {
            top: this.motionState === MotionState.ANIMATING ? this.state.yAnim : this.yDrag
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

    private onContentLayout(event: LayoutChangeEvent): void {
        this.contentHeight = event.nativeEvent.layout.height;
    }

    private onResponderGrant(event: GestureResponderEvent): void {
        if (this.motionState !== MotionState.IDLE) { // only allow dragging if slider is idle
            return;
        }

        this.motionState = MotionState.DRAGGING;
        this.yOffset = event.nativeEvent.pageY - this.yDrag;
    }

    private onResponderMove(event: GestureResponderEvent): void {
        if (this.motionState !== MotionState.DRAGGING) { // only move the slider if it's draggable
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
        if (this.yDrag >= this.props.initialTop || this.yDrag <= this.props.initialTop - this.contentHeight) { // bounds
            this.motionState = MotionState.IDLE;
        } else { // slider is not at bounds, animate to bounds
            const distanceToTop = this.yDrag - (this.props.initialTop - this.contentHeight);
            const distanceToBottom = this.props.initialTop - this.yDrag;

            // update motion state
            this.motionState = MotionState.ANIMATING;

            // update yAnim
            this.setState({
                yAnim: new Animated.Value(this.yDrag)
            }, () => { // yAnim has been updated

                // determine which bound to animate to
                // TODO: adjust this to bias in the opposite direction?
                let toValue: number;
                if (distanceToTop <= distanceToBottom) { // animate to top
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
                        this.motionState = MotionState.IDLE;
                    });
                });

            });
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
