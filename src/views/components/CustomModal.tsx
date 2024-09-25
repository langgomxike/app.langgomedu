import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';

interface CustomModalProps {
  visible: boolean;
  onRequestClose: () => void;
  title?: string;
  children?: React.ReactNode; // Nội dung bên trong modal
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onRequestClose,
  title,
  children,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onRequestClose} // Dùng cho Android để đóng modal
    >
    <TouchableWithoutFeedback onPress={onRequestClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
            {
               title && <Text style={styles.title}>{title}</Text>
            }
          <View style={styles.content}>{children}</View>
        </View>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",

  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    borderWidth: 1,
    borderColor: "#000",
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CustomModal;
