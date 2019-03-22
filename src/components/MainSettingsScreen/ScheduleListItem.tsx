import React, { ReactNode } from "react";
import { Icon, ListItem } from "react-native-elements";

export interface ScheduleListItemProps {
    enabled: boolean;
    title: string;

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
        this.forceEnabled(isEnabledNow);
        this.props.onSwitchToggled(isEnabledNow);
    }

    public forceEnabled(e: boolean) {
        this.setState({ enabled: e });
    }

    public render(): ReactNode {
        return (
            <ListItem
                title={this.props.title}
                rightIcon={<Icon name="arrow-forward" type="ionicons"/>}
                switch={{
                    onValueChange: this.onSwitchValueChanged.bind(this),
                    value: this.state.enabled
                }}
            />
        );
    }

}
