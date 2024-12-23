import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  Pressable,
  SafeAreaView,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import { signInAnonymously } from "firebase/auth";
import ContextDatabase from "../ContextDatabase";

// Color options for background
const colorOptions = [
  { backgroundColor: "#090C08", description: "Black" },
  { backgroundColor: "#474056", description: "Purple" },
  { backgroundColor: "#8A95A5", description: "Gray" },
  { backgroundColor: "#B9C6AE", description: "Green" },
];

const { height } = Dimensions.get("window");

const Start = ({ navigation }) => {
  const [name, setName] = useState(""); // User name
  const [background, setBackground] = useState(""); // Background color
  const { auth } = useContext(ContextDatabase);

  // Function to handle anonymous sign-in
  const signInUser = () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter your name to proceed.");
      return;
    }

    signInAnonymously(auth)
      .then((res) => {
        navigation.navigate("Chat", {
          userID: res.user.uid,
          name,
          background,
        });
        Alert.alert("Signed in Successfully");
      })
      .catch((error) => {
        console.error("Error signing in:", error.code, error.message);
        Alert.alert("Unable to sign in. Please try again later.");
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../img/Background-image.png")}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.titleContainer}>
              <View style={styles.titleBackground}>
                <Text style={styles.title}>Chatify</Text>
              </View>
            </View>

            <TextInput
              style={[styles.textInput, name ? styles.textInputActive : null]}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              accessible
              accessibilityLabel="Enter your name"
              accessibilityHint="Provide your name to proceed to the chat."
            />

            <View style={styles.colorChoiceSection}>
              <Text style={styles.backgroundChoiceText}>
                Choose Background Color
              </Text>
              <View style={styles.backgroundChoiceContainer}>
                {colorOptions.map((color, index) => (
                  <Pressable
                    key={index}
                    style={[
                      styles.backgroundChoiceButtons,
                      { backgroundColor: color.backgroundColor },
                      background === color.backgroundColor &&
                        styles.selectedRing,
                    ]}
                    onPress={() => setBackground(color.backgroundColor)}
                    accessible
                    accessibilityRole="radio"
                    accessibilityLabel={`${color.description} background color`}
                    accessibilityState={{
                      selected: background === color.backgroundColor,
                    }}
                  />
                ))}
              </View>
            </View>

            <Pressable
              style={styles.buttonStartChat}
              onPress={signInUser}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Start Chatting"
              accessibilityHint="Navigate to the chat screen with your chosen name and background."
            >
              <Text style={styles.buttonStartChatText}>Start Chatting</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

// Define styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
    height: height * 0.44,
  },
  titleContainer: {
    flex: 1,
    margin: 80,
  },
  titleBackground: {
    width: 250,
    height: 65,
    backgroundColor: "#757083",
    opacity: 0.95,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  textInput: {
    width: "88%",
    height: 50,
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    borderWidth: 1,
    borderColor: "#757083",
    borderRadius: 5,
    paddingHorizontal: 10,
    opacity: 0.5,
  },
  textInputActive: {
    opacity: 1,
  },
  colorChoiceSection: {
    width: "88%",
    marginVertical: 20,
  },
  backgroundChoiceText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    marginBottom: 10,
  },
  backgroundChoiceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backgroundChoiceButtons: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginHorizontal: 5,
  },
  selectedRing: {
    borderWidth: 2,
    borderColor: "#FCD95B",
  },
  buttonStartChat: {
    width: "88%",
    height: 50,
    backgroundColor: "#757083",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
  },
  buttonStartChatText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default Start;
