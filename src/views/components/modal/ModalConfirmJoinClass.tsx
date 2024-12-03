import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Modal from "react-native-modal";
import { BackgroundColor } from "../../../configs/ColorConfig";
import { Image } from "react-native";
import AClass from "../../../apis/AClass";
import { UserContext, UserType } from "../../../configs/UserContext";
import ModalDialogForClass from "./ModalDialogForClass";
import User from "../../../models/User";
import { AccountContext } from "../../../configs/AccountConfig";
import { LanguageContext } from "../../../configs/LanguageConfig";

type ModalJoinClassProps = {
  confirmContent: string;
  visiable: string | null;
  onRequestClose: () => void;
  selectedStudents?: User[];
  classId: number;
  onResultValue: (result: boolean) => void; 
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
  onResultValue
}: ModalJoinClassProps) {
  //context 
  const account = useContext(AccountContext).account;
  const user = useContext(UserContext).user;
  const language = useContext(LanguageContext).language;

  // states 
  const [isConfirming, setIsConfirming] = useState<string | null>("");
  const [loading, setLoading] = useState(false);
  const [userIds, setUserIds] = useState<string[]>([]);
  const [modalDialog, setModalDialog] = useState<ModalDialog>({
    confirmContent: "",
    confirmStatus: "failure"
  });

  
  // Handles

  // Xử lý tham gia lớp học
  const handleJoinClass = useCallback(() => {
    if(account && userIds.length === 0){
      userIds.push(account.id);
    }
    
    AClass.joinClass(
      classId, 
      userIds ,
      (data) => {
         // mở modalDialogForClass
        setIsConfirming("modalDialogForClass");
        onRequestClose();
        if(data.result){
          onResultValue(data.result)

          setModalDialog({
            confirmContent: language.JOIN_CLASS_SUCCESS,
            confirmStatus: "success"
          });
        }
        else {
          setModalDialog({
            confirmContent: language.JOIN_CLASS_FAILED,
            confirmStatus: "failure"
          });
        }
      },
      setLoading
     )
    

  }, [userIds, classId,]);

  // Xử lý nhận lớp cho gia sư
  const handleAcceptClassToTeach = useCallback(() => {
    if(account){
      AClass.acceptClassToTeach(
        classId, 
        account.id,
        (data) => {
          setIsConfirming("modalDialogForClass"); // mở modalDialogForClass
          onRequestClose();
          if(data.result){
            onResultValue(data.result)
            setModalDialog({
              confirmContent: language.ACCEPT_CLASS_SUCCESS,
              confirmStatus: "success"
            });
          }
          else {
            setModalDialog({
              confirmContent: language.ACCEPT_CLASS_FAILED,
              confirmStatus: "failure"
            });
          }
        },
        setLoading
       )
    }
  }, [classId, account])

  // effects 
  // Xử lấy danh sách con của người dùng được chọn
  useEffect(() => {
      if (selectedStudents) {
        setUserIds(selectedStudents.map((student) => student.id))
      } else {
        setUserIds([]);
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
            <Text style={styles.headerTitle}>{language.CONFIRM_JOIN}</Text>
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
                onPress={() => onRequestClose() }
              >
                <Text style={styles.btnDenyText}>{language.DECLINE}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={user.TYPE === UserType.LEANER ? handleJoinClass: handleAcceptClassToTeach}
                style={[styles.btn, styles.btnSave, styles.boxShadow]}
              >
                <Text style={styles.btnSaveText}>{language.CONFIRM}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal hiển thị tham gia lớp học thành công */}
      <ModalDialogForClass
        confirmTitle={language.NOTIFICATION}
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
