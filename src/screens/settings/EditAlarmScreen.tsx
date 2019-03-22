import React, { ReactNode } from "react";
import { View } from "react-native";
import { NavigationScreenProps } from "react-navigation";

export interface EditAlarmScreenState {
    title: string;
}

export default class EditAlarmScreen extends React.Component<NavigationScreenProps, EditAlarmScreenState> {

    private static defaultName: string = "Add Alarm";

    public constructor(props: NavigationScreenProps) {
        super(props);
    }

    public componentWillMount(): void {
        this.setState({
            title: this.props.navigation.getParam("title", EditAlarmScreen.defaultName)
        });
    }

    public render(): ReactNode {
        return (
            <View>

            </View>
        );
    }
}
