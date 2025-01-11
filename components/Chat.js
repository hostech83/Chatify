import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Composer,
  Send,
  SystemMessage,
  Day,
  Message,
} from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ContextDatabase from "../ContextDatabase";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";
import colorMatrix from "../colorMatrix";
import { Audio } from "expo-av";

const Chat = ({ route, navigation, isConnected, storage }) => {
  const { name, chatBackgroundColor, userID } = route.params;
  const [messages, setMessages] = useState([]);
  const { db } = useContext(ContextDatabase);
  let soundObject = null;

  const selectedColorScheme = colorMatrix.find(
    (color) => color.backgroundColor === chatBackgroundColor
  );

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

  const cacheMessages = async (messagesToCache) => {
    try {
      if (messagesToCache && messagesToCache.length > 0) {
        await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
      }
    } catch (error) {
      console.error("Error caching messages:", error.code, error.message);
    }
  };

  const loadCachedMessages = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem("messages");
      if (cachedMessages !== null) {
        setMessages(JSON.parse(cachedMessages));
      }
    } catch (error) {
      console.error(
        "Error loading messages from cache:",
        error.code,
        error.message
      );
    }
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: selectedColorScheme.bubbleColor,
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
        textStyle={{
          right: {
            color: selectedColorScheme.bubbleColorText,
          },
        }}
        timeTextStyle={{
          right: {
            color: selectedColorScheme.bubbleColorText,
          },
          left: {
            color: "Black",
          },
        }}
        accessibilityLabel={`Message from ${props.currentMessage.user.name}: ${props.currentMessage.text}`}
        accessibilityRole="text"
      />
    );
  };

  const renderAudioBubble = (props) => {
    return (
      <View {...props}>
        <TouchableOpacity
          style={{ backgroundColor: "#FF0", borderRadius: 10, margin: 5 }}
          onPress={async () => {
            const { sound } = await Audio.Sound.createAsync({
              uri: props.currentMessage.audio,
            });
            await sound.playAsync();
          }}
        >
          <Text style={{ textAlign: "center", color: "black", padding: 5 }}>
            Play Sound
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMessageAudio = (props) => {
    return (
      <View {...props}>
        <TouchableOpacity
          style={{ backgroundColor: "#FF0", borderRadius: 10, margin: 5 }}
          onPress={async () => {
            if (soundObject) soundObject.unloadAsync();
            const { sound } = await Audio.Sound.createAsync({
              uri: props.currentMessage.audio,
            });
            soundObject = sound;
            await sound.playAsync();
          }}
        >
          <Text style={{ textAlign: "center", color: "black", padding: 5 }}>
            Play Sound
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSystemMessage = (props) => (
    <SystemMessage
      {...props}
      textStyle={{
        color: selectedColorScheme.systemMessageTextColor,
      }}
    />
  );

  const renderDay = (props) => (
    <Day
      {...props}
      textStyle={{
        color: selectedColorScheme.systemMessageTextColor,
      }}
    />
  );

  const renderMessage = (props) => {
    return (
      <View>
        {props.position === "left" && (
          <Text
            style={styles.nameText}
            textStyle={{ coler: selectedColorScheme.systemMessageTextColor }}
          >
            {props.currentMessage.user.name}
          </Text>
        )}
        <Message {...props} />
      </View>
    );
  };

  const renderSend = (props) => {
    return <Send {...props} containerStyle={styles.sendContainer} />;
  };

  // Show an offline message in the input toolbar if there is no network connection
  const renderInputToolbar = (props) => {
    if (isConnected === true) {
      return <InputToolbar {...props} />;
    } else {
      return (
        <View style={styles.offlineInputToolbar}>
          <Text style={styles.offlineTextInput}>No network connection</Text>
        </View>
      );
    }
  };

  // Disable the composer if there is no network connection
  const renderComposer = (props) => {
    return (
      <Composer
        {...props}
        textInputStyle={isConnected === false ? styles.offlineTextInput : null}
        disableComposer={isConnected === false ? false : true}
      />
    );
  };

  const renderCustomActions = (props) => {
    return (
      <CustomActions
        {...props}
        storage={storage}
        userID={userID}
        name={name}
        onSend={onSend}
        wrapperStyle={styles.customActionsWrapper}
        iconTextStyle={styles.customActionsIconText}
      />
    );
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: chatBackgroundColor }]}
    >
      {Platform.OS === "android" && <KeyboardAvoidingView behavior="padding" />}
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          name: name,
        }}
        renderBubble={renderBubble}
        renderSystemMessage={renderSystemMessage}
        renderDay={renderDay}
        renderMessage={renderMessage}
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        renderSend={renderSend}
        renderMessageAudio={renderAudioBubble}
        maxComposerHeight={100}
        minComposerHeight={Platform.OS === "ios" ? 40 : 60}
        textInputProps={{
          importantForAccessibility: "yes",
          accessible: true,
          accessibilityRole: "text",
          accessibilityHint: isConnected
            ? "Type your message here"
            : "No network connection",
          accessibilityLabel: null,
          multiline: true,
          editable: isConnected,
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  nameText: {
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 2,
  },
  offlineInputToolbar: {
    backgroundColor: "lightgrey",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  offlineTextInput: {
    color: "black",
    fontSize: 16,
  },
  customActionsWrapper: {
    alignSelf: "center",
    marginLeft: 0,
    marginRight: 4,
    marginBottom: 0,
  },
  customActionsIconText: {
    fontSize: 20,
  },
  sendContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginRight: 4,
  },
});

export default Chat;
