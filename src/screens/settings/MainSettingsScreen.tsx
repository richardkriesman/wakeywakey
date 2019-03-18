import React, { ReactNode } from "react";
import { View } from "react-native";

import { NavigationScreenProp } from "react-navigation";

/**
 * Properties of the main settings screen.
 * 
 * @author Miika Raina
 */
export interface MainSettingsScreenProps {
    navigation: NavigationScreenProp<any, any>;
}

/**
 * Main Settings screen.
 * 
 * @author Shawn Lutch, Miika Raina
 */
export default class MainSettingsScreen extends React.Component<MainSettingsScreenProps> {
    public constructor(props: MainSettingsScreenProps) {
        super(props);
    }

    public render(): ReactNode {
        return (
            <View>

            </View>
        );
    }
};
