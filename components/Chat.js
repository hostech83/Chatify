import { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ContextDatabase from "../ContextDatabase";

const Chat = ({ route, navigation, isConnected, storage }) => {
  const { name, background, userID } = route.params;
  const [messages, setMessages] = useState([]);
  const { db } = useContext(ContextDatabase);

  // Handle sending messages
  const onSend = async (newMessages) => {
    try {
      // Append new messages to the chat
      setMessages((prevMessages) =>
        GiftedChat.append(prevMessages, newMessages)
      );

      // Add messages to Firestore
      for (let message of newMessages) {
        await addDoc(collection(db, "messages"), {
          ...message,
          createdAt: message.createdAt || new Date(), // Ensure `createdAt` is valid
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Cache messages locally
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.error("Error caching messages:", error);
    }
  };

  // Load cached messages when offline
  const loadCachedMessages = async () => {
    try {
      const cached = await AsyncStorage.getItem("messages");
      setMessages(cached ? JSON.parse(cached) : []);
    } catch (error) {
      console.error("Error loading cached messages:", error);
    }
  };

  // Fetch messages from Firestore or cache
  useEffect(() => {
    navigation.setOptions({ title: name });

    let unsubscribeMessages;
    if (isConnected) {
      const messagesQuery = query(
        collection(db, "messages"),
        orderBy("createdAt", "desc")
      );
      unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        }));
        setMessages(newMessages);
        cacheMessages(newMessages);
      });
    } else {
      loadCachedMessages();
    }

    return () => unsubscribeMessages && unsubscribeMessages();
  }, [isConnected, db, name, navigation]);

  // Custom input toolbar based on connectivity
  const renderInputToolbar = (props) =>
    isConnected ? <InputToolbar {...props} /> : null;

  // Customize the message bubble
  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: "#000" },
        left: { backgroundColor: "#FFF" },
      }}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <GiftedChat
          messages={messages}
          onSend={onSend}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          user={{ _id: userID, name }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Define styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
