import { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
// Destructure name and background from route.params
const Chat = ({ route, navigation }) => {
  const { name, background } = route.params;
  // useEffect hook to set navigation options
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);
  /* Render a View component with dynamic background color */
  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Text>Let's Chat!</Text>
    </View>
  );
};
// Define styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default Chat;
