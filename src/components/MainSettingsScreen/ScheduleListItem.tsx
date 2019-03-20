import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { Icon, ListItem } from "react-native-elements";

export interface ScheduleListItemProps {
    enabled: boolean;
    title: string;
}

export interface ScheduleListItemState {
    enabled: boolean;
}

export class ScheduleListItem extends React.Component<ScheduleListItemProps, ScheduleListItemState> {

    public constructor(props: ScheduleListItemProps) {
        super(props);
    }

    public componentWillMount(): void {
        this.setState({ enabled: this.props.enabled });
    }

    public render(): ReactNode {
        return (
            <ListItem
                title={this.props.title}
                rightIcon={<Icon name="arrow-forward" type="ionicons"/>}
            />
        );
    }

}

const styles = StyleSheet.create({});
