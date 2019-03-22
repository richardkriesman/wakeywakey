import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { Button, Icon } from "react-native-elements";

import Colors from "../../constants/Colors";

export interface HeaderAddButtonProps {
    onPress: VoidFunction;
}

export class HeaderAddButton extends React.Component<HeaderAddButtonProps> {

    public constructor(props: HeaderAddButtonProps) {
        super(props);
    }

    public render(): ReactNode {
        return (
            <Button
                type="clear"
                buttonStyle={styles.topRightButton}
                onPress={this.props.onPress.bind(this)}
                icon={<Icon name="add" type="ionicons" color={Colors.appleButtonBlue} />}
            />
        );
    }

}

const styles = StyleSheet.create({
    topRightButton: {
        marginRight: 10
    }
});
