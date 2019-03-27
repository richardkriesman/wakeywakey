import React, { ReactNode } from "react";
import { StyleSheet, Text } from "react-native";

export interface HomeScreenMessageProps {
    initialText: string;
}

export interface HomeScreenMessageState {
    text: string;
}

export class HomeScreenMessage extends React.Component<HomeScreenMessageProps, HomeScreenMessageState> {
    public constructor(props: HomeScreenMessageProps) {
        super(props);
    }

    public componentWillMount(): void {
        this.setState({ text: this.props.initialText });
    }

    public get text(): string {
        return this.state.text;
    }

    public set text(text: string) {
        this.setState({ text });
    }

    public render(): ReactNode {
        return (
            <Text style={styles.message}>{this.state.text}</Text>
        );
    }
}

const styles = StyleSheet.create({
    message: {
        fontSize: 30,
        textAlign: "center"
    }
});
