import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";
import ContextDatabase from "../ContextDatabase";

const color = [
  { backgroundColor: "#090C08", description: "Black" },
  { backgroundColor: "#474056", description: "Purple" },
  { backgroundColor: "#8A95A5", description: "Gray" },
  { backgroundColor: "#B9C6AE", description: "Green" },
];

// Get the window dimensions so that the design spec percentages can be calculated
const { height, width } = Dimensions.get("window");

const Start = ({ navigation }) => {
  const [name, setName] = useState(""); // State for user name
  const [background, setBackground] = useState(""); // State for background color

  const { auth } = useContext(ContextDatabase);

  const signInUser = () => {
    signInAnonymously(auth)
      .then((res) => {
        navigation.navigate("Chat", {
          userID: res.user.uid,
          name: name,
          background: background,
        });
        Alert.alert("Signed in Successfully");
      })
      .catch((error) => {
        console.error("Error signing in:", error.code, error.message);
        Alert.alert("Unable to sign in, try later again");
      });
  };

  console.log("I am in the start screen");

  return (
    <SafeAreaView style={styles.container} id="start-container">
      <ImageBackground
        source={require("../img/Background-image.png")}
        resizeMode="cover"
        style={styles.imageBackground}
        accessibilityRole="image"
        accessibilityLabel="Chatify app background image of two people chatting and laughing"
        alt="Chatify app background image of two people chatting and laughing"
      >
        {/* Adjust for keyboard for iOS */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.titleContainer}>
              {/* Add container for background color to help with contrast */}
              <View style={styles.titleBackground}>
                <Text
                  style={styles.title}
                  accessible={true}
                  accessibilityLabel="Chatify App Title"
                  accessibilityRole="header"
                >
                  Chatify
                </Text>
              </View>
            </View>

            <TextInput
              // Styles the color of the text input based on if it's the placeholder or active text to help with readability
              style={[styles.textInput, name ? styles.textInputActive : null]}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              importantForAccessibility="yes"
              accessible={true}
              accessibilityLabel={null}
              accessibilityHint="Enter your name"
              accessibilityRole="text"
              accessibilityState={{ expanded: true }}
            />

            <View style={styles.colorChoiceSection}>
              <Text
                style={styles.backgroundChoiceText}
                importantForAccessibility="yes"
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={null}
              >
                Choose Background Color
              </Text>
              <View
                style={styles.backgroundChoiceContainer}
                accessibilityRole="radiogroup"
              >
                <Pressable
                  accessible={true}
                  accessibilityRole="radio"
                  accessibilityLabel={`${color.description} background color`}
                  accessibilityState={{
                    checked: setBackground === color.backgroundColor,
                  }}
                  style={[
                    styles.backgroundChoiceButtons,
                    { background: color.background },
                  ]}
                  onPress={() => setBackground(color.background)}
                />
                {setBackground === color.background && (
                  <View
                    style={[
                      styles.selectedRing,
                      { borderColor: color.background },
                    ]}
                  />
                )}
              </View>

              <Pressable
                style={styles.buttonStartChat}
                accessibilityRole="button"
                accessibilityLabel="Start Chatting"
                accessibilityHint="Enter the chat room with your chosen name and background color"
                onPress={signInUser}
              >
                <Text style={styles.buttonStartChatText}>Start Chatting</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

// Define styles for the Start screen
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
    // height: "44%",
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
    borderColor: "#757083",
    borderRadius: 5,
    borderWidth: 1,
    margin: 0,
  },
  title: {
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    outlineColor: "#090C08",
    shadowLine: 5,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "88%",
    borderColor: "#757083",
    borderRadius: 5,
    borderWidth: 1,
    paddingLeft: 10,
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 50,
    color: "#757083",
    fontSize: 16,
    fontWeight: "300",
    opacity: 0.5,
    paddingHorizontal: 10,
  },
  textInputActive: {
    color: "#757083",
    opacity: 1,
  },
  colorChoiceSection: {
    width: "88%",
  },
  backgroundChoiceContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  backgroundChoiceText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    marginBottom: 10,
  },
  colorButtonWrapper: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3,
  },
  backgroundChoiceButtons: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  selectedRing: {
    position: "absolute",
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
  },
  buttonStartChat: {
    backgroundColor: "#757083",
    width: "88%",
    height: 50,
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
