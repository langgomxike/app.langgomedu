import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Modal from "react-native-modal";
import { BackgroundColor } from "../../../configs/ColorConfig";
import { Image } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";

type ModalDialogForClassProps = {
  confirmTitle: string;
  confirmContent: string;
  imageStatus: "success" | 'failure' | 'confirm';
  visiable: string | null;
  onRequestCloseDialog: () => void;
  loading?: boolean;
};

const { height: SCREEN_HEIGHT} = Dimensions.get("window");
export default function ModalPay({
  confirmTitle,
  confirmContent,
  imageStatus,
  visiable,
  onRequestCloseDialog,
  loading = false,
}: ModalDialogForClassProps) {
    
    // states
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank">("cash");
    const [selectedImage, setSelectedImage] = useState<any>(null);

     // Shared value for height
     const modalHeight = useSharedValue(0.6);

  // Animated style for modal height
   const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(modalHeight.value * SCREEN_HEIGHT, { duration: 300})
   }))

  // Handle payment method change
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method as "bank" | "cash");

    // Update modal height
    modalHeight.value = method === "bank" ? 0.9 : 0.6;
    console.log(">>Height ", (modalHeight.value * SCREEN_HEIGHT))
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
      console.log("Image selected:", pickerResult.assets[0]);
      // Handle the selected image URI, e.g., save or display it
    }
  };

  return (
    <Modal
      isVisible={visiable === "modalPay"}
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      onBackdropPress={() => onRequestCloseDialog()}
    >
      {loading ? (
        <View style={styles.containerLoading} >
          <ActivityIndicator size={50} />
          <Text style={styles.loadingText}>Đang xử lý...</Text>
        </View>
      ) : (
        <Animated.View style={[styles.container, animatedStyle]}>
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
            <View style={styles.paymentContainer}>
                <Text style={styles.titleContainer}>
                  Chọn phương thức thanh toán
                </Text>

                {/* Phương thức Tiền mặt */}
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handlePaymentMethodChange("cash")}
                >
                  <Ionicons
                    name="cash-outline"
                    size={24}
                    color={paymentMethod === "cash" ? "green" : "gray"}
                  />
                  <Text style={styles.optionText}>Thanh toán tiền mặt</Text>
                  {paymentMethod === "cash" && (
                    <Ionicons name="checkmark" size={24} color="green" />
                  )}
                </TouchableOpacity>

                {/* Phương thức Chuyển khoản */}
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handlePaymentMethodChange("bank")}
                >
                  <Ionicons
                    name="card-outline"
                    size={24}
                    color={paymentMethod === "bank" ? "green" : "gray"}
                  />
                  <Text style={styles.optionText}>Chuyển khoản</Text>
                  {paymentMethod === "bank" && (
                    <Ionicons name="checkmark" size={24} color="green" />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.line}></View>

              {paymentMethod === "bank" && (
                <View>
                  {/* Pay infomation */}
                  <View style={styles.payInfoContainer}>
                    <Text style={styles.titleContainer}>
                      Thông tin chuyển khoản
                    </Text>
                    <View style={styles.payInfoContent}>
                      <View style={styles.hintTitleContainer}>
                        <Text style={styles.hintTitle}>
                          Nhấn giữ hình để lưu
                        </Text>
                        <Octicons
                          name="download"
                          size={18}
                          color={BackgroundColor.gray_c6}
                        />
                      </View>

                      <TouchableOpacity
                        // onLongPress={downloadImage}
                        style={[styles.boxShadow, styles.imageQrContainer]}
                      >
                        <Image
                          source={{
                            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/800px-QR_code_for_mobile_English_Wikipedia.png",
                          }}
                          style={[styles.imageQr, styles.boxShadow]}
                        />
                      </TouchableOpacity>
                      <View style={styles.logoOfBankContainer}>
                        <Image
                          source={{ uri: "https://api.vietqr.io/img/MB.png" }}
                          style={styles.logoOfBank}
                          resizeMode="contain"
                        />
                      </View>
                      <Text style={styles.bankingNumber}>
                        1111
                      </Text>
                      <Text style={styles.bankingName}>
                        hhhhh
                      </Text>
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
                      <Text style={styles.buttonText}>Chọn hình</Text>
                    </TouchableOpacity>

                    <View style={styles.textContainer}>
                      <Text style={styles.uploadText}>
                        Tải ảnh minh chứng thanh toán
                      </Text>
                      <Text style={styles.subText}>
                        Vui lòng tải lên ảnh chụp màn hình hoặc hóa đơn để xác
                        nhận thanh toán.
                      </Text>
                    </View>

                    {/* Display the selected image if available */}
                    {selectedImage && (
                      <Image
                        source={{ uri: selectedImage.uri }}
                        style={styles.selectedImage}
                      />
                    )}
                  </View>
                </View>
              )}
          </View>
        
        </View>
        </ScrollView>

        <View style={[styles.btnContainer]}>
              <TouchableOpacity
                onPress={onRequestCloseDialog}
                style={[styles.btn, styles.btnSave, styles.boxShadow]}
              >
                <Text style={styles.btnSaveText}>Thanh toán</Text>
              </TouchableOpacity>
            </View>
      </Animated.View>
      ) 
      }
      
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 20,
    shadowColor: "#000",
    overflow: "hidden",
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

  modalBody: { flex: 1 },

  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  contentContainer: {
    marginBottom: 20,
  },


  btn: {
    padding: 10,
    borderRadius: 10,
  },

  btnSave: {
    flex: 1,
    backgroundColor: BackgroundColor.primary,
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
    marginTop: 10,
    backgroundColor: BackgroundColor.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  hintTitleContainer: {
    flexDirection: "row",
    gap: 10,
  },

  hintTitle: {
    color: BackgroundColor.gray_c6,
    marginBottom: 10,
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

  bankingNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },

  bankingName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    paddingBottom: 10,
  },

  imageQrContainer: {
    backgroundColor: BackgroundColor.white,
    borderRadius: 10,
    padding: 5,
  },

  imageQr: {
    width: 170,
    height: 170,
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
    backgroundColor: BackgroundColor.gray_e6
  }

});
