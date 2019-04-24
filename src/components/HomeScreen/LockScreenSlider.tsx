/**
 * @module components
 */

import React, { Component, ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import VerticalSwipe from "react-native-vertical-swipe";

/**
 * The vertical slider for password on the home screen.
 *
 * @author Cody Kyrk
 */

export class LockScreenSlider extends Component {
    public render(): ReactNode {
        return (
            <VerticalSwipe
                offsetTop={300}   // Distance from top slider reaches
                closeSwipeThreshold={25} // Distance for slide to register
                openSwipeOffset={150} // Size of area open slide is registered
                // style={styles.dragContainer}
                content={(
                    <View style={styles.innerContainer}>
                        <ScrollView>
                            <Text style={styles.innerText}>
                                Spongebob me boy, enter that password! Arghegegegegegh
                            </Text>
                            <Text style={styles.innerText}>
                                Spongebob me boy, enter that password! Arghegegegegegh
                            </Text>
                        </ScrollView>
                    </View>
                )}>
            </VerticalSwipe>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "blue"
    },

    // Screen
    dragContainer: {
        alignItems: "center",
        backgroundColor: "gray",
        flex: 1,
        justifyContent: "center",
        zIndex: 2,
    },

    // Slider
    innerContainer: {
        alignSelf: "center",
        backgroundColor: "black",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: 600,
        width: 300,
        zIndex: 2,
    },

    // Text in slider
    innerText: {
        color: "white",
        padding: 50
    }
});
