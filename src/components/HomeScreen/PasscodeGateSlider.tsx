/**
 * @module components
 */

import React, { ReactNode } from "react";
import {GestureResponderEvent, LayoutChangeEvent, StyleSheet, View, ViewStyle} from "react-native";

import { Button, Icon } from "react-native-elements";
import Colors from "../../constants/Colors";

interface PasscodeGateSliderState {
    y?: number;
}

export interface PasscodeGateSliderProps {
    initialTop: number;
    onIndicatorLayout?: (event: LayoutChangeEvent) => void;
}

// TODO: implement gravity, tapping to expand/contract, and rotating the arrow

export class PasscodeGateSlider extends React.Component<PasscodeGateSliderProps, PasscodeGateSliderState> {

    private contentHeight: number = 0;
    private yOffset: number = 0;

    public constructor(props: PasscodeGateSliderProps) {
        super(props);
        this.state = {};
    }

    public render(): ReactNode {

        // create dynamic style for parent view, allowing us to set the x and y coords
        const posStyle: ViewStyle = {
            top: this.y
        };

        return (
            <View
                onStartShouldSetResponder={() => true}
                onStartShouldSetResponderCapture={() => true}
                onResponderGrant={this.onResponderGrant.bind(this)}
                onResponderMove={this.onResponderMove.bind(this)}
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
            </View>
        );
    }

    private onContentLayout(event: LayoutChangeEvent): void {
        this.contentHeight = event.nativeEvent.layout.height;
    }

    private onResponderGrant(event: GestureResponderEvent): void {
        this.yOffset = event.nativeEvent.pageY - this.y;
    }

    private onResponderMove(event: GestureResponderEvent): void {

        // compute new y
        let newY: number = event.nativeEvent.pageY - this.yOffset;
        if (newY > this.props.initialTop) { // y would exceed initial top, constrain y to initial top
            newY = this.props.initialTop;
        }
        if (newY < (this.props.initialTop - this.contentHeight)) {
            newY = this.props.initialTop - this.contentHeight;
        }

        // update y
        this.setState({
            y: newY
        });
    }

    private onIndicatorLayout(event: LayoutChangeEvent): void {
        if (this.props.onIndicatorLayout) {
            this.props.onIndicatorLayout(event);
        }
    }

    private get y(): number {
        return this.state.y ? this.state.y : this.props.initialTop;
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
        width: 200
    }
});
