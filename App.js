//app.js
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";
import ContextDatabase from "./ContextDatabase";
import { initializeAuth } from "firebase/auth";
//@ts-ignore
import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";

import { getStorage } from "firebase/storage";
import { useNetInfo } from "@react-native-community/netinfo";
import Start from "./components/Start";
import Chat from "./components/Chat";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogBox } from "react-native";

// Ignore all warnings in the console
LogBox.ignoreAllLogs();

// Create the navigator
const Stack = createNativeStackNavigator();

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfXIn81-Ds74KDmwJ5iKEEp0wkwcvJgaw",
  authDomain: "chatify-6e517.firebaseapp.com",
  projectId: "chatify-6e517",
  storageBucket: "chatify-6e517.firebasestorage.app",
  messagingSenderId: "38738128338",
  appId: "1:38738128338:web:91fa3f427da6c269006c0b",
};

// Ensure Firebase is initialized only once
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Firebase Auth only once
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const connectionStatus = useNetInfo();

  useEffect(() => {
    setIsConnected(connectionStatus.isConnected);
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <ContextDatabase.Provider value={{ db, auth }}>
      <NavigationContainer style={styles.container}>
        <Stack.Navigator>
          <Stack.Screen name="Start" component={Start} />
          <Stack.Screen name="Chat">
            {(props) => (
              <Chat
                {...props}
                isConnected={isConnected}
                storage={storage}
                db={db}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ContextDatabase.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
