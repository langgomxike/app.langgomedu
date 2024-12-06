import {useCallback, useContext, useEffect} from "react";
import {
  BarcodeScanningResult, BarcodeType,
  Camera,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import {Alert, Pressable, StyleSheet, useWindowDimensions, View} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import {NavigationContext} from "@react-navigation/native";
import SLog, {LogType} from "../../services/SLog";
import QRItemType, {QRItems} from "../../configs/QRConfig";
import ScreenName from "../../constants/ScreenName";
import {LanguageContext} from "../../configs/LanguageConfig";
import Toast from "react-native-simple-toast";
import RNQRGenerator from "rn-qr-generator";

export default function ScannerScreen() {
  //refs, contexts
  const navigation = useContext(NavigationContext);
  const [permission, requestPermission] = useCameraPermissions();
  const language = useContext(LanguageContext).language;

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

  const processResult = useCallback(
    (result: string) => {
      SLog.log(LogType.Info, "ScannerScreen", "process result", result);
      let qrItem: QRItemType;

      try {
        qrItem = JSON.parse(result);
      } catch (error) {
        navigation?.goBack();
        Toast.show(language.CANNOT_SCAN_QR, 1000);
        SLog.log(LogType.Error, "Scan QR", "processResult", error);
        return;
      }

      navigation?.goBack();
      if (!qrItem.id || !qrItem.type) {
        Toast.show(language.CANNOT_SCAN_QR, 1000);
      } else {
        switch (qrItem.type) {
          case QRItems.CLASS:
            navigation?.navigate(ScreenName.DETAIL_CLASS, {id: qrItem.id});
            break;

          case QRItems.CV:
            navigation?.navigate(ScreenName.CV, {id: qrItem.id});
            break;

          case QRItems.USER:
            navigation?.navigate(ScreenName.PROFILE, {id: qrItem.id});
            break;
        }
      }
    },
    [permission]
  );

  //effects
  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  return (
    <View style={styles.container}>
      {/* camera */}
      <View style={{flex: 1, justifyContent: "center"}}>
        <CameraView
          onBarcodeScanned={handleScan}
          barcodeScannerSettings={{
            barcodeTypes: ['aztec', 'ean13', 'ean8', 'qr', 'pdf417', 'upc_e', 'datamatrix', 'code39', 'code93', 'itf14', 'codabar', 'code128', 'upc_a']
          }}
          ratio="16:9"
          style={[styles.camera]}
          facing={"back"}
        />
        {/* pick up qr image */}

        <Pressable
          style={[styles.button, styles.backButton]}
          onPress={navigation?.goBack}
        >
          <Ionicons name="close" size={45} color={TextColor.sub_primary}/>
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
  },

  backButton: {
    bottom: 20,
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
