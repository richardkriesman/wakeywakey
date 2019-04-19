/**
 * @module components
 */

import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';

import VerticalSwipe from 'react-native-vertical-swipe';

/**
 * The vertical slider for password on the home screen.
 *
 * @author Cody Kyrk
 */

export class LockScreenSlider extends Component {
  render() {
    return (
      <View style={styles.container}>
        <VerticalSwipe
          offsetTop={300}   // Distance from top slider reaches
          closeSwipeThreshold={25} // Distance for slide to register
          openSwipeOffset={150} // Size of area open slide is registered
          //style={styles.dragContainer}
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
      </View>
    );
  }
}

//<Text style={styles.text}>Try to swap from the deep bottom</Text>


//export default LockScreenSlider;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    // Screen
    dragContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "gray",
      //openSwipeOffset: 200,
    },
  
    // Slider
    innerContainer: {
      alignSelf: "center",
      backgroundColor: "black",
      //blurRadius: 10,
      //opacity: .5,
      width: 300, 
      height: 600, 
      borderTopLeftRadius: 25, 
      borderTopRightRadius: 25,
    },
  
    // Text in slider
    innerText: {
      color: "white",
      //opacity: 10,
      padding: 50,
    }
  });