import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "react-native-qrcode-svg";
import SLog, { LogType } from "../../services/SLog";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import QRItemType, { QRItems } from "../../configs/QRConfig";

type QRInfoProps = {
  id: string | number;
  type: QRItems;
};

export default function QRInfo({ id, type }: QRInfoProps) {
  //states
  const [showingQR, setShowing] = useState(false);
  const [qrRef, setQRRef] = useState<any>();
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const data: QRItemType = { id: id, type: type };

  //handlers
  const handleCapturedImage = useCallback(() => {
    qrRef?.toDataURL((data: any) => {
      //   SLog.log(LogType.Info, "Captured image from logo", "base64", data);

      //save the image into media storage
      const uri =
        FileSystem.cacheDirectory +
        (new Date().getTime() + "") +
        "_qr_info" +
        ".png";

      FileSystem.writeAsStringAsync(uri, data, {
        encoding: FileSystem.EncodingType.Base64,
      })
        .then(() => {
          return MediaLibrary.saveToLibraryAsync(uri);
        })
        .then((result) => {
          SLog.log(
            LogType.Info,
            "handleCapturedImage",
            "save image successfully",
            result
          );

          alert("Save QR successfully");
        })
        .catch((error) => {
          SLog.log(
            LogType.Error,
            "handleCapturedImage",
            "save image failed",
            error
          );
        });
    });
  }, [qrRef]);

  //effects
  useEffect(() => {
    if (status === null) {
      requestPermission();
    }
  }, [status]);

  useEffect(() => {
    SLog.log(LogType.Info, "Preparing data", "", JSON.stringify(data));
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.icon} onPress={() => setShowing(true)}>
        <Ionicons name="qr-code" size={20} color={TextColor.sub_primary} />
      </TouchableOpacity>

      <Modal visible={showingQR} transparent={false}>
        <View style={[styles.container, { flex: 1 }]}>
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setShowing(false)}
          >
            <Ionicons name="close" size={20} color={TextColor.sub_primary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.icon, { position: "static" }]}>
            <QRCode
              getRef={(c) => setQRRef(c)}
              value={JSON.stringify(data)}
              logoSize={200}
              quietZone={10}
              size={300}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.icon, { position: "static", marginTop: 10 }]}
            onPress={handleCapturedImage}
          >
            <Ionicons name="camera" size={20} color={TextColor.sub_primary} />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
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
    padding: 10,
    alignSelf: "center",
  },
});
