import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

import Styles from "./styles/MainStyles";
import SlideUpIndicator from "../components/HomeScreen/SlideUpIndicator";

export default class HomeScreen extends React.Component {

    public render(): ReactNode {
        return (
            <View style={Styles.container}>
                <SlideUpIndicator />
            </View>
        );
    }

};

// unused for now
// tslint:disable-next-line:6133
const ExtraStyles = StyleSheet.create({

});
