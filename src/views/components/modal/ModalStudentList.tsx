import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { BackgroundColor } from "../../../configs/ColorConfig";

type Student = {
  id: number;
  name: string;
};

type StudentCheckboxProps = {
  visible: string | null;
  onRequestClose: () => void;
  studentList: Student[];
};

export default function StudentCheckbox({ studentList, visible, onRequestClose }: StudentCheckboxProps) {
  // State
  const active = true;
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  // Handle
  // Hàm xử lý khi nhấn vào checkbox
  const handleToggleCheckbox = (id: number) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(
        selectedStudents.filter((studentId) => studentId !== id)
      );
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };
  return (
    <Modal visible={visible === "modal_student_list"} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        {/* Show the popup */}
        <View style={styles.container}>
        <View>
            <Text  style={styles.modalTitle}>Danh sách học sinh</Text>
        </View>
            <View>
                <FlatList
                    data={studentList}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                    const isChecked = selectedStudents.includes(item.id);

                    return (
                        <TouchableOpacity
                        onPress={() => handleToggleCheckbox(item.id)}
                        style={[styles.activeCheckbox]}
                        >
                        <MaterialIcons
                            name={isChecked ? "check-box" : "check-box-outline-blank"}
                            size={24}
                            color={isChecked ? "#06b6d4" : "#64748b"}
                        />
                        <Text style={styles.activeText}>{item.name}</Text>
                        </TouchableOpacity>
                    );
                    }}
                    style={styles.listStudent}
                />
            </View>
            <View style={styles.btnContainer}>
            <TouchableOpacity onPress={onRequestClose} style={[styles.btn, styles.btnCancel]}>
                    <Text style={styles.btnCancelText}>Hủy</Text>
                </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnSave]}>
                    <Text style={styles.btnSaveText}>Lưu</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: "70%",
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 20,
    shadowColor: "#000",
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  checkbox: {
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: "center",
    gap: 15,
    marginBottom: 15,
  },

  activeCheckbox: {
    backgroundColor: "#06b6d4" + "11",
    borderRadius: 10,
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: "center",
    gap: 15,
    marginBottom: 12,
  },

  checkboxText: {
    color: "#6b7280",
    fontSize: 14,
  },

  activeText: {
    color: "#374151",
    fontSize: 14,
  },

  listStudent: {
    height: "80%",
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },

  btnContainer: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "flex-end",
    marginTop: 20,
  }, 

  btn: {
    padding: 10,
    borderRadius: 5,
    width: "30%",
  },

  btnCancel: {
    backgroundColor: BackgroundColor.gray_e6,
  },

  btnCancelText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },

  btnSave: {
    backgroundColor: BackgroundColor.primary
  },

  btnSaveText: {
    color: "#fff",
     textAlign: 'center',
     fontWeight: 'bold',
  },

});
