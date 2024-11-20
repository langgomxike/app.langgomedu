import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  Image,
} from "react-native";
import HLine, { HLineType } from "../HLine";
import { Children, ReactNode, useState } from "react";
import {
  BackgroundColor,
  BorderColor,
  TextColor,
} from "../../../configs/ColorConfig";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Education from "../../../models/Education";
import Experience from "../../../models/Experience";
import Certificate from "../../../models/Certificate";
import Modal from "react-native-modal";
import Ionicons from "@expo/vector-icons/Ionicons";
import Input from "../Inputs/CVInput";
import * as ImagePicker from "expo-image-picker";

export type CvBoxProps = {
  title: string;
  children?: ReactNode;
  onAddItem?: (item: Education | Experience | Certificate) => void;
  typeItem: "education" | "experience" | "skills" | "certificate";
};

const CvBoxEdit = ({ title, children, onAddItem }: CvBoxProps) => {
  //state
  const [modalVisible, setModalVisible] = useState<string | null>("");
  const [textValue, setTextValue] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<any>(null);

  //handler
  const handleClickAddItem = () => {
    // onAddItem();
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
}

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>{title}</Text>
        <HLine type={HLineType.LIGHT} />
        <View style={styles.children}>{children}</View>
      </View>
      <View style={styles.addButtonBox}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible("modalInputCV");
          }}
          style={styles.addButton}
        >
          <FontAwesome6 name="add" size={24} color={TextColor.white} />
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={modalVisible === "modalInputCV"}
        animationIn={"slideInUp"}
        animationOut={"slideOutDown"}
        onBackdropPress={() => setModalVisible(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.headerTitle}>Nhập thông tin</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(null)}
              style={styles.btnClose}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Input
              label="Tên"
              onTextChange={setTextValue}
              placeholder={"Tên"}
              value={textValue}
              require={true}
              editable={true}
            />

            <Input
              label="Ghi chú"
              onTextChange={setTextValue}
              placeholder={"Ghi chú..."}
              value={textValue}
              require={true}
              editable={true}
            />

          <View>
            <Text>Tải mình chứng</Text>

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

          </View>
          <View style={[styles.btnContainer]}>
            <TouchableOpacity
              onPress={() => setModalVisible(null)}
              style={[styles.btn, styles.btnSave, styles.boxShadow]}
            >
              <Text style={styles.btnSaveText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default CvBoxEdit;

const styles = StyleSheet.create({
  container: {},
  box: {
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: BackgroundColor.white,
    borderColor: BackgroundColor.gray_e6,
    elevation: 2,
    paddingBottom: 20,
  },
  title: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  children: {
    marginTop: 10,
    marginHorizontal: 10,
  },
  addButtonBox: {
    height: 20,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BackgroundColor.primary,
    position: "absolute",
    right: "0%",
    bottom: "75%",
  },

  // Modal
  modalContainer: {
    height: "70%",
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 20,
    shadowColor: "#000",
    overflow: "hidden",
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

  selectedImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    borderRadius: 10,
    marginTop: 10,
  },

  modalBody: { flex: 1 },

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

//upload file
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

  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  btn: {
    padding: 15,
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
});
