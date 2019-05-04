/**
 * @module components
 */

import React, { ReactNode } from "react";
import { ListItem } from "./list/ListItem";

export interface ScheduleListItemProps {
    enabled: boolean;
    title: string;

    onPress: () => void;
    onSwitchToggled: (enabled: boolean) => void;
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

    public onSwitchValueChanged(isEnabledNow: boolean) {
        this.forceEnabled(isEnabledNow).then(() => {
            this.props.onSwitchToggled(isEnabledNow);
        });
    }

    public forceEnabled(e: boolean): Promise<void> {
        return new Promise<void>((resolve) => {
            this.setState({ enabled: e }, () => {
                resolve();
            });
        });
    }

    public render(): ReactNode {
        return (
            <ListItem
                title={this.props.title}
                rightIcon={{ name: "arrow-forward", type: "ionicons" }}
                onPress={this.props.onPress}
                switch={{
                    onValueChange: this.onSwitchValueChanged.bind(this),
                    value: this.state.enabled
                }}
            />
        );
    }

}
