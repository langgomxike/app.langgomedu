import React, {useContext, useState} from "react";
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {LanguageContext} from "../../../configs/LanguageConfig";
import ImageViewer from "react-native-image-zoom-viewer";
import { BackgroundColor } from "../../../configs/ColorConfig";

type ModalPaidClassFeeResultProps = {
  visiable: string | null;
  onRequestClose: () => void;
  image_uri: string;
  onHandleConfirm: () => void;
  onHandleDeny: () => void;
};

export default function ModalPaidClassFeeResult({
  visiable,
  onRequestClose,
  image_uri,
  onHandleConfirm,
  onHandleDeny
}: ModalPaidClassFeeResultProps) {
  const language = useContext(LanguageContext).language;
  const [isVisible, setIsVisible] = useState(false);
  const images = [
    {
      url: image_uri,
    },
  ];
  return (
    <Modal
      visible={visiable === "modalPaidClassFeeResult"}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
        <View style={styles.modalHeader}>
          <Text style={styles.headerTitle}>{language.TRANSFER_IMAGE}</Text>
          <TouchableOpacity
            onPress={onRequestClose}
            style={styles.btnClose}
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>

          <View style={styles.modalBody}>
            <ScrollView>
              <TouchableOpacity onPress={() => setIsVisible(true)}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{uri: image_uri}}
                    style={styles.imageContent}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </ScrollView>
            <View style={styles.btnCotainer}>
              <TouchableOpacity style={[styles.btn, styles.btnDeny]} onPress={onHandleDeny}>
                <Text style={styles.btnDenyText}>{language.DENNY}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnAccept]}
                onPress={onHandleConfirm}
              >
                <Text style={styles.btnAcceptText}>{language.CONFIRM}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Modal for Zoomable Image */}
        <Modal
          visible={isVisible}
          transparent={true}
          onRequestClose={() => setIsVisible(false)}
        >
          <ImageViewer
            imageUrls={images}
            onSwipeDown={() => setIsVisible(false)}
            enableSwipeDown={true}
          />
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: "80%",
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 20,
    shadowColor: "#000",
    overflow: "hidden",
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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

  modalHeader: {
    marginBottom: 20,
    borderBlockColor: BackgroundColor.gray_e6,
    borderBottomWidth: 1,
    paddingBottom: 10,
    justifyContent: "center",
    position: "relative",
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },

  modalBody: {
    flex: 1,
  },

  imageContainer: {
    justifyContent: "center",
    marginTop: 20,
  },

  imageContent: {
    width: "100%",
    height: 500,
  },

  btnCotainer: {
    flexDirection: "row",
    gap: 20,
    paddingHorizontal: 15,
    paddingTop: 15,
  },

  btn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    borderRadius: 8,
  },

  btnDeny: {
    borderWidth: 1,
    borderColor: "#ff0000",
  },

  btnDenyText: {
    color: "#ff0000",
  },

  btnAccept: {
    backgroundColor: BackgroundColor.primary,
  },

  btnAcceptDisable: {
    backgroundColor: BackgroundColor.gray_50,
  },

  btnAcceptText: {
    color: BackgroundColor.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
