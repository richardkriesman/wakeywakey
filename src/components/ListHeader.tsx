/**
 * @module components
 */

import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { ListItem } from "react-native-elements";

export interface ListHeaderProps {
    title: string;
}

export class ListHeader extends React.Component<ListHeaderProps> {

    public constructor(props: ListHeaderProps) {
        super(props);
    }

    public render(): ReactNode {
        return (
            <ListItem
                containerStyle={styles.container}
                title={this.props.title}
                titleStyle={styles.title}
            />
        );
    }

}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#e3e3e3"
    },
    title: {
        color: "#5e5e5e",
        fontWeight: "bold"
    }
});
