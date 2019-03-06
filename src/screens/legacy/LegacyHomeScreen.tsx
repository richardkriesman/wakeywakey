import { WebBrowser } from "expo";
import React, {ReactNode} from "react";
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import Styles from "./styles/LegacyStyles";

import {NavigationScreenOptions} from "react-navigation";
import { MonoText } from "../../components/StyledText";

export default class HomeScreen extends React.Component {
    public static navigationOptions: NavigationScreenOptions = {
        header: null,
    };

    public render(): ReactNode {
        return (
            <View style={Styles.container}>
                <ScrollView style={Styles.container} contentContainerStyle={Styles.contentContainer}>
                    <View style={Styles.welcomeContainer}>
                        <Image
                            source={
                                __DEV__
                                    ? require("../../../assets/images/robot-dev.png")
                                    : require("../../../assets/images/robot-prod.png")
                            }
                            style={Styles.welcomeImage}
                        />
                    </View>

                    <View style={Styles.getStartedContainer}>
                        {this.maybeRenderDevelopmentModeWarning()}

                        <Text style={Styles.getStartedText}>Get started by opening</Text>

                        <View style={[Styles.codeHighlightContainer, Styles.homeScreenFilename]}>
                            <MonoText style={Styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
                        </View>

                        <Text style={Styles.getStartedText}>
                            Change this text and your app will automatically reload.
                        </Text>
                    </View>

                    <View style={Styles.helpContainer}>
                        <TouchableOpacity onPress={this.handleHelpPress} style={Styles.helpLink}>
                            <Text style={Styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <View style={Styles.tabBarInfoContainer}>
                    <Text style={Styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

                    <View style={[Styles.codeHighlightContainer, Styles.navigationFilename]}>
                        <MonoText style={Styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
                    </View>
                </View>
            </View>
        );
    }

    private maybeRenderDevelopmentModeWarning(): ReactNode {
        if (__DEV__) {
            const learnMoreButton = (
                <Text onPress={this.handleLearnMorePress} style={Styles.helpLinkText}>
                    Learn more
                </Text>
            );

            return (
                <Text style={Styles.developmentModeText}>
                    Development mode is enabled, your app will be slower but you can use useful development
                    tools. {learnMoreButton}
                </Text>
            );
        } else {
            return (
                <Text style={Styles.developmentModeText}>
                    You are not in development mode, your app will run at full speed.
                </Text>
            );
        }
    }

    private handleLearnMorePress = () => {
        WebBrowser.openBrowserAsync("https://docs.expo.io/versions/latest/guides/development-mode");
    }

    private handleHelpPress = () => {
        WebBrowser.openBrowserAsync(
            "https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes"
        );
    }
}

