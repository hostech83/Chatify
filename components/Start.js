import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";

const Start = () => {
  return (
    <ImageBackground
      source={require("../img/Background-image.png")} // Update path as necessary
      style={styles.background}
      resizeMode="cover" // Ensure the image covers the entire screen
    >
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to Chatify!</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1, // Ensures the background fills the screen
    justifyContent: "center",
  },
  container: {
    flex: 1, // Ensures the content takes full height of the screen
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#fff",
  },
});

export default Start;
