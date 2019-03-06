import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { Button, Icon } from "react-native-elements";

/**
 * Properties that must be passed to <SlideUpIndicator />
 * @author Shawn Lutch
 */
export interface SlideUpIndicatorProps {
    // onPress event required
    onPress : VoidFunction;
}

/**
 * Indicator at the bottom of the screen to slide up.
 * @author Shawn Lutch
 */
export class SlideUpIndicator extends React.Component<SlideUpIndicatorProps> {

    protected onSwitch : VoidFunction;

    public constructor(props : SlideUpIndicatorProps) {
        super(props);
        this.onSwitch = props.onPress;
    }

    public render(): ReactNode {
        return (
            <Button
                buttonStyle={styles.indicator}
                onPress={this.onSwitch}
                icon={
                    <Icon
                        name="up"
                        type="antdesign"
                        size={32}
                        color="white"
                    />
                }
            />
        );
    }
};

const styles = StyleSheet.create({
    indicator: {
        backgroundColor: 'black',
        width: '100%'
    }
});
