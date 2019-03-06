import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

import { SlideUpIndicator } from "../components/HomeScreen/SlideUpIndicator";

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

// unused for now
// tslint:disable-next-line:6133
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
