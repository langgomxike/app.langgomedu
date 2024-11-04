import { StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import { useContext } from "react";
import { NavigationContext } from "@react-navigation/native";

export default function FloatingBack() {
  //contexts
  const navigation = useContext(NavigationContext);

  return (
    <TouchableOpacity style={styles.container} onPress={navigation?.goBack}>
      <Ionicons name="chevron-back" size={20} color={TextColor.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 10,
    top: 0,
    shadowColor: TextColor.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    backgroundColor: BackgroundColor.gray_10,
    borderRadius: 30,
    padding: 5,
    textAlign: "center",
  },
});
