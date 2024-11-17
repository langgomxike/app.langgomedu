import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Modal from "react-native-modal";
import { BackgroundColor } from "../../../configs/ColorConfig";
import Student from "../../../models/Student";
import ModalConfirmJoinClass from "./ModalConfirmJoinClass";
import { UserContext } from "../../../configs/UserContext";

type ModalJoinClassProps = {
  classId: number;
  studentList: Student[];
  visiable: string | null;
  onRequestClose: () => void;
  onResultValue: (result: boolean) => void;
};

export default function ModalJoinClass({
  classId,
  studentList,
  visiable,
  onRequestClose,
  onResultValue,
}: ModalJoinClassProps) {
  // states
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [isConfirmingJoin, setIsConfirmingJoin] = useState<string | null>("");

  // Handle
  // Hàm xử lý khi nhấn vào checkbox
  const handleToggleCheckbox = (student: Student) => {
    if (selectedStudents.some((s) => s.id === student.id)) {
      // Nếu học sinh đã được chọn, loại bỏ khỏi danh sách
      setSelectedStudents(selectedStudents.filter((s) => s.id !== student.id));
    } else {
      // Nếu học sinh chưa được chọn, thêm vào danh sách
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const handleConfirmJoinClass = () => {
    setIsConfirmingJoin("modalConfirmJoinClass"); // mở modalConfirmJoinClass
    onRequestClose(); // đóng modalJoinClass
  };

  return (
    <View>
      {/* Modal chọn học sinh */}
      <Modal
        isVisible={visiable === "modalJoinClass"}
        animationIn={"slideInUp"}
        animationOut={"slideOutDown"}
        onBackdropPress={() => onRequestClose()}
      >
        <View style={styles.container}>
          <View style={styles.modalHeader}>
            <Text style={styles.headerTitle}>Tham gia lớp học</Text>
          </View>

          <View style={styles.modalBody}>
            <View style={{ flex: 7 }}>
              <View style={styles.studentListTitleContainer}>
                <Ionicons name="people-outline" size={24} color="black" />
                <Text style={styles.studentListTitle}>Danh sách học sinh</Text>
              </View>
              <View style={styles.studentList}>
                <FlatList
                  data={studentList}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item: student }) => {
                    const isChecked = selectedStudents.some(
                      (s) => s.id === student.id
                    );

                    return (
                      <View>
                        <TouchableOpacity
                          onPress={() => handleToggleCheckbox(student)}
                          style={[
                            isChecked ? styles.activeCheckbox : styles.checkbox,
                            styles.boxShadow,
                          ]}
                        >
                          <View style={styles.studentSelect}>
                            <View style={styles.studentContainer}>
                              <Image
                                source={{
                                  uri: `https://cdn-icons-png.flaticon.com/128/4322/4322991.png`,
                                }}
                                style={styles.avtarImage}
                              />
                              <Text style={styles.activeText}>
                                {student.full_name}
                              </Text>
                            </View>
                            <MaterialIcons
                              name={
                                isChecked
                                  ? "check-box"
                                  : "check-box-outline-blank"
                              }
                              size={20}
                              color={isChecked ? "#06b6d4" : "#64748b"}
                            />
                          </View>
                          <View style={styles.notificationContent}>
                            {/* <Ionicons name="warning-outline" size={24} color={BackgroundColor.warning} />
                            <Text style={styles.notificationText}>
                              {`Bạn này không thể tham gia lớp học.\n Do đã có buổi học bị trùng!`}
                            </Text> */}
                            <Ionicons name="checkmark" size={24} color="green" />
                            <Text style={styles.notificationText}>
                              Bạn này có thể tham gia lớp học
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                  style={styles.listStudent}
                  contentContainerStyle={{
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                  }}
                />
              </View>
            </View>

            <View style={[styles.btnContainer, { flex: 1 }]}>
              <TouchableOpacity style={[styles.addStudent, styles.boxShadow]}>
                <Ionicons
                  name="add-outline"
                  size={20}
                  color={BackgroundColor.white}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleConfirmJoinClass()}
                style={[styles.btn, styles.btnSave, styles.boxShadow]}
              >
                <Text style={styles.btnSaveText}>Tham gia</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal xác nhận các học sinh đã tham gia vào lớp học đó */}
      <ModalConfirmJoinClass
        confirmContent="Bạn có chắc chắn muốn tham gia lớp học với các học sinh đã chọn không?"
        visiable={isConfirmingJoin}
        onRequestClose={() => setIsConfirmingJoin(null)}
        selectedStudents={selectedStudents}
        classId={classId}
        onResultValue={onResultValue}
      />
    </View>
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

  containerConfirm: {
    height: "40%",
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
  },

  headerTitle: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },

  modalBody: { flex: 1 },

  studentListTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },

  studentListTitle: {
    fontWeight: "bold",
    fontSize: 15,
  },

  studentList: { marginBottom: 20 },

  checkbox: {
    backgroundColor: BackgroundColor.white,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 15,
    marginBottom: 15,
  },

  activeCheckbox: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
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
    height: "76%",
  },

  studentSelect: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },

  studentContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  avtarImage: {
    width: 40,
    height: 40,
    borderRadius: 999,
  },

  borderWarming: {
    borderWidth: 1,
    borderColor: BackgroundColor.warning,
  },

  notificationContent: {
    alignItems: "center",
  },
  notificationText : {
    marginTop: 5,
    color: BackgroundColor.gray_text,
    textAlign: "center",
  },


  addStudentContainer: {
    alignItems: "center",
  },
  

  addStudent: {
    backgroundColor: BackgroundColor.primary,
    borderRadius: 10,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  addStudentText: {
    width: "100%",
    textAlign: "center",
    color: BackgroundColor.white,
    fontWeight: "bold",
  },

  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 10,
    gap: 10,
  },

  btn: {
    padding: 15,
    backgroundColor: BackgroundColor.primary,
    borderRadius: 10,
  },

  btnSave: {
    flex: 1,
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
});
