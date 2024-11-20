import { StyleSheet, Text, TouchableOpacity } from "react-native";
import BackLayout from "../layouts/Back";
import QRInfo from "../components/QRInfo";
import { QRItems } from "../../configs/QRConfig";
import BackWithDetailLayout from "../layouts/BackWithDetail";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useContext } from "react";
import { NavigationContext } from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";

export default function CVScreen() {
  //contexts
  const navigation = useContext(NavigationContext);

  //handlers
  const goToInputScreen = useCallback(() => {
    navigation?.navigate(ScreenName.INPUT_CV);
  }, []);

  return (
    <>
      <QRInfo id={123} type={QRItems.CV} />

      <BackWithDetailLayout icName="">
        {/* edit button */}
        <TouchableOpacity
          onPress={goToInputScreen}
          style={styles.floatEditButton}
        >
          <Ionicons name="pencil" size={20} />
        </TouchableOpacity>
      </BackWithDetailLayout>
    </>
  );
}

const styles = StyleSheet.create({
  floatEditButton: {
    position: "absolute",
    right: 20,
    top: 20,
    minWidth: 20,
    minHeight: 20,
    backgroundColor: BackgroundColor.gray_10,
    padding: 10,
    borderRadius: 30,
    shadowColor: TextColor.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});
