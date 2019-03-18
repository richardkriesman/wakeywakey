import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { ListItem } from "react-native-elements";

export interface ScheduleListHeaderProps {
    title: string;
}

export class ScheduleListHeader extends React.Component<ScheduleListHeaderProps> {

    public constructor(props: ScheduleListHeaderProps) {
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
