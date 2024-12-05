import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Modal from "react-native-modal";
import { BackgroundColor } from "../../../configs/ColorConfig";
import ModalConfirmJoinClass from "./ModalConfirmJoinClass";
import Feather from "@expo/vector-icons/Feather";
import User from "../../../models/User";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ReactAppUrl from "../../../configs/ConfigUrl";
import { AccountContext } from "../../../configs/AccountConfig";
import { LanguageContext } from "../../../configs/LanguageConfig";

type ModalJoinClassProps = {
  classId: number;
  studentList: User[];
  visiable: string | null;
  onRequestClose: () => void;
  onResultValue: (result: boolean) => void;
};

const LEARNR_TYPE = {
  ME: "me",
  CHILD: "child",
};

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("screen");
const URL = ReactAppUrl.PUBLIC_URL;
export default function ModalJoinClass({
  classId,
  studentList,
  visiable,
  onRequestClose,
  onResultValue,
}: ModalJoinClassProps) {
  // context
  const account = useContext(AccountContext).account;
  const language = useContext(LanguageContext).language;
  // states
  const [selectedStudents, setSelectedStudents] = useState<User[]>([]);
  const [isConfirmingJoin, setIsConfirmingJoin] = useState<string | null>("");
  const [learnerType, setLearnerType] = useState("me");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [targetUser, setTargetUser] = useState<User>();
  const [modalText, setModalText] = useState(language.CONFIRM_JOIN_CLASS)

  // Shared value for height
  const modalHeight = useSharedValue(0.45);

  // Handle
  // Hàm xử lý khi nhấn vào checkbox
  const handleToggleCheckbox = (student: User) => {
    if (selectedStudents.some((s) => s.id === student.id)) {
      // Nếu học sinh đã được chọn, loại bỏ khỏi danh sách
      setSelectedStudents(selectedStudents.filter((s) => s.id !== student.id));
    } else {
      // Nếu học sinh chưa được chọn, thêm vào danh sách
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const handleConfirmJoinClass = () => {
    if(selectedStudents.length > 0) {
      setModalText(language.CONFIRM_JOIN_CLASS_WITH_SELECTED_LEARNERS)
    }
    else {
      setModalText(language.CONFIRM_JOIN_CLASS)
    }
    setIsConfirmingJoin("modalConfirmJoinClass");
    onRequestClose();
  };

  // Animated style for modal height
  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(modalHeight.value * SCREEN_HEIGHT, { duration: 300 }),
  }));

  // Handle payment method change
  const handleLearnerTypeChange = (type: string) => {
    setLearnerType(type);
    modalHeight.value = type === LEARNR_TYPE.CHILD ? 0.85 : 0.45;
  };

  useEffect(() => {
    if (account) {
      setFilteredUsers(studentList.filter((user) => user.id !== account.id));
      setTargetUser(studentList.find((user) => user.id === account.id));
    }
  }, [account, classId, studentList]);

  return (
    <View>
      {/* Modal chọn học sinh */}
      <Modal
        isVisible={visiable === "modalJoinClass"}
        animationIn={"slideInUp"}
        animationOut={"slideOutDown"}
        onBackdropPress={() => onRequestClose()}
      >
        <Animated.View style={[styles.container, animatedStyle]}>
          <View style={styles.modalHeader}>
            <Text style={styles.headerTitle}>{language.JOIN}</Text>
            <TouchableOpacity onPress={onRequestClose} style={styles.btnClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={{ flex: 7 }}>
              {/* Chọn người học cho lớp */}
              <View style={styles.learnerSelectionContainer}>
                <Text style={styles.titleContainer}> {language.SELECT_LEARNER} </Text>

                {/* Cho tôi học */}
                <TouchableOpacity
                  onPress={() => handleLearnerTypeChange("me")}
                  style={styles.learnerOption}
                >
                  <Feather
                    name="user"
                    size={24}
                    color={learnerType === LEARNR_TYPE.ME ? "green" : "gray"}
                  />
                  <Text style={styles.learnerOptionText}>{language.LEARN_FOR_ME}</Text>
                  {learnerType === LEARNR_TYPE.ME && (
                    <Ionicons name="checkmark" size={24} color="green" />
                  )}
                </TouchableOpacity>

                {/* Cho con học */}
                <TouchableOpacity
                  onPress={() => handleLearnerTypeChange("child")}
                  style={styles.learnerOption}
                >
                  <Feather
                    name="users"
                    size={24}
                    color={learnerType === LEARNR_TYPE.CHILD ? "green" : "gray"}
                  />
                  <Text style={styles.learnerOptionText}>{language.LEARN_FOR_CHILD}</Text>
                  {learnerType === LEARNR_TYPE.CHILD && (
                    <Ionicons name="checkmark" size={24} color="green" />
                  )}
                </TouchableOpacity>
              </View>

              {learnerType === LEARNR_TYPE.CHILD && (
                <View style={styles.studentList}>
                  <FlatList
                    data={filteredUsers}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item: student }) => {
                      const isChecked = selectedStudents.some(
                        (s) => s.id === student.id
                      );

                      return (
                        <View>
                          <TouchableOpacity
                            disabled={
                              student.lessons && student.lessons?.length > 0
                            }
                            onPress={() => handleToggleCheckbox(student)}
                            style={[
                              isChecked
                                ? styles.activeCheckbox
                                : styles.checkbox,
                              styles.boxShadow,
                            ]}
                          >
                            <View style={styles.studentSelect}>
                              <View style={styles.studentContainer}>
                                <Image
                                  source={{
                                    uri: `${URL}${student.avatar}`,
                                  }}
                                  style={styles.avtarImage}
                                />
                                <Text style={styles.activeText}>
                                  {student.full_name}
                                </Text>
                              </View>
                              {student.lessons &&
                                student.lessons.length === 0 && (
                                  <MaterialIcons
                                    name={
                                      isChecked
                                        ? "check-box"
                                        : "check-box-outline-blank"
                                    }
                                    size={20}
                                    color={isChecked ? "#06b6d4" : "#64748b"}
                                  />
                                )}
                            </View>

                            {student.lessons && student.lessons?.length > 0 && (
                              <View style={styles.notificationContent}>
                                <Feather
                                  name="alert-triangle"
                                  size={24}
                                  color={BackgroundColor.warning}
                                />
                                <Text style={styles.notificationText}>
                                  {language.CANNOT_JOIN_CLASS}
                                </Text>
                              </View>
                            )}
                            {student.lessons &&
                              student.lessons.length === 0 && (
                                <View style={styles.notificationContent}>
                                  <Feather
                                    name="check-circle"
                                    size={24}
                                    color="green"
                                  />
                                  <Text style={styles.notificationText}>
                                   {language.CAN_JOIN_CLASS}
                                  </Text>
                                </View>
                              )}
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
              )}
            </View>
            

            {learnerType === LEARNR_TYPE.ME && (
            <View style={[styles.btnContainer]}>
              {targetUser?.lessons && targetUser?.lessons.length > 0 && (
                <TouchableOpacity
                  onPress={() => handleConfirmJoinClass()}
                  style={[styles.btn, styles.btnSaveDisable, styles.boxShadow]}
                >
                  <Text style={styles.btnSaveText}>{language.CAN_JOIN_CLASS}</Text>
                </TouchableOpacity>
              )}

            {targetUser?.lessons && targetUser?.lessons.length == 0 && (
              <TouchableOpacity
                onPress={() => handleConfirmJoinClass()}
                style={[styles.btn, styles.btnSave, styles.boxShadow]}
              >
                <Text style={styles.btnSaveText}>{language.JOIN}</Text>
              </TouchableOpacity>
            )}
            </View>
            )}

        {learnerType === LEARNR_TYPE.CHILD && (
          <View style={[styles.btnContainer]}>
           <TouchableOpacity
           disabled={selectedStudents.length === 0}
           onPress={() => handleConfirmJoinClass()}
           style={[styles.btn, selectedStudents.length === 0 ? styles.btnSaveDisable : styles.btnSave, styles.boxShadow]}
         >
           <Text style={styles.btnSaveText}>{language.JOIN}</Text>
         </TouchableOpacity>
         </View>
        )}
          </View>
        </Animated.View>
      </Modal>

      {/* Modal xác nhận các học sinh đã tham gia vào lớp học đó */}
      <ModalConfirmJoinClass
        confirmContent={modalText}
        visiable={isConfirmingJoin}
        onRequestClose={() => {setIsConfirmingJoin(null), setSelectedStudents([])}}
        selectedStudents={selectedStudents}
        classId={classId}
        onResultValue={onResultValue}
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

  studentList: { marginBottom: 40 },

  checkbox: {
    backgroundColor: BackgroundColor.white,
    borderWidth: 1,
    borderColor: BackgroundColor.gray_e6,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 15,
    marginBottom: 15,
  },

  activeCheckbox: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: BackgroundColor.gray_e6,
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
  notificationText: {
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
    borderRadius: 10,
  },

  btnSave: {
    flex: 1,
    backgroundColor: BackgroundColor.primary,
  },

  btnSaveDisable: {
    flex: 1,
    backgroundColor: BackgroundColor.gray_50,
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

  // Pay
  titleContainer: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 10,
  },

  learnerSelectionContainer: {
    backgroundColor: BackgroundColor.white,
    paddingBottom: 10,
    paddingHorizontal: 5,
  },

  selectedImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    borderRadius: 10,
    marginTop: 10,
  },

  learnerOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  learnerOptionText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },

  line: {
    height: 2,
    backgroundColor: BackgroundColor.gray_e6,
  },

  btnClose: {
    position: "absolute",
    right: 0,
    top: 0,
  },
});
