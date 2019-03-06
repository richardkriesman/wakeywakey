import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";

import { Button } from "react-native-elements";
import { Icon } from "expo";

// shouldn't need any props, should be straightforward
// isn't intended to be derived from in any way

export default class SlideUpIndicator extends React.Component {
    public render(): ReactNode {
        return (
            <Button
                buttonStyle={styles.indicator}
                title=""
                icon={
                    <Icon
                        name="chevron-thin-up"
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
        backgroundColor: 'black'
    }
});
