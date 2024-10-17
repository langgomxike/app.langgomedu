import { useCallback, useContext, useEffect } from "react";
import {
  BarcodeScanningResult,
  Camera,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationContext } from "@react-navigation/native";
import SLog, { LogType } from "../../services/SLog";
import QRItemType, { QRItems } from "../../configs/QRConfig";
import ScreenName from "../../constants/ScreenName";

export default function ScannerScreen() {
  //refs, contexts
  const navigation = useContext(NavigationContext);
  const [permission, requestPermission] = useCameraPermissions();

  //handlers
  const handleScan = useCallback(
    (scanningResult: BarcodeScanningResult) => {
      SLog.log(
        LogType.Info,
        "scanningResult",
        "process result",
        scanningResult
      );
      processResult(scanningResult.data);
    },
    [permission]
  );

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

        processResult(value.length > 0 ? value[0].data : "");
      });
  }, [permission]);

  const processResult = useCallback(
    (result: string) => {
      SLog.log(LogType.Info, "ScannerScreen", "process result", result);
      let qrItem: QRItemType;
      try {
        qrItem = JSON.parse(result);
      } catch (error) {
        navigation?.goBack();
        alert("Wrong data :<");
        SLog.log(LogType.Error, "Scan QR", "processResult", error);
        return;
      }

      navigation?.goBack();
      if (!qrItem.id || !qrItem.type) {
        alert("Wrong data :<");
      } else {
        switch (qrItem.type) {
          case QRItems.CLASS:
            navigation?.navigate(ScreenName.DETAIL_CLASS, { id: qrItem.id });
            break;

          case QRItems.CV:
            navigation?.navigate(ScreenName.CV, { id: qrItem.id });
            break;

          case QRItems.USER:
            navigation?.navigate(ScreenName.PROFILE, { id: qrItem.id });
            break;
        }
      }
    },
    [permission]
  );

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  return (
    <View style={styles.container}>
      {/* camera */}
      <View style={{ flex: 1, justifyContent: "center" }}>
        <CameraView
          onBarcodeScanned={handleScan}
          style={[styles.camera]}
          facing={"back"}
        />
        {/* pick up qr image */}

        <Pressable
          style={[styles.button, styles.backButton]}
          onPress={navigation?.goBack}
        >
          <Ionicons name="close" size={45} color={TextColor.sub_primary} />
        </Pressable>

        <Pressable
          style={[styles.button, styles.imageButton]}
          onPress={pickImage}
        >
          <Ionicons name="image" size={45} color={TextColor.sub_primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.white,
  },

  button: {
    shadowColor: TextColor.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    backgroundColor: BackgroundColor.white,
    borderRadius: 20,
    padding: 5,
    alignSelf: "center",
    position: "absolute",
  },

  backButton: {
    bottom: 20,
    left: 20,
  },

  imageButton: {
    bottom: 20,
    right: 20,
  },

  message: {
    textAlign: "center",
    paddingBottom: 10,
  },

  camera: {
    flex: 1,
  },

  scanButtonImage: {
    width: 50,
    height: 50,
  },
});
