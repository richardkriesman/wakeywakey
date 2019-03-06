import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { Button, Icon } from "react-native-elements";

// shouldn't need any props, should be straightforward
// isn't intended to be derived from in any way

/**
 * Indicator at the bottom of the screen to slide up
 */
export default class SlideUpIndicator extends React.Component {
    public render(): ReactNode {
        return (
            <View style={styles.container}>
                <Button
                    buttonStyle={styles.indicator}
                    icon={
                        <Icon
                            name="up"
                            type="antdesign"
                            size={32}
                            color="white"
                        />
                    }
                />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    indicator: {
        backgroundColor: 'black',
        width: 50
    }
});
