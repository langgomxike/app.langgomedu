import React, {useCallback, useContext, useEffect, useState} from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Modal from "react-native-modal";
import {BackgroundColor} from "../../../configs/ColorConfig";
import {Image} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import {LanguageContext} from "../../../configs/LanguageConfig";

type ModalDialogForClassProps = {
  confirmTitle: string;
  visiable: string | null;
  onRequestCloseDialog: () => void;
  onSelectedImage: (image: any) => void;
  onPay: () => void;
};

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get("window");
export default function ModalPayClassFee({
  confirmTitle,
  visiable,
  onRequestCloseDialog,
  onSelectedImage,
  onPay,
}: ModalDialogForClassProps) {
  // context
  const language = useContext(LanguageContext).language;

  // states -------------------------------------------------------------------
  const image = `https://img.vietqr.io/image/MB-012345-compact2.jpg?amount=9999&addInfo=${"Tiền học của lớp"}&accountName=Langgomedu`;

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [loadingSaveImage, setLoadingSaveImage] = useState(false);

  // handle ----------------------------------------------------------------
  const handleSaveImage = async () => {
    try {
      // Kiểm tra và yêu cầu quyền truy cập vào thư viện
      setLoadingSaveImage(true);
      const {status} = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          language.ACCESS_DENIED,
          language.APP_NEEDS_PERMISSION
        );
        return;
      }

      // Đặt tên cho file tải về trong hệ thống tệp của ứng dụng
      const fileUri = FileSystem.documentDirectory + "qrBanking.jpg";

      // Tải ảnh về thư mục nội bộ
      const {uri} = await FileSystem.downloadAsync(image, fileUri);

      //Lưu ảnh vào thư viện của thiết bị
      await MediaLibrary.saveToLibraryAsync(uri);

      setLoadingSaveImage(false);
      Alert.alert(language.UPLOAD_SUCCESS, language.IMAGE_SAVED);
    } catch (error) {
      Alert.alert(language.ERROR_A, language.UPLOAD_FAILED);
      console.error(error);
    }
  };

  const selectImage = async () => {
    // Request permission to access photos
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

    // Open the image picker
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setSelectedImage(pickerResult.assets[0]);
      onSelectedImage(pickerResult.assets[0]);
    }
  };

  return (
    <Modal
      isVisible={visiable === "modalPayClassFee"}
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      onBackdropPress={() => onRequestCloseDialog()}
    >
      <View style={[styles.container]}>
        <View style={styles.modalHeader}>
          <Text style={styles.headerTitle}>{confirmTitle}</Text>
          <TouchableOpacity
            onPress={onRequestCloseDialog}
            style={styles.btnClose}
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.modalBody}>
            <View style={styles.contentContainer}>
              {/* Uploading payment */}
              <View>
                {/* Pay infomation */}
                <View style={styles.payInfoContainer}>
                  <Text style={styles.titleContainer}>
                    {language.TRANSFER_INFORMATION}
                  </Text>
                  <View style={styles.payInfoContent}>
                    <View style={[styles.boxShadow, styles.imageQrContainer]}>
                      <Image
                        source={{uri: image}}
                        style={[styles.imageQr, styles.boxShadow]}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={handleSaveImage}
                      style={[styles.boxShadow, styles.btnSaveQR]}
                    >
                      <Text style={styles.btnSaveQRText}>{language.SAVE_QR_A}</Text>
                      {loadingSaveImage && (
                        <ActivityIndicator></ActivityIndicator>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.line}></View>
                {/* Uploading payment */}
                <View style={styles.uploadPaymentContainer}>
                  <TouchableOpacity
                    onPress={selectImage}
                    style={[styles.uploadImageButton, styles.boxShadow]}
                  >
                    <Ionicons name="image-outline" size={24} color="black" />
                    <Text style={styles.buttonText}>{language.SELECT_IMAGE}</Text>
                  </TouchableOpacity>

                  <View style={styles.textContainer}>
                    <Text style={styles.uploadText}>
                      {language.UPLOAD_PAYMENT_PROOF}
                      <Text style={{color: "#ff0000"}}>*</Text>
                    </Text>
                    <Text style={styles.subText}>
                      {language.UPLOAD_PAYMENT_INSTRUCTION}
                    </Text>
                  </View>

                  {/* Display the selected image if available */}
                  {selectedImage && (
                    <Image
                      source={{uri: selectedImage.uri}}
                      style={styles.selectedImage}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.btnContainer]}>
          <TouchableOpacity
            disabled={selectedImage ? false : true}
            onPress={onPay}
            style={[
              styles.btn,
              selectedImage ? styles.btnSave : styles.btnSaveDisable,
              styles.boxShadow,
            ]}
          >
            <Text style={styles.btnSaveText}>{language.PAYMENT}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 20,
    shadowColor: "#000",
    overflow: "hidden",
    height: SCREEN_HEIGHT * 0.9,
  },

  containerLoading: {
    height: "40%",
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 20,
    shadowColor: "#000",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 20,
  },

  modalHeader: {
    marginBottom: 20,
    borderBlockColor: BackgroundColor.gray_e6,
    borderBottomWidth: 1,
    paddingBottom: 10,
    justifyContent: "center",
    position: "relative",
  },

  headerTitle: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },

  btnClose: {
    position: "absolute",
    right: 0,
    top: 0,
  },

  subTitle: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 30,
  },

  modalBody: {flex: 1},

  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  contentContainer: {
    marginBottom: 20,
  },

  btn: {
    padding: 13,
    borderRadius: 10,
  },

  btnSave: {
    flex: 1,
    backgroundColor: BackgroundColor.primary,
  },

  btnSaveDisable: {
    flex: 1,
    backgroundColor: BackgroundColor.gray_30,
  },

  btnSaveText: {
    color: BackgroundColor.white,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },

  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },

  titleContainer: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 10,
  },

  //   Pay qr
  payInfoContainer: {
    backgroundColor: BackgroundColor.white,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  payInfoContent: {
    alignItems: "center",
    marginTop: 10,
  },

  logoOfBankContainer: {
    height: 50,
    width: "100%",
    marginTop: 10,
  },

  logoOfBank: {
    width: "100%",
    height: "100%",
  },

  imageQrContainer: {
    backgroundColor: BackgroundColor.white,
    borderRadius: 10,
    padding: 5,
  },

  imageQr: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.9,
    resizeMode: "contain",
  },

  btnSaveQR: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: BackgroundColor.primary,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 15,
  },

  btnSaveQRText: {
    color: BackgroundColor.white,
    fontWeight: "bold",
    fontSize: 13,
    alignItems: "center",
  },

  // upload payment
  uploadPaymentContainer: {
    alignItems: "center",
    backgroundColor: BackgroundColor.white,
    marginTop: 10,
    paddingVertical: 20,
  },
  uploadImageButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  textContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 10, // Để văn bản không tràn khi có nhiều nội dung
  },

  paymentContainer: {
    backgroundColor: BackgroundColor.white,
    marginTop: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  selectedImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    borderRadius: 10,
    marginTop: 10,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },

  line: {
    height: 2,
    backgroundColor: BackgroundColor.gray_e6,
  },
});
