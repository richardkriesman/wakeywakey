import * as React from "react";
import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { NavigationScreenProps, StackActions } from "react-navigation";

import Colors from "../constants/Colors";

export interface HeaderBackButtonProps {
    title: string;
}

export class HeaderBackButton extends React.Component<HeaderBackButtonProps & NavigationScreenProps> {
    public constructor(props: HeaderBackButtonProps & NavigationScreenProps) {
        super(props);
    }

    public render(): ReactNode {
        return (
            <Button type="clear" titleStyle={styles.title} title={this.props.title}
                    onPress={() => {
                        this.props.navigation.dispatch(StackActions.pop({ n: 1 }));
                    }}/>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        color: Colors.appleButtonRed,
        marginLeft: 10
    }
});
