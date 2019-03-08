import React, { ReactNode } from "react";
import { View } from "react-native";

import { NavigationScreenProp } from "react-navigation";

export interface MainSettingsScreenProps {
    navigation: NavigationScreenProp<any, any>;
}

export default class MainSettingsScreen extends React.Component<MainSettingsScreenProps> {
    public constructor(props : MainSettingsScreenProps) {
        super(props);
    }

    public render() : ReactNode {
        return (
            <View>

            </View>
        );
    }
};
