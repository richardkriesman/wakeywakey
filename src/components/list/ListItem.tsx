import React from "react";
import { StyleSheet } from "react-native";
import { ListItemProps } from "react-native-elements";
import { ListItem as ElementsListItem } from "react-native-elements";

import Colors from "../../constants/Colors";

export class ListItem extends React.Component<ListItemProps & { subtitleStyle?: never }> {

    public render(): React.ReactNode {
        return (
            <ElementsListItem
                {...this.props}
                subtitleStyle={styles.subtitle} />
        );
    }

}

const styles = StyleSheet.create({
    subtitle: {
        color: Colors.subheaderColor
    }
});
