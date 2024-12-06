import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import IconReport from "../../components/ItemUserReport";
import React, {useCallback, useContext, useEffect, useState} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import ImageViewer from "react-native-image-zoom-viewer";
import AUserReport from "../../../apis/AUserReport";
import {BackgroundColor} from "../../../configs/ColorConfig";
import ReactAppUrl from "../../../configs/ConfigUrl";
import {MaterialIcons} from "@expo/vector-icons";
import {NavigationContext, NavigationRouteContext} from "@react-navigation/native";
import {LanguageContext} from "../../../configs/LanguageConfig";
import {AppInfoContext} from "../../../configs/AppInfoContext";
import Report from "../../../models/Report";
import {IdNavigationType, ReportNavigationType} from "../../../configs/NavigationRouteTypeConfig";
import AUserAdmin from "../../../apis/admin/AUserAdmin";
import ScreenName from "../../../constants/ScreenName";
import {IImageInfo} from "react-native-image-zoom-viewer/built/image-viewer.type";
import Spinner from "react-native-loading-spinner-overlay";
import SFirebase, {FirebaseNode} from "../../../services/SFirebase";

enum ReportMode {
  NOT_PERFORMED = 0,
  APPROVED = 1,
  DENIED = 2,
}

export default function UpdateReportedUser() {
  //contexts
  const navigation = useContext(NavigationContext);
  const languageContext = useContext(LanguageContext).language;
  const appInfo = useContext(AppInfoContext).infos;
  const route = useContext(NavigationRouteContext);

  //states
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number>(-1);
  const [reportLevels, setReportLevelList] = useState<{ id: number, label: string, points: number }[]>([]);
  const [report, setReport] = useState<Report | undefined>(undefined);
  const [evidences, setEvidences] = useState<string[]>([]);
  const [isPerformed, setIsPerformed] = useState(ReportMode.NOT_PERFORMED);

  //handlers
  const handleSelectLevel = useCallback((levelId: number) => {
    if (!report) return;

    if (report.reason || report.report_level > 0) return;

    setSelectedLevel(levelId);
  }, [report]);

  const openProfile = useCallback((userId: string) => {
    const data: IdNavigationType = {
      id: userId
    };
    navigation?.navigate(ScreenName.PROFILE, data);
  }, []);

  const openClass = useCallback(() => {
    const data: IdNavigationType = {
      id: report?.class?.id ?? -1
    };
    navigation?.navigate(ScreenName.DETAIL_CLASS, data);
  }, [report]);

  const goToUserPermission = useCallback(() => {
    const data: IdNavigationType = {
      id: report?.reportee?.id ?? "-1",
    }

    navigation?.navigate(ScreenName.USER_PERMISSION_MANAGEMENT, data);
  }, [report]);

  const handlePerformReport = useCallback(() => {
    setModalVisible(false);
    if (!report) return;

    if (selectedLevel < 0) {
      Alert.alert(
        "Vui lòng chọn mức độ báo cáo trước khi thuc hien!"
      );
      return;
    }

    // Tìm số điểm tương ứng với mức độ đã chọn
    const level = reportLevels.find(
      (level) => level.id === selectedLevel
    );
    const pointsToDeduct = level?.points || 0;

    setLoading(true);
    AUserReport.performReport(
      report.id,
      reason,
      selectedLevel,
      pointsToDeduct,
      report.reporter?.id ?? "-1",
      report.reportee?.id ?? "-1",
      (result) => {
        if (result) {
          Alert.alert("Thuc hien bao cao thanh cong!");
        } else {
          Alert.alert("Đã xảy ra lỗi trong quá trình xu ly!");
        }
      },
      () => {
        setLoading(false);
      }
    );

  }, [report, reason, selectedLevel]);

//effects
  useEffect(() => {
    const reportLevelList: { id: number, label: string, points: number }[] = [];

    const levelsInClass = [
      appInfo.report_class_level_1,
      appInfo.report_class_level_2,
      appInfo.report_class_level_3,
      appInfo.report_class_level_4,
    ]

    const levelsUser = [
      appInfo.report_user_level_1,
      appInfo.report_user_level_2,
      appInfo.report_user_level_3,
      appInfo.report_user_level_4,
    ]

    const labels = [
      languageContext.NOT_SERIOUS,
      languageContext.QUITE_SERIOUS,
      languageContext.SERIOUS,
      languageContext.EXTREMELY_SERIOUS,
    ];

    for (let i = 1; i <= 4; i++) {
      reportLevelList.push({
        id: i,
        label: labels[i - 1],
        points: report?.class ? levelsInClass[i - 1] : levelsUser[i - 1]
      });
    }

    setReportLevelList(reportLevelList);
  }, [report]);

  useEffect(() => {
    const data: ReportNavigationType = route?.params as ReportNavigationType ?? {id: -1};

    const reportId = data.id;
    const reporter = data.reporter;


    SFirebase.track(FirebaseNode.Reports, [{key: FirebaseNode.Id, value: reportId}], () => {
      setLoading(true);

      AUserAdmin.getReportById(reportId, report => {
        if (report) {
          report.reporter = reporter;
          setReport(report);
          setLoading(false);
          setSelectedLevel(report.report_level ?? -1);
          if (report.reason) {
            setIsPerformed(ReportMode.DENIED);
          } else if (report.report_level > 0) {
            setIsPerformed(ReportMode.APPROVED);
          } else {
            setIsPerformed(ReportMode.NOT_PERFORMED);
          }
        }
      });

      AUserAdmin.getReportEvidenceById(reportId, evidences => {
        setEvidences(evidences);
      });
    });

  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <Spinner visible={loading}/>

      {/* nút back và tên màn hình */}
      <View style={styles.component}>
        {/* header */}
        <View style={styles.screenName}>
          <View style={styles.backBtn}>
            <Ionicons name={"arrow-back-outline"} size={30} onPress={navigation?.goBack}/>
          </View>
          <Text style={styles.screenTitle}>Chi tiết báo cáo </Text>
        </View>

        <Text
          style={styles.badge}>{isPerformed === ReportMode.NOT_PERFORMED ? "Chua xu ly" : isPerformed === ReportMode.APPROVED ? "Da chap nhan" : "Da tu choi"}</Text>

        <View style={styles.infor}>
          <Text style={styles.smallTitle1}>Tài khoản báo cáo </Text>
          <Text style={styles.smallTitle1}>
            {
              !report?.class ? "User" :
                report.reporter?.id === report.class.tutor?.id ? "Tutor" : "Learner"
            }
          </Text>
        </View>

        <IconReport
          userAvatar={report?.reporter?.avatar + ""}
          userName={report?.reporter?.full_name + ""}
          credibility={report?.reporter?.point ?? 0}
          onPress={() => openProfile(report?.reporter?.id ?? "")}
        />

        {/* tài khoản bị báo cáo */}
        <View style={styles.infor}>
          <Text style={styles.smallTitle2}>Tài khoản bi báo cáo </Text>
          <Text style={styles.smallTitle2}>
            {
              !report?.class ? "User" :
                report.reportee?.id === report.class.tutor?.id ? "Tutor" : "Learner"
            }
          </Text>
        </View>

        <IconReport
          userAvatar={report?.reportee?.avatar + ""}
          userName={report?.reportee?.full_name + ""}
          credibility={report?.reportee?.point ?? 0}
          onPress={() => openProfile(report?.reporter?.id ?? "")}
        />

        {/* lớp học bị báo cáo */}
        {report?.class && (
          <View>
            <Text style={styles.smallTitle2}>Lớp học bị báo cáo</Text>
            <View style={styles.classInfor}>
              <Text>{report?.class?.title}</Text>
              <Ionicons onPress={openClass} name="chevron-forward" size={20} color="black"/>
            </View>
          </View>
        )}

      </View>

      <View style={styles.component1}>
        <Text style={styles.smallTitle3}>Noi dung bao cao</Text>
        <Text style={[styles.reportContent, {minHeight: 100}]}>{report?.content ?? "Noi dung trong"}</Text>
      </View>

      {isPerformed === ReportMode.DENIED && (
        <View style={styles.component1}>
          <Text style={styles.smallTitle3}>Li do tu choi</Text>
          <Text style={[styles.reportContent, {minHeight: 100}]}>{report?.reason}</Text>
        </View>
      )}

      <View style={styles.component2}>
        <Text style={styles.smallTitle3}>Minh chứng:</Text>
        <View style={styles.images}>
          <FlatList
            data={evidences}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={styles.imgParent}
                key={index}
                onPress={() => setSelectedIndex(index)}
              >
                <Image style={styles.img} src={ReactAppUrl.PUBLIC_URL + item}/>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.reportLevelContainer}>
          <Text style={styles.title}>Chọn mức độ báo cáo:</Text>
          {reportLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelOption,
                selectedLevel === level.id && styles.selectedOption,
              ]}
              onPress={() => handleSelectLevel(level.id)}
            >
              <Text style={styles.optionText}>{level.label}</Text>
              {selectedLevel === level.id && (
                <MaterialIcons name="check" size={20} color="green"/>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {!report?.reason && (report?.report_level ?? -1) <= 0 && selectedLevel >= 0 && (
          <View>
            <View style={styles.btns}>
              <TouchableOpacity
                style={[styles.btn, styles.btnAccept]}
                onPress={handlePerformReport}
              >
                <Text style={styles.textBtnAccept}>Chấp nhận</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.btnDeney]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.textBtnDeney}>Từ chối</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {(report?.reason || ((report?.report_level ?? -1) > 0)) &&
          (
            <TouchableOpacity
              style={[styles.btn, styles.deleteUser]}
              onPress={goToUserPermission}
            >
              <Text style={styles.textBtnDeleteUser}>Quan ly quyen cua tài khoản</Text>
            </TouchableOpacity>
          )}
      </View>

      <Modal visible={selectedIndex >= 0}>
        <ImageViewer
          imageUrls={evidences.map((item) => ({url: `${ReactAppUrl.PUBLIC_URL}${item}`} as IImageInfo))}
          index={selectedIndex ?? 0}
          onSwipeDown={() => setSelectedIndex(-1)}
          enableSwipeDown={true}
        />
      </Modal>

      {/* //modal từ chối báo cáo */}
      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập lý do từ chối</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Lý do từ chối báo cáo"
              value={reason}
              multiline={true}
              numberOfLines={5}
              textAlignVertical={"top"}
              onChangeText={(text) => setReason(text)}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, styles.btnCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textBtnCancel}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnD, styles.btnConfirm]}
                onPress={handlePerformReport}
              >
                <Text style={styles.textBtnConfirm}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EEEEEE",
  },

  badge: {
    backgroundColor: BackgroundColor.warning,
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 10,
  },

  screenName: {
    flexDirection: "row",
    top: 30,
    marginBottom: 40,
  },

  screenTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    left: "50%",
    width: "80%",
    top: "1%",
  },
  backBtn: {
    top: "2%",
  },
  user: {
    height: 60,
    alignItems: "center", // Căn giữa các phần tử theo chiều dọc
    borderWidth: 1, // Độ dày của viền
    borderColor: "#ccc", // Màu sắc của viền
    borderRadius: 10, // Bo góc cho viền
    shadowColor: "#000",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginTop: 10,
    marginLeft: 10,
  },
  smallTitle1: {
    top: 10,
    fontWeight: "bold",
    fontSize: 16,
    paddingBottom: 15,
    color: BackgroundColor.primary,
  },

  smallTitle2: {
    top: 10,
    fontWeight: "bold",
    fontSize: 16,
    paddingBottom: 15,
    color: BackgroundColor.danger,
  },

  smallTitle3: {
    top: 10,
    fontWeight: "bold",
    fontSize: 16,
    paddingBottom: 15,
    color: "black",
  },

  iconInUser: {
    flexDirection: "row",
    marginTop: "5%",
    left: "35%",
  },

  classInfor: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
    height: 60,
    borderRadius: 10, // Bo góc cho viền
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
  },
  component: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  component1: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  component2: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  textareaContainer: {
    width: "98%",
    borderRadius: 10,

    paddingHorizontal: 15,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
    marginBottom: 20,
  },

  reportParent: {
    marginBottom: 20,
  },
  itemlCenter: {
    alignItems: "center",
  },
  reportContent: {
    width: "98%",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
    marginBottom: 30,
  },
  img: {
    width: 300,
    height: 200,
    borderRadius: 5,
    zIndex: 100,
  },
  imgParent: {
    marginRight: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
  },

  images: {
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 10,
    width: 70,
    height: 50,
    top: 50,
    left: 350,
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 1,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1, // Để chiếm toàn bộ chiều cao màn hình
    justifyContent: "center", // Căn giữa nội dung theo chiều dọc
    alignItems: "center", // Căn giữa nội dung theo chiều ngang
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Làm mờ nền
  },

  btns: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 15,
  },

  btn: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  btnAccept: {
    backgroundColor: BackgroundColor.primary,
    flex: 1,
  },
  textBtnAccept: {
    color: "#fff",
  },
  btnDeney: {
    backgroundColor: BackgroundColor.warning,
    flex: 1,
  },
  textBtnDeney: {
    color: "#fff",
  },
  deleteUser: {
    backgroundColor: BackgroundColor.danger,
    flex: 1,
  },
  textBtnDeleteUser: {
    color: "#fff",
  },

  reportLevelContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  levelOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  selectedOption: {
    borderColor: "#007AFF",
    backgroundColor: "#e6f0ff",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  role: {
    left: 90,
  },
  infor: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnD: {
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnCancel: {
    backgroundColor: "#ccc",
    flex: 1,
    marginRight: 5,
  },
  btnConfirm: {
    backgroundColor: "#4caf50",
    flex: 1,
    marginLeft: 5,
  },
  textBtnCancel: {
    color: "#000",
    textAlign: "center",
  },
  textBtnConfirm: {
    color: "#fff",
    textAlign: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  textBtn: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  roleButton: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedRoleButton: {
    backgroundColor: "#cce5ff", // Màu nền khi role được chọn
    borderColor: "#007bff", // Đổi màu viền khi role được chọn
  },
  roleText: {
    fontSize: 16,
  },
  selectedRoleText: {
    fontWeight: "bold",
    color: "#007bff", // Màu chữ khi role được chọn
  },
});
