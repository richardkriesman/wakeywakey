import React, { ReactNode } from "react";
import { View } from "react-native";
import { NavigationScreenProps } from "react-navigation";

// tslint:disable-next-line:no-empty-interface
export interface EditAlarmScreenState {
    // TODO add fields
}

export default class EditAlarmScreen extends React.Component<NavigationScreenProps, EditAlarmScreenState> {

    public constructor(props: NavigationScreenProps) {
        super(props);
    }

    public render(): ReactNode {
        return (
            <View>

            </View>
        );
    }
}
