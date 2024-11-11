import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { ReactElement, useState } from "react";
import Button from "../components/Button";
import { BackgroundColor, TextColor } from "../../configs/ColorConfig";
import MyIcon, { AppIcon } from "../components/MyIcon";

type propsModal = {
  children: React.ReactNode;
  subAction: React.ReactNode;
  onClose: () => void;
  visible: boolean;
};

const ModalLayout = ({ children, subAction, onClose, visible }: propsModal) => {


  return (
    <View style={styles.container}>
      {/* Trigger Button to Show Modal */}
      
      {/* Modal Definition */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton}>
              <MyIcon
                icon={AppIcon.ic_exit}
                onPress={onClose}
              />
            </TouchableOpacity>

            <View>{children}</View>

            {/* Close Modal Button */}
            <TouchableOpacity style={styles.button}>
              {/* Kiểm tra nếu subAction là một ReactElement */}
              {
                React.isValidElement(subAction)
                  ? React.cloneElement(subAction as ReactElement, {
                      onPress: onClose,
                    })
                  : subAction /* Nếu không, render nó trực tiếp */
              }
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
