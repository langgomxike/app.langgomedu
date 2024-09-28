import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Button from "../components/Button";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import MyIcon, { AppIcon } from "../components/MyIcon";

type propsModal = {
  children: React.ReactNode;
};

const ModalLayout = ({ children }: propsModal) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOk = () => {
    alert("OK!");
    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      {/* Trigger Button to Show Modal */}
      <Button
        title="Show Modal"
        onPress={() => setModalVisible(true)}
        backgroundColor={BackgroundColor.primary}
        textColor={TextColor.white}
      />

      {/* Modal Definition */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton}>
              <MyIcon
                icon={AppIcon.ic_exit}
                onPress={() => setModalVisible(false)}
              />
            </TouchableOpacity>

            <View>{children}</View>

            {/* Close Modal Button */}
            <TouchableOpacity style={styles.button}>
              <Button
                title="CLose"
                backgroundColor={BackgroundColor.primary}
                textColor={TextColor.white}
                onPress={handleOk}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
  },
  button: {
    // padding: 10,
    // margin: 15,
    borderRadius: 20,
    alignItems: "center",
    width: 100,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ModalLayout;
