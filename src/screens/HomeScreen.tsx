import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

import { SlideUpIndicator } from "../components/HomeScreen/SlideUpIndicator";

/**
 * The home screen, where the current status, current time, and decorations will show.
 * 
 * @author Shawn Lutch
 */
export default class HomeScreen extends React.Component {

    private switchToSettings() {
        // TODO
        alert("hi");
    }

    public render() : ReactNode {
        return (
            <View style={ExtraStyles.container}>
                <View style={ExtraStyles.bottom}>
                    <SlideUpIndicator onPress={this.switchToSettings.bind(this)} />
                </View>
            </View>
        );
    }

};

const ExtraStyles = StyleSheet.create({
    container: {
        marginTop: 20,
        padding: 0,
        flex: 1,
        alignItems: 'center'
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        marginBottom: -10
    }
});
