import { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import MapView from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import ContextDatabase from "../ContextDatabase";
import CustomActions from "./CustomActions";

const Chat = ({ route, navigation, isConnected, storage }) => {
  const { name, background, userID } = route.params;
  const [messages, setMessages] = useState([]);
  const { db } = useContext(ContextDatabase);
  let soundObject = null;

  // Handle sending messages
  const onSend = async (newMessages) => {
    try {
      setMessages((prevMessages) =>
        GiftedChat.append(prevMessages, newMessages)
      );

      for (let message of newMessages) {
        await addDoc(collection(db, "messages"), {
          ...message,
          createdAt: message.createdAt || new Date(),
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

  const renderInputToolbar = (props) => {
    if (isConnected) {
      return <InputToolbar {...props} />;
    }
    return (
      <View style={styles.offlineInputToolbar}>
        <Text style={styles.offlineTextInput}>No network connection</Text>
      </View>
    );
  };

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: "#000" },
        left: { backgroundColor: "#FFF" },
      }}
    />
  );

  const renderAudioBubble = (props) => (
    <TouchableOpacity
      style={styles.audioBubble}
      onPress={async () => {
        try {
          if (soundObject) soundObject.unloadAsync();
          const { sound } = await Audio.Sound.createAsync({
            uri: props.currentMessage.audio,
          });
          soundObject = sound;
          await sound.playAsync();
        } catch (error) {
          console.error("Error playing audio:", error);
        }
      }}
    >
      <Text style={styles.audioText}>Play Sound</Text>
    </TouchableOpacity>
  );

  const renderCustomActions = (props) => (
    <CustomActions
      {...props}
      storage={storage}
      userID={userID}
      name={name}
      onSend={onSend}
    />
  );

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={styles.mapView}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
          <GiftedChat
            messages={messages}
            onSend={onSend}
            renderActions={renderCustomActions}
            renderCustomView={renderCustomView}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            renderMessageAudio={renderAudioBubble}
            user={{ _id: userID, name }}
          />
        </KeyboardAvoidingView>
      ) : (
        <GiftedChat
          messages={messages}
          onSend={onSend}
          renderActions={renderCustomActions}
          renderCustomView={renderCustomView}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderMessageAudio={renderAudioBubble}
          user={{ _id: userID, name }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  offlineTextInput: {
    color: "black",
    fontSize: 16,
  },
  offlineInputToolbar: {
    backgroundColor: "lightgrey",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
  audioBubble: {
    backgroundColor: "#FF0",
    borderRadius: 10,
    margin: 5,
    padding: 10,
  },
  audioText: {
    textAlign: "center",
    color: "black",
  },
});

export default Chat;
