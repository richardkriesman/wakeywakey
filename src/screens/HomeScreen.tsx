import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

import Styles from "./styles/MainStyles";

export default class HomeScreen extends React.Component {

    public render(): ReactNode {
        return (
            <View style={Styles.container}>

            </View>
        );
    }

};

// unused for now
// tslint:disable-next-line:6133
const ExtraStyles = StyleSheet.create({

});
