import React, { ReactNode } from "react";
import { Button, Theme, ThemeProvider } from "react-native-elements";
import { Colors } from "../../constants/Colors";
import { Modal } from "./Modal";

export interface ConfirmationModalProps {
    isDestructiveAction?: boolean;
    isVisible: boolean;
    positiveLabel: string;
    negativeLabel: string;
    text?: string;
    title: string;

    onCompleted(value: boolean): void;
}

export class ConfirmationModal extends React.Component<ConfirmationModalProps> {

    public render(): ReactNode {
        let positiveButton = (
            <Button
                key={1}
                onPress={this.props.onCompleted.bind(this, true)}
                title={this.props.positiveLabel}
                type="clear" />
        );
        if (this.props.isDestructiveAction) {
            positiveButton = (
                <ThemeProvider
                    key={1}
                    theme={destructiveTheme}>
                    {positiveButton}
                </ThemeProvider>
            );
        }

        return (
            <Modal
                buttons={[
                    <Button
                        key={0}
                        onPress={this.props.onCompleted.bind(this, false)}
                        title={this.props.negativeLabel}
                        type="clear" />,
                    positiveButton
                ]}
                isVisible={this.props.isVisible}
                title={this.props.title}
                text={this.props.text} />
         );
    }

}

const destructiveTheme: Theme = {
    colors: {
        primary: Colors.common.tint.destructive
    }
};
