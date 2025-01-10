import React, { useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Audio } from "expo-av";
import { v4 as uuidv4 } from "uuid";

const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  onSend,
  storage,
  userID,
  name,
}) => {
  const actionSheet = useActionSheet();
  let recordingObject = null;

  const startRecording = async () => {
    try {
      const permissions = await Audio.requestPermissionsAsync();
      if (permissions?.granted) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        recordingObject = recording;
        Alert.alert(
          "You are recording...",
          undefined,
          [
            {
              text: "Cancel",
              onPress: () => stopRecording(),
            },
            {
              text: "Stop and Send",
              onPress: () => sendRecordedSound(),
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert("Permissions not granted for recording audio.");
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      Alert.alert("Failed to record!");
    }
  };

  const stopRecording = async () => {
    if (recordingObject) {
      await recordingObject.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
      });
    }
  };

  const sendRecordedSound = async () => {
    if (recordingObject) {
      await stopRecording();
      const uniqueRefString = generateReference(recordingObject.getURI());
      const newUploadRef = ref(storage, uniqueRefString);
      const response = await fetch(recordingObject.getURI());
      const blob = await response.blob();
      const snapshot = await uploadBytes(newUploadRef, blob);
      const soundURL = await getDownloadURL(snapshot.ref);

      const message = {
        _id: uuidv4(),
        audio: soundURL,
        createdAt: new Date(),
        user: {
          _id: userID,
          name: name,
        },
      };

      onSend([message]);
    }
  };

  useEffect(() => {
    return () => {
      if (recordingObject) recordingObject.stopAndUnloadAsync();
    };
  }, []);

  const onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            break;
          case 1:
            takePhoto();
            break;
          case 2:
            getLocation();
            break;
          default:
            break;
        }
      }
    );
  };

  const pickImage = async () => {
    const permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (!result.canceled) {
        const imageURI = result.assets[0].uri;
        uploadAndSendImage(imageURI);
      }
    } else {
      Alert.alert("Permissions not granted for media library.");
    }
  };

  const takePhoto = async () => {
    const permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      const result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) {
        const imageURI = result.assets[0].uri;
        uploadAndSendImage(imageURI);
      }
    } else {
      Alert.alert("Permissions not granted for camera.");
    }
  };

  const getLocation = async () => {
    const permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        const message = {
          _id: uuidv4(),
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
          createdAt: new Date(),
          user: {
            _id: userID,
            name: name,
          },
        };
        onSend([message]);
      }
    } else {
      Alert.alert("Permissions not granted for location.");
    }
  };

  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split("/").pop();
    return `${userID}-${timeStamp}-${imageName}`;
  };

  const uploadAndSendImage = async (imageURI) => {
    try {
      // generate a unique name to use as reference
      const uniqueRefString = generateReference(imageURI);
      const newUploadRef = ref(storage, uniqueRefString);

      // get the file as a blob
      const response = await fetch(imageURI);
      const blob = await response.blob();

      // upload the image
      const snapshot = await uploadBytes(newUploadRef, blob);
      const imageURL = await getDownloadURL(snapshot.ref);

      // generate the message
      const message = {
        _id: uuidv4(),
        image: imageURL,
        createdAt: new Date(),
        user: {
          _id: userID,
          name: name,
        },
      };

      onSend([message]);
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error uploading image.");
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onActionPress}
      accessibilityLabel="Action options"
      accessibilityHint="Choose to send an image, take a picture, send a voice recording, or share your location"
      accessibilityRole="button"
    >
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default CustomActions;
