import React, { useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

type ImagePickerProps = {
  visible: string | null;
  onRequestClose: () => void;
  onImagePicker: (imageUri:string) => void
};

// StyleSheet
const BLACK_COLOR = "#000";
const WHITE_COLOR = "#fff";
const IMAGE_SIZE_WIDTH = 27;
const IMAGE_SIZE_HEIGHT = 27;
const BORDER_RADIUS = 10;
const PIXEL_20 = 20;

export default function imagePicker({
  visible,
  onRequestClose,
  onImagePicker
}: ImagePickerProps) {
  const [image, setImage] = useState<string | null>(null);

  const pickerImage = async (mode: string) => {
    // No permissions request is necessary for launching the image library
    let result = null;

    if (mode === "gallery") {
      await ImagePicker.requestMediaLibraryPermissionsAsync;
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });
    } else {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        quality: 1,
      });
    }

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      onImagePicker(result.assets[0].uri);
    }
  };

  return (
    <Modal
      visible={visible === "modal_2"}
      onRequestClose={onRequestClose}
      transparent={true}
      animationType="slide"
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={styles.overlay}>
          {/* Show the popup */}
          <View style={styles.popup}>
            <View style={styles.box}>
              {/* Camera */}
              <TouchableOpacity style={[styles.boxItem, styles.shadowBox]}>
                <Image
                  source={require("../../../assets/images/ic_camera.png")}
                  style={styles.imageIcon}
                />
                <Text>Camera</Text>
              </TouchableOpacity>

              {/* Camera */}
              <TouchableOpacity
                onPress={() => pickerImage("gallery")}
                style={[styles.boxItem, styles.shadowBox]}
              >
                <Image
                  source={require("../../../assets/images/ic_upload_image.png")}
                  style={styles.imageIcon}
                />
                <Text>Upload</Text>
              </TouchableOpacity>

              {/* Camera */}
              <TouchableOpacity style={[styles.boxItem, styles.shadowBox]}>
                <Image
                  source={require("../../../assets/images/ic_image_delete.png")}
                  style={styles.imageIcon}
                />
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
  imageIcon: {
    width: IMAGE_SIZE_WIDTH,
    height: IMAGE_SIZE_HEIGHT,
    marginBottom: 10,
  },
  shadowBox: {
    shadowColor: BLACK_COLOR,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    elevation: 5,
  },
  boxItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BORDER_RADIUS,
    backgroundColor: WHITE_COLOR,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  box: {
    flex: 1,
    flexDirection: "row",
    gap: PIXEL_20,
  },

  popup: {
    width: "90%",
    height: "20%",
    backgroundColor: WHITE_COLOR,
    borderRadius: BORDER_RADIUS,
    padding: PIXEL_20,
  },
});
