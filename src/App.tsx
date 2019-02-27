import { AppLoading, Asset, Font, Icon } from "expo";
import React, {ReactNode} from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import AppNavigator from "./navigation/AppNavigator";

export interface AppProps {
    skipLoadingScreen?: boolean;
}

export interface AppState {
    isLoadingComplete: boolean;
}

export default class App extends React.Component<AppProps, AppState> {

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
                    startAsync={this.loadResourcesAsync.bind(this)}
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

    private loadResourcesAsync(): Promise<any> {
        return Promise.all([
            Asset.loadAsync([
                require("../assets/images/robot-dev.png"),
                require("../assets/images/robot-prod.png"),
            ]),
            Font.loadAsync({
                // This is the font that we are using for our tab bar
                ...Icon.Ionicons.font,
                // We include SpaceMono because we use it in HomeScreen.js. Feel free
                // to remove this if you are not using it in your app
                "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
            }),
        ]);
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
    },
});
