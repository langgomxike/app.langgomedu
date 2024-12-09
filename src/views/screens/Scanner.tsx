import {useCallback, useContext, useEffect} from "react";
import {
  BarcodeScanningResult, BarcodeType,
  Camera,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import {Alert, Pressable, StyleSheet, TouchableOpacity, useWindowDimensions, View} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import {NavigationContext} from "@react-navigation/native";
import SLog, {LogType} from "../../services/SLog";
import QRItemType, {QRItems} from "../../configs/QRConfig";
import ScreenName from "../../constants/ScreenName";
import {LanguageContext} from "../../configs/LanguageConfig";
import Toast from "react-native-simple-toast";
import {ClassDetailRoute, IdNavigationType} from "../../configs/NavigationRouteTypeConfig";

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
            let data: ClassDetailRoute = {
              classId: +qrItem.id,
            }
            navigation?.navigate(ScreenName.DETAIL_CLASS, data);
            break;

          case QRItems.CV:
            const data2: IdNavigationType = {
              id: qrItem.id,
            }
            navigation?.navigate(ScreenName.CV, data2);
            break;

          case QRItems.USER:
            const data3: IdNavigationType = {
              id: qrItem.id,
            }
            navigation?.navigate(ScreenName.PROFILE, data3);
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

  useEffect(() => {
    if (navigation) {
      navigation.setOptions({
        title: language.QR_INFO,
        headerShown: true,
        contentStyle: {
          padding: 0,
        },
        headerStyle: {
          backgroundColor: BackgroundColor.primary,
        },
        headerTintColor: "#fff",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        )
      });
    }
  }, [navigation]);

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

        <View style={{flexDirection: "row", alignSelf: "center", gap: 40}}>
          <Pressable
            style={[styles.button, styles.backButton]}
            onPress={pickImage}
          >
            <Ionicons name="image" size={45} color={TextColor.sub_primary}/>
          </Pressable>
        </View>
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
