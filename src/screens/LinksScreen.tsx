import { ExpoLinksView } from "@expo/samples";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

export default class LinksScreen extends React.Component {
    public static navigationOptions = {
        title: "Links",
    };

    public render() {
        return (
            <ScrollView style={styles.container}>
                {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
                <ExpoLinksView />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
        paddingTop: 15
    },
});
