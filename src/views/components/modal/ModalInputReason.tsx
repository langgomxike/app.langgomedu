import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Modal from "react-native-modal";
import { BackgroundColor } from "../../../configs/ColorConfig";
import { Image } from "react-native";
import CustomInput from "../Inputs/CustomInput";

type ModalInputReasonProps = {
  confirmTitle: string;
  confirmContent: string;
  imageStatus: "success" | "failure" | "confirm";
  visiable: string | null;
  onRequestCloseDialog: () => void;
  loading?: boolean;
};

const images = [
  {
    name: "success",
    source: require("../../../../assets/images/ic_success.png"),
  },
  {
    name: "failure",
    source: require("../../../../assets/images/ic_failure.png"),
  },
  {
    name: "confirm",
    source: require("../../../../assets/images/ic_info.png"),
  },
];

export default function ModalInputReason({
  confirmTitle,
  confirmContent,
  imageStatus,
  visiable,
  onRequestCloseDialog,
  loading = false,
}: ModalInputReasonProps) {
  const getImageSource = (iconName: string) => {
    const image = images.find((img) => img.name === iconName);
    return image ? image.source : null;
  };

  const source = getImageSource(imageStatus);

  const [reason, setReason] = useState("");

  return (
    <Modal
      isVisible={visiable === "modalInputReason"}
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      onBackdropPress={() => onRequestCloseDialog()}
    >
      {loading ? (
        <View style={styles.containerLoading}>
          <ActivityIndicator size={50} />
          <Text style={styles.loadingText}>Đang xử lý...</Text>
        </View>
      ) : (
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : 'height'} // Thử dùng 'position' trên iOS
        style={{ flex: 1, justifyContent: 'center' }}
      >
        <View style={styles.container}>
          <View style={styles.modalHeader}>
            <Text style={styles.headerTitle}>{confirmTitle}</Text>
            <TouchableOpacity
              onPress={onRequestCloseDialog}
              style={styles.btnClose}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={styles.contentContainer}
              >
                <View style={{ alignItems: "center" }}>
                  <View
                    style={[styles.questionImageContainer, styles.boxShadow]}
                  >
                    <Image source={source} style={[styles.questionImage]} />
                  </View>
                </View>

                <View style={{ padding: 10 }}>
                  <CustomInput
                    label="Lý do"
                    placeholder="Nhập lý do..."
                    value={reason}
                    type="textarea"
                    onChangeText={setReason}
                    required={true}
                  />

                </View>
              </ScrollView>

              <View style={[styles.btnContainer]}>
                <TouchableOpacity
                  onPress={onRequestCloseDialog}
                  style={[styles.btn, styles.btnSave, styles.boxShadow]}
                >
                  <Text style={styles.btnSaveText}>Ok</Text>
                </TouchableOpacity>
              </View>
          </View>
        </View>
            </KeyboardAvoidingView>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "80%",
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
    flex: 1,
    marginBottom: 20,
  },

  questionImageContainer: {
    backgroundColor: BackgroundColor.white,
    marginBottom: 20,
    borderRadius: 999,
    padding: 5,
  },

  questionImage: {
    width: 45,
    height: 45,
  },

  btn: {
    padding: 13,
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

  btnDeny: {
    flex: 1,
    borderColor: BackgroundColor.danger,
    borderWidth: 1,
    backgroundColor: BackgroundColor.white,
  },

  btnDenyText: {
    color: BackgroundColor.danger,
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
});
