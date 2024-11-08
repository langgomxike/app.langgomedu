import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Modal from "react-native-modal";
import { BackgroundColor } from "../../../configs/ColorConfig";
import { Image } from "react-native";
import Student from "../../../models/Student";
import AClass from "../../../apis/AClass";
import { UserContext, UserType } from "../../../configs/UserContext";
import ModalDialogForClass from "./ModalDialogForClass";

type ModalJoinClassProps = {
  confirmContent: string;
  visiable: string | null;
  onRequestClose: () => void;
  selectedStudents?: Student[];
  classId: number;
};

type ModalDialog = { 
  confirmContent: string;
  confirmStatus: "success" | 'failure';
}

export default function ModalConfirmJoinClass({
  confirmContent,
  visiable,
  onRequestClose,
  selectedStudents,
  classId,
}: ModalJoinClassProps) {
  //context 
  const {user} = useContext(UserContext);

  // states 
  const [isConfirming, setIsConfirming] = useState<string | null>("");
  const [loading, setLoading] = useState(false);
  const [modalDialog, setModalDialog] = useState<ModalDialog>({
    confirmContent: "",
    confirmStatus: "failure"
  });
  const [studentIds, setStudentIds] = useState<number[]>([]);
  
  // Handles
  const handleJoinClass = useCallback(() => {
    AClass.joinClass(
      classId, 
      user.ID, 
      studentIds,
      (data) => {
        setIsConfirming("modalDialogForClass"); // mở modalDialogForClass
        onRequestClose();
        if(data.status_code === 200){
          setModalDialog({
            confirmContent: "Tham gia lớp thành công",
            confirmStatus: "success"
          });
        }
        else {
          setModalDialog({
            confirmContent: "Không thể tham gia lớp. Vui lòng thử lại.",
            confirmStatus: "failure"
          });
        }
      },
      setLoading
     )

  }, [studentIds, classId,]);

  const handleAcceptClassToTeach = useCallback(() => {
    AClass.acceptClassToTeach(
      classId, 
      user.ID,
      (data) => {
        setIsConfirming("modalDialogForClass"); // mở modalDialogForClass
        onRequestClose();
        if(data.status_code === 200){
          setModalDialog({
            confirmContent: "Nhận lớp thành công. Vui lòng chờ duyệt!",
            confirmStatus: "success"
          });
        }
        else {
          setModalDialog({
            confirmContent: "Không thể nhận lớp. Vui lòng thử lại.",
            confirmStatus: "failure"
          });
        }
      },
      setLoading
     )
  }, [classId])

  // effects 
  useEffect(() => {
      if (selectedStudents) {
        setStudentIds(selectedStudents.map((student) => student.id))
      } else {
        setStudentIds([]);
      }
  }, [selectedStudents]);


  return (
    <View>
      {/* Modal xác nhận tham gia lớp học */}
      <Modal
        isVisible={visiable === "modalConfirmJoinClass"}
        animationIn={"slideInUp"}
        animationOut={"slideOutDown"}
        onBackdropPress={() => onRequestClose()}
      >
        <View
          style={[
            styles.container,
            {
              height:
                selectedStudents && selectedStudents.length > 0 ? "60%" : "40%",
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.headerTitle}>Xác nhận tham gia</Text>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.contentContainer}>
              <View style={[styles.questionImageContainer, styles.boxShadow]}>
                <Image
                  source={require("../../../../assets/images/ic_question.png")}
                  style={[styles.questionImage]}
                />
              </View>
              <Text style={styles.subTitle}>{confirmContent}</Text>
              {selectedStudents && (
                <View style={styles.selectedContainer}>
                  <FlatList
                    data={selectedStudents}
                    renderItem={({ item: selectedStudent }) => (
                      <View style={styles.selectedItem}>
                        <MaterialIcons
                          name="check-box"
                          size={20}
                          color="#06b6d4"
                        />
                        <Text>{selectedStudent.full_name}</Text>
                      </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                  />
                </View>
              )}
            </View>

            <View style={[styles.btnContainer]}>
              <TouchableOpacity
                style={[styles.btn, styles.btnDeny]}
                onPress={() => onRequestClose()}
              >
                <Text style={styles.btnDenyText}>Từ chối</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={user.TYPE === UserType.LEANER ? handleJoinClass: handleAcceptClassToTeach}
                style={[styles.btn, styles.btnSave, styles.boxShadow]}
              >
                <Text style={styles.btnSaveText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal hiển thị tham gia lớp học thành công */}
      <ModalDialogForClass
        confirmTitle="Thông báo"
        confirmContent={modalDialog.confirmContent}
        imageStatus={modalDialog.confirmStatus}
        visiable={isConfirming}
        onRequestCloseDialog={() => setIsConfirming(null)}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  questionImageContainer: {
    backgroundColor: BackgroundColor.white,
    marginBottom: 20,
    borderRadius: 999,
    padding: 10,
  },

  questionImage: {
    width: 40,
    height: 40,
    // backgroundColor: BackgroundColor.white,
  },

  selectedContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },

  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    backgroundColor: BackgroundColor.cyan_overlay,
    padding: 15,
    borderRadius: 10,
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
