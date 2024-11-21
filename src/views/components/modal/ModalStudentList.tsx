import React, { useCallback, useEffect, useState } from "react";
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
import User from "../../../models/User";
import LearnerAtendance from "../../../models/LearnerAtendance";
import AAttendance from "../../../apis/AAttendance";
import ModalDialogForClass from "./ModalDialogForClass";

type StudentCheckboxProps = {
  visible: string | null;
  onRequestClose: () => void;
  lessonId: number;
  learners: User[];
  onAttendanceResult: (data: boolean) => void;
};

export default function StudentCheckbox({
  lessonId,
  learners,
  visible,
  onRequestClose,
  onAttendanceResult
}: StudentCheckboxProps) {
  // States
  const [modalVisible, setModalVisible] = React.useState<string | null>("");
  const [studentList, setStudentList] = useState<LearnerAtendance[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle
  // Hàm xử lý khi nhấn vào checkbox
  const handleToggleCheckbox = (id: string) => {
    setStudentList((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, attended: !student.attended} : student
      )
    );
  };

  const handleAttendanceStudent = useCallback(() => {
    AAttendance.requestAttendance(studentList,
      (data) => {
        if(data.result) {
          setModalVisible("modalDialogForClass");
          onRequestClose();
          onAttendanceResult(data.result);
        }
      },
    setLoading
    )
  }, [studentList]);

  useEffect(() => {
    // Tạo danh sách học sinh từ learners, bao gồm cả người học nếu họ không có con
    const generatedStudentList: LearnerAtendance[] = [];

    for (const learner of learners) {
      if (learner.students) {
        // Người học có con, lấy từng con trong danh sách và gán thêm thông tin của người học
        for (const student of learner.students) {
          generatedStudentList.push({
            id: student.id.toString(),
            full_name: student.full_name,
            parent_id: learner.id,
            attended: false,
            confirm_attendance: false,
            lesson_id: lessonId,
          });
        }
      } else {
       // Người học không có con, thêm chính họ vào danh sách mà không có thông tin parent
        generatedStudentList.push({
          id: learner.id,
          full_name: learner.full_name,
          parent_id: null,
          attended: false,
          confirm_attendance: false,
          lesson_id: lessonId,
        });
      }
    }

    // Update state with the generated student list
    setStudentList(generatedStudentList);
  }, [learners]);

  return (
    // Modal hiển thị danh sách học sinh để điểm danh
    <View>
      <Modal
        visible={visible === "modal_student_list"}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.overlay}>
          {/* Show the popup */}
          <View style={styles.container}>
            <View>
              <Text style={styles.modalTitle}>Danh sách học sinh</Text>
            </View>
            <View>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={studentList}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item }) => {
                  // const isChecked = selectedStudents.some((s) => s.id === item.id);
                  const isChecked = studentList.some((s) => s.id === item.id && s.attended == true);
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
                      <Text style={styles.activeText}>{item.full_name}</Text>
                    </TouchableOpacity>
                  );
                }}
                style={styles.listStudent}
              />
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                onPress={onRequestClose}
                style={[styles.btn, styles.btnCancel]}
              >
                <Text style={styles.btnCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAttendanceStudent}
                style={[styles.btn, styles.btnSave]}
              >
                <Text style={styles.btnSaveText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
  
      <ModalDialogForClass
        confirmTitle="Điểm danh"
        confirmContent="Điểm danh thành công"
        imageStatus="success"
        visiable={modalVisible}
        onRequestCloseDialog={() => setModalVisible(null)}
        loading={loading}
        />
    </View>
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
    textAlign: "center",
    fontWeight: "bold",
  },

  btnSave: {
    backgroundColor: BackgroundColor.primary,
  },

  btnSaveText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
