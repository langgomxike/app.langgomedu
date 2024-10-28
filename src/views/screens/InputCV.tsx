import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BackLayout from "../layouts/Back";
import Ionicons from "@expo/vector-icons/Ionicons";
import FloatingBack from "../components/FloatingBack";
import { ScrollView } from "react-native-gesture-handler";
import {
  BarcodeScanningResult,
  Camera,
  useCameraPermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";
import SLog, { LogType } from "../../services/SLog";

const AVATAR_SIZE = 100;

export default function InputCVScreen() {
  //states
  const [permission, requestPermission] = useCameraPermissions();

  //handlers
  const pickImage = useCallback(() => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    })
      .then((result) => {
        SLog.log(LogType.Info, "ImagePicker", "process result", result);

        if (!result.canceled) {
          return Camera.scanFromURLAsync(result.assets[0].uri);
        }
        return [];
      })
      .then((value: BarcodeScanningResult[]) => {
        SLog.log(
          LogType.Info,
          "BarcodeScanningResult",
          "process result",
          value
        );
      });
  }, [permission]);

  return (
    <View style={styles.container}>
      <FloatingBack />

      <ScrollView style={styles.container}>
        <TouchableOpacity style={{ alignSelf: "center" }} onPress={pickImage}>
          <Image
            source={require("../../../assets/avatar/img_avatar_cat.png")}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  avatar: {
    borderRadius: 50,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignSelf: "center",
    marginTop: 20,
  },
});
