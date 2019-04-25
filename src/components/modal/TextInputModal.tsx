import React, { ReactNode } from "react";
import { StyleSheet} from "react-native";
import { Button, Input } from "react-native-elements";
import Colors from "../../constants/Colors";
import { Modal } from "./Modal";

export interface TextInputModalProps {
    isVisible: boolean;
    maxLength?: number;
    placeholder?: string;
    text: string;
    title: string;

    onCancelled?(): void;
    onCompleted(text: string): void;
}

interface TextInputModalState {
    value: string;
}

export class TextInputModal extends React.Component<TextInputModalProps, TextInputModalState> {

    public constructor(props: TextInputModalProps) {
        super(props);
        this.state = {
            value: ""
        };
    }

    public render(): ReactNode {
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
                        onPress={this.onCompleted.bind(this)}
                        title="OK"
                        type="clear" />
                ]}
                isVisible={this.props.isVisible}
                title={this.props.title}
                text={this.props.text}>
                <Input
                    containerStyle={style.input}
                    inputContainerStyle={style.inputContainer}
                    onChangeText={this.onChangeText.bind(this)}
                    placeholder={this.props.placeholder}
                    maxLength={this.props.maxLength}
                    shake={true}
                    value={this.state.value}
                />
            </Modal>
         );
    }

    private onCancelled(): void {
        this.setState({
            value: ""
        }, () => {
            if (this.props.onCancelled) {
                this.props.onCancelled();
            }
        });
    }

    private onChangeText(text: string): void {
        this.setState({
            value: text
        });
    }

    private onCompleted(): void {
        const value: string = this.state.value;
        this.setState({
            value: ""
        }, () => {
            if (value.length > 0) {
                this.props.onCompleted(value);
            }
        });
    }

}

export const style = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center"
    },
    content: {
        padding: 24
    },
    footer: {
        borderTopColor: Colors.common.alert.separator,
        borderTopWidth: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingBottom: 4,
        paddingLeft: 18,
        paddingRight: 18,
        paddingTop: 4
    },
    input: {
        paddingHorizontal: 0 // override 10px padding on ends of input
    },
    inputContainer: {
        borderBottomColor: Colors.common.alert.separator
    },
    panel: {
        backgroundColor: Colors.white,
        borderRadius: 4
    },
    text: {
        fontSize: 17,
        marginBottom: 8
    },
    title: {
        fontSize: 17,
        fontWeight: "600",
        marginBottom: 8
    }
});
