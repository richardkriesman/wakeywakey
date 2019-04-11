import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import Modal from "react-native-modal";
import Colors from "../constants/Colors";

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
                avoidKeyboard={true}
                backdropOpacity={0.4}
                isVisible={this.props.isVisible}
                useNativeDriver={true}>
                <View style={style.container}>
                    <View style={style.panel}>
                        <View style={style.content}>
                            <Text style={style.title}>{this.props.title}</Text>
                            <Text style={style.text}>{this.props.text}</Text>
                            <Input
                                containerStyle={style.input}
                                inputContainerStyle={style.inputContainer}
                                onChangeText={this.onChangeText.bind(this)}
                                placeholder={this.props.placeholder}
                                maxLength={this.props.maxLength}
                                shake={true}
                                value={this.state.value}
                            />
                        </View>
                        <View style={style.footer}>
                            <Button
                                onPress={this.onCancelled.bind(this)}
                                title="Cancel"
                                type="clear" />
                            <Button
                                onPress={this.onCompleted.bind(this)}
                                title="OK"
                                type="clear" />
                        </View>
                    </View>
                </View>
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
        borderTopColor: Colors.alertFooterSeparator,
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
        borderBottomColor: Colors.alertFooterSeparator
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
