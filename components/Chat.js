import { useContext, useEffect, useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

// Destructure name and background from route.params
const Chat = ({ route, navigation, db, isConnected }) => {
  const { name, background, userID } = route.params;
  const [messages, setMessages] = useState([]);

  const { db } = useContext(DatabaseContext);

  useEffect(() => {
    navigation.setOptions({ title: name });
    let unsubMessages;
    if (isConnected) {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (querySnapshot) => {
        const newMessages = querySnapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        }));
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else {
      loadCachedMessages();
    }
    return () => {
      if (unsubMessages) unsubMessages();
      if (soundObject) soundObject.unloadAsync();
    };
  }, [isConnected, db, name]);

  // Function to handle sending new messages
  const onSend = useCallback(
    async (newMessages = []) => {
      const message = newMessages[0];
      try {
        const messageToAdd = {
          _id: message._id,
          createdAt: message.createdAt,
          user: {
            _id: userID,
            name: name,
          },
        };

        if (message.text) messageToAdd.text = message.text;
        if (message.image) messageToAdd.image = message.image;
        if (message.location) messageToAdd.location = message.location;
        if (message.audio) messageToAdd.audio = message.audio;

        await addDoc(collection(db, "messages"), messageToAdd);
      } catch (error) {
        console.error("Error adding message to Firestore:", error);
      }
    },
    [db, userID, name]
  );

  // Function to customize the appearance of message bubbles
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };

  // Initialize messages when the component mounts
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Welcome to the chat! (System Message)",
        createdAt: new Date(),
        system: true,
      },
      {
        _id: 2,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

  // Update the navigation bar title when the `name` changes
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [name, navigation]);

  // Render the chat interface
  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          name: username,
        }}
      />
      {Platform.OS === "android" && <KeyboardAvoidingView behavior="height" />}
    </View>
  );
};

// Define styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "Center",
    alignItems: "center",
  },
});

export default Chat;
