import React, { useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
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
      let permissions = await Audio.requestPermissionsAsync();
      if (permissions?.granted) {
        // iOS specific config to allow recording on iPhone devices
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
          .then((results) => {
            return results.recording;
          })
          .then((recording) => {
            recordingObject = recording;
            Alert.alert(
              "You are recording...",
              undefined,
              [
                {
                  text: "Cancel",
                  onPress: () => {
                    stopRecording();
                  },
                },
                {
                  text: "Stop and Send",
                  onPress: () => {
                    sendRecordedSound();
                  },
                },
              ],
              { cancelable: false }
            );
          });
      }
    } catch (err) {
      Alert.alert("Failed to record!");
    }
  };
  const stopRecording = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false,
    });
    await recordingObject.stopAndUnloadAsync();
  };
  const sendRecordedSound = async () => {
    await stopRecording();
    const uniqueRefString = generateReference(recordingObject.getURI());
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(recordingObject.getURI());
    const blob = await response.blob();
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
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
    });
  };
  // Unload object from memory
  useEffect(() => {
    return () => {
      if (recordingObject) recordingObject.stopAndUnloadAsync();
    };
  }, []);

  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (!result.canceled) {
        const imageURI = result.assets[0].uri;
        uploadAndSendImage(imageURI);
      }
    } else {
      Alert.alert("Permissions haven't been granted.");
    }
  };

  const uploadAndSendImage = async (imageURI) => {
    try {
      const uniqueRefString = generateReference(imageURI);
      const response = await fetch(imageURI);
      const blob = await response.blob();
      const newUploadRef = ref(storage, uniqueRefString);
      const snapshot = await uploadBytes(newUploadRef, blob);
      const imageURL = await getDownloadURL(snapshot.ref);

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
      Alert.alert("Error", "Failed to upload and send the image");
    }
  };

  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${userID}-${timeStamp}-${imageName}`;
  };

  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) {
        uploadAndSendImage(result.assets[0].uri);
      }
    } else {
      Alert.alert("Permissions haven't been granted.");
    }
  };

  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
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
      } else Alert.alert("Error occurred while fetching location");
    } else Alert.alert("Permissions haven't been granted.");
  };

  const onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Record a Sound",
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
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
            return;
          case 3:
            startRecording();
            return;
          default:
        }
      }
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onActionPress}
      accessible={true}
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
    marginBottom: 2,
    justifyContent: "center",
    alignSelf: "center",
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default CustomActions;
