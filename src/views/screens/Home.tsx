import { StyleSheet } from "react-native";
import { Text, View } from "react-native";
import DuTestScreen from "./DuTest";
import HoangTestScreen from "./HoangTest";
import KhangTestScreen from "./KhangTest";
import KhanhTestScreen from "./KhanhTest";
import NhiTestScreen from "./NhiTest";

export default function HomeScreen() {
  return (
    <View>
      <Text>Home Screen</Text>

      <DuTestScreen />
      <HoangTestScreen />
      <KhangTestScreen />
      <KhanhTestScreen />
      <NhiTestScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
