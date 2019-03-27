import {AppLoading, Font} from "expo";
import React, {ReactNode} from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import {AppDatabase} from "./utils/AppDatabase";

export interface AppProps {
    skipLoadingScreen?: boolean;
}

export interface AppState {
    isLoadingComplete: boolean;
}

export default class App extends React.Component<AppProps, AppState> {

    private db: AppDatabase;

    public constructor(props: AppProps) {
        super(props);
        this.state = {
            isLoadingComplete: false
        };
    }

    public render(): ReactNode {
        if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
            return (
                <AppLoading
                    startAsync={this.loadResources.bind(this)}
                    onError={this.handleLoadingError.bind(this)}
                    onFinish={this.handleFinishLoading.bind(this)}
                />
            );
        } else {
            return (
                <View style={styles.container}>
                    {Platform.OS === "ios" && <StatusBar barStyle="default" />}
                    <AppNavigator />
                </View>
            );
        }
    }

    private async loadResources(): Promise<void> {

        // open the database
        this.db = await AppDatabase.init();

        // load fonts
        await Font.loadAsync({
            "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf")
        });
    }

    private handleLoadingError(error: Error): void {
        // In this case, you might want to report the error to your error
        // reporting service, for example Sentry
        console.warn(error);
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
