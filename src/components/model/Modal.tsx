import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import RNModal from "react-native-modal";
import Colors from "../../constants/Colors";

export interface ModalProps {
    buttons?: ReactNode[];
    isVisible: boolean;
    text?: string;
    title: string;
}

export class Modal extends React.Component<ModalProps> {

    public render(): ReactNode {

        // conditionally render text
        let text: ReactNode|undefined;
        if (this.props.text) {
            text = <Text style={style.text}>{this.props.text}</Text>;
        }

        return (
            <RNModal
                avoidKeyboard={true}
                backdropOpacity={0.4}
                isVisible={this.props.isVisible}
                useNativeDriver={true}>
                <View style={style.container}>
                    <View style={style.panel}>
                        <View style={style.content}>
                            <Text style={style.title}>{this.props.title}</Text>
                            {text}
                            {this.props.children}
                        </View>
                        <View style={style.footer}>
                            {this.props.buttons}
                        </View>
                    </View>
                </View>
            </RNModal>
         );
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
