/**
 * @module app
 */

import { AppLoading, Font } from "expo";
import React, { ReactNode } from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";

import AppNavigator from "./navigation/AppNavigator";
import AppTimer from "./utils/AppTimer";

export interface AppProps {
    skipLoadingScreen?: boolean;
}

export interface AppState {
    isLoadingComplete: boolean;
}

export default class App extends React.Component<AppProps, AppState> {

    private static async loadResources(): Promise<void> {
        await Font.loadAsync({
            "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf")
        });
    }

    private static handleLoadingError(error: Error): void {
        // In this case, you might want to report the error to your error
        // reporting service, for example Sentry
        console.warn(error);
    }

    public constructor(props: AppProps) {
        super(props);
        this.state = {
            isLoadingComplete: false
        };
    }

    public componentWillMount() {
        // start services
        AppTimer.start();
    }

    public render(): ReactNode {
        if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
            return (
                <AppLoading
                    startAsync={App.loadResources.bind(this)}
                    onError={App.handleLoadingError.bind(this)}
                    onFinish={this.handleFinishLoading.bind(this)}
                />
            );
        } else {
            return (
                <View style={styles.container}>
                    {Platform.OS === "ios" && <StatusBar barStyle="default"/>}
                    <AppNavigator/>
                </View>
            );
        }
    }

    private handleFinishLoading(): void {
        this.setState({ isLoadingComplete: true });
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1
    }
});
