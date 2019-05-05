import React, { ReactNode } from "react";
import { Button } from "react-native-elements";
import { ListItem } from "./list/ListItem";
import { Modal } from "./modal/Modal";

export interface SelectPickerState {
    isVisible: boolean;
    onCancelled?: () => void;
    onCompleted?: (value: string) => void;
    valueId?: number;
}

export interface SelectPickerProps {
    title: string;
    value?: number;
    values: string[];
}

export class SelectPicker extends React.Component<SelectPickerProps, SelectPickerState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            isVisible: false,
            valueId: this.props.value
        };
    }

    public render(): ReactNode {

        // build a list of values
        const values: ReactNode[] = [];
        for (let i = 0; i < this.props.values.length; i++) {
            values.push(
                <ListItem
                    key={i}
                    title={this.props.values[i]}
                    checkBox={{
                        checked: i === this.state.valueId
                    }}
                    onPress={this.onItemPress.bind(this, i)} />
            );
        }

        // render the modal
        return (
            <Modal
                buttons={[
                    <Button
                        key={0}
                        onPress={this.onCancelled.bind(this)}
                        title="Cancel"
                        type="clear" />,
                    <Button
                        key={1}
                        disabled={this.state.valueId === undefined}
                        onPress={this.onCompleted.bind(this)}
                        title="OK"
                        type="clear" />
                ]}
                isVisible={this.state.isVisible}
                title={this.props.title}>
                {values}
            </Modal>
        );
    }

    /**
     * Presents the {@link SelectPicker} to the user.
     *
     * @return A Promise that resolves when the SelectPicker is closed with the selected value or
     *         undefined` if the SelectPicker was cancelled.
     */
    public present(): Promise<string|undefined> {
        return new Promise((resolve) => {
            this.setState({
                isVisible: true,
                onCancelled: () => {
                    this.setState({
                        isVisible: false,
                        valueId: undefined
                    }, () => {
                        resolve(undefined);
                    });
                },
                onCompleted: (value: string) => {
                    this.setState({
                        isVisible: false,
                        valueId: undefined
                    }, () => {
                        resolve(value);
                    });
                }
            });
        });
    }

    private onCancelled(): void {
        if (this.state.onCancelled) {
            this.state.onCancelled();
        }
    }

    private onCompleted(): void {
        if (this.state.onCompleted && this.state.valueId !== undefined) {
            this.state.onCompleted(this.props.values[this.state.valueId]);
        }
    }

    private onItemPress(valueId: number): void {
        this.setState({
            valueId
        });
    }

}
