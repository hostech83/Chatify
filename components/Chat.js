import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import ContextDatabase from "../ContextDatabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, isConnected, storage, db }) => {
  const { name, background, userID } = route.params;
  const [messages, setMessages] = useState([]);

  const onSend = async (newMessages) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    try {
      for (let message of newMessages) {
        await addDoc(collection(db, "messages"), {
          ...message,
          createdAt: message.createdAt,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    navigation.setOptions({ title: name });
    let unsubMessages;

    if (isConnected) {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt),
        }));
        setMessages(newMessages);
        cacheMessages(newMessages);
      });
    } else {
      loadCachedMessages();
    }

    return () => unsubMessages && unsubMessages();
  }, [isConnected, db, name]);

  const renderInputToolbar = (props) =>
    isConnected ? <InputToolbar {...props} /> : null;

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: "#000" },
        left: { backgroundColor: "#FFF" },
      }}
    />
  );

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.error("Error caching messages:", error);
    }
  };

  const loadCachedMessages = async () => {
    try {
      const cached = await AsyncStorage.getItem("messages");
      setMessages(cached ? JSON.parse(cached) : []);
    } catch (error) {
      console.error("Error loading cached messages:", error);
    }
  };

  console.log("I am in the chat screen");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        user={{ _id: userID, name }}
      />
      {Platform.OS === "android" && <KeyboardAvoidingView behavior="height" />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default Chat;
