import React, { ReactNode } from "react";
import { View } from "react-native";
import { NavigationScreenProps } from "react-navigation";

import { NoHeader, UIScreen } from "../../utils/screen";

@NoHeader
export default class PasscodeChangeScreen extends UIScreen<{}, {}> {

    public constructor(props: NavigationScreenProps) {
        super(props);
    }

    public renderContent(): ReactNode {
        return (
            <View>
            </View>
        );
    }
}
