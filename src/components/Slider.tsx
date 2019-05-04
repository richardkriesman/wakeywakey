/**
 * @module components
 */

import React, { ReactNode } from "react";
import {
    Animated,
    Easing,
    GestureResponderEvent,
    LayoutChangeEvent,
    StyleSheet,
    View} from "react-native";

import { Button, Icon } from "react-native-elements";
import Colors from "../constants/Colors";
import { RigidBody } from "../utils/RigidBody";

enum SliderPosition {
    Collapsed = 0,
    Expanded = 1
}

enum SliderMotion {
    Idle = 0,
    Dragging = 1,
    Press = 2,
    Animating = 3
}

interface PasscodeGateSliderState {
    indicatorRotation: Animated.Value; // indicator rotation
    yAnim?: Animated.Value; // y value used when animating
    yDrag?: number;         // y value used when dragging and idle
}

export interface PasscodeGateSliderProps {
    initialTop: number;
    onIndicatorLayout?: (event: LayoutChangeEvent) => void;
}

export class Slider extends React.Component<PasscodeGateSliderProps, PasscodeGateSliderState> {

    private contentHeight: number = 0; // computed height of the content
    private motion: SliderMotion = SliderMotion.Idle; // how the slider is moving
    private position: SliderPosition = SliderPosition.Collapsed; // where the slider is
    private rigidBody: RigidBody;
    private yDragStart: number = 0; // y value when the drag was started
    private yOffset: number = 0; // offset from the point of the user's touch - prevents jumping during responder grant

    public constructor(props: PasscodeGateSliderProps) {
        super(props);
        this.state = {
            indicatorRotation: new Animated.Value(0)
        };
    }

    public render(): ReactNode {

        // create dynamic style for parent view, allowing us to set the y coord
        const posStyle = {
            top: this.motion === SliderMotion.Animating ? this.state.yAnim : this.yDrag
        };

        // create dynamic style for indicator, allowing us to set the rotation
        const indicatorStyle = {
            transform: [{
                rotate: this.state.indicatorRotation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "180deg"]
                })
            }]
        };

        return (
            <Animated.View
                style={[posStyle, styles.container]}>
                <View
                    onStartShouldSetResponder={() => true}
                    onStartShouldSetResponderCapture={() => true}
                    onResponderGrant={this.onResponderGrant.bind(this)}
                    onResponderMove={this.onResponderMove.bind(this)}
                    onResponderRelease={this.onResponderRelease.bind(this)}>
                    <Button
                        buttonStyle={styles.indicator}
                        onLayout={this.onIndicatorLayout.bind(this)}
                        onPress={() => { return; }}
                        icon={
                            <Animated.View
                                style={indicatorStyle}>
                                <Icon
                                    name="up"
                                    type="antdesign"
                                    size={32}
                                    color="white"
                                />
                            </Animated.View>
                        }
                    />
                </View>
                <View
                    onLayout={this.onContentLayout.bind(this)}
                    style={styles.content}>
                    {this.props.children}
                </View>
            </Animated.View>
        );
    }

    private animate(position: SliderPosition): Promise<void> {
        return new Promise<void>((resolve) => {

            // update motion state
            this.motion = SliderMotion.Animating;

            // update yAnim
            this.setState({
                yAnim: new Animated.Value(this.yDrag)
            }, () => { // yAnim has been updated

                // determine which bound to animate to
                let duration: number;
                let indicatorToValue: number;
                let yToValue: number;
                if (position === SliderPosition.Expanded) { // animate to expanded
                    duration = 250;
                    indicatorToValue = 1;
                    yToValue = (this.props.initialTop - this.contentHeight);
                } else { // animate to collapsed
                    duration = 200;
                    indicatorToValue = 0;
                    yToValue = this.props.initialTop;
                }

                // start the animation
                Animated.parallel([
                    Animated.timing(this.state.yAnim, {
                        duration,
                        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
                        toValue: yToValue
                    }),
                    Animated.timing(this.state.indicatorRotation, {
                        duration,
                        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
                        toValue: indicatorToValue
                    })
                ]).start(() => {
                    this.setState({ // update yDrag so dragging starts from the correct position
                        yDrag: yToValue
                    }, () => { // yDrag has been updated, set motion state to idle so we can drag again
                        this.position = position;
                        this.motion = SliderMotion.Idle;
                        resolve();
                    });
                });

            });
        });
    }

    private onPress(): void {
        if (this.position === SliderPosition.Collapsed) { // move in the direction opposite to the current pos
            this.animate(SliderPosition.Expanded);
        } else {
            this.animate(SliderPosition.Collapsed);
        }
    }

    private onContentLayout(event: LayoutChangeEvent): void {
        this.contentHeight = event.nativeEvent.layout.height;
    }

    private onResponderGrant(event: GestureResponderEvent): void {

        // only allow touches if the slider is idle
        if (this.motion !== SliderMotion.Idle) {
            return;
        }

        // set y offset for drag
        this.yOffset = event.nativeEvent.pageY - this.yDrag;
        this.yDragStart = event.nativeEvent.pageY;
        this.rigidBody = new RigidBody(0, this.yDrag);

        // by default, we're going to consider this a press - if it's dragged too far, we'll consider it a drag
        this.motion = SliderMotion.Press;

    }

    private onResponderMove(event: GestureResponderEvent): void {

        // if the slider was dragged too far, we'll consider it a drag
        if (this.motion === SliderMotion.Press && Math.abs(event.nativeEvent.pageY - this.yDragStart) > 20) {
            this.motion = SliderMotion.Dragging;
        }

        // only move the slider if it's draggable
        if (this.motion !== SliderMotion.Dragging) {
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

        // update the position of the rigid body
        this.rigidBody.moveTo(0, newY);

        // update y
        this.setState({
            yDrag: newY
        });
    }

    private onResponderRelease(event: GestureResponderEvent): void {

        // press, fire the press handler
        if (this.motion === SliderMotion.Press) {
            this.motion = SliderMotion.Idle;
            this.onPress();
            return;
        }

        // start applying a deceleration
        setTimeout(this.doVelocityTick.bind(this), 10);

        // drag, animate the rest of the way
        // const distanceToExpanded = this.yDrag - (this.props.initialTop - this.contentHeight);
        // const distanceToCollapsed = this.props.initialTop - this.yDrag;
        // if (this.position === SliderPosition.Collapsed) { // dragging to expanded
        //     if (distanceToExpanded * 0.40 <= distanceToCollapsed) {
        //         this.animate(SliderPosition.Expanded);
        //     } else {
        //         this.animate(SliderPosition.Collapsed);
        //     }
        // } else { // dragging to collapsed
        //     if (distanceToCollapsed * 0.40 <= distanceToExpanded) {
        //         this.animate(SliderPosition.Collapsed);
        //     } else {
        //         this.animate(SliderPosition.Expanded);
        //     }
        // }
    }

    private onIndicatorLayout(event: LayoutChangeEvent): void {
        if (this.props.onIndicatorLayout) {
            this.props.onIndicatorLayout(event);
        }
    }

    private doVelocityTick(): void {
        console.log("y: " + this.rigidBody.y);
        console.log("vel: " + this.rigidBody.yVelocity / 100);
        const newY: number = this.rigidBody.y +
            ((this.rigidBody.yVelocity / 100) + (this.rigidBody.yVelocity > 0 ? -0.0 : 0.0));
        this.rigidBody.moveTo(0, newY);
        this.setState({
            yDrag: newY
        });
        console.log(this.rigidBody.yVelocity);

        // noinspection JSSuspiciousNameCombination
        if (Math.abs(this.rigidBody.yVelocity) > 0) {
            setTimeout(this.doVelocityTick.bind(this), 10);
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
