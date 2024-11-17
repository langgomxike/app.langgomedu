import React, {useCallback, useContext, useEffect, useState} from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { BackgroundColor, BorderColor } from "../../configs/ColorConfig";
import CourseItem from "../components/CourseItem";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../configs/NavigationRouteTypeConfig";
import AClass from "../../apis/AClass";
import ReactAppUrl from "../../configs/ConfigUrl";
import Class from "../../models/Class";
import DetailClassSkeleton from "../components/skeleton/DetailClassSkeleton";
import { UserContext, UserType } from "../../configs/UserContext";
import ModalJoinClass from "../components/modal/ModalJoinClass";
import AStudent from "../../apis/AStudent";
import Student from "../../models/Student";
import ModalConfirmJoinClass from "../components/modal/ModalConfirmJoinClass";
import DateTimeConfig from "../../configs/DateTimeConfig";

const URL = ReactAppUrl.PUBLIC_URL;
export default function ClassDetail() {
  const route: RouteProp<RootStackParamList> = useRoute();
  // Get class id
  const param = route.params;

  //contexts
  const { user, setUser } = useContext(UserContext);

  // state
  const [classDetail, setClassDetail] = useState<Class>();
  const [relatedClasses, setRelatedClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState<string | null>("");
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [resultResponse, setResultResponse] = useState(false)

  // handlers
  function formatCurrency(amount: number, locale = "vi-VN", currency = "VND") {
    // Kiểm tra nếu không phải số, trả về chuỗi lỗi
    if (typeof amount !== "number") return "Invalid input";

    return amount.toLocaleString(locale, {
      style: "currency",
      currency,
    });
  }

  const handleJoinClass = useCallback(() => {
    setModalVisible(
      studentList.length > 0 ? "modalJoinClass" : "modalConfirmJoinClass"
    );
  }, [studentList]);

  const handleAcceptClass = () => {
    setModalVisible("modalConfirmJoinClass");
  };

  // effect
  useEffect(() => {
    //Get detail class
    AClass.getClassDetailWithUser(
      param.classId,
      user.ID,
      (_class, relatedClasses) => {
        setClassDetail(_class);
        setRelatedClasses(relatedClasses);
      },
      setLoading
    );
    if (user.TYPE === UserType.LEANER) {
      //Get student class belongs to user for leaner
      AStudent.getStudentBelongsToUser(
        user.ID,
        (data) => {
          setStudentList(data);
        },
        setLoading
      );
    } else {
      //Get student in class for tutor
      AStudent.getStudentsInClass(
        param.classId,
        (data) => {
          setStudentList(data);
        },
        setLoading
      );
    }
  }, [resultResponse]);

  // render
  return (
    <View style={styles.container}>
      <View style={{ flex: 9 }}>
        {loading && <DetailClassSkeleton />}
        {!loading && classDetail && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              {/* Header */}
              <View style={styles.headerContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: `${URL}${classDetail?.major?.icon?.path}`,
                    }}
                    style={styles.headerImage}
                  />
                </View>
                <Text style={styles.headerTitle}>
                  {classDetail.major?.vn_name}
                </Text>
              </View>

              {/* Body */}
              <View style={styles.bodyContainer}>
                {/* Class infomation */}
                <View style={styles.classInfoContainer}>

                  {/* Tiêu đề môn học */}
                  <Text style={styles.classInfoTitle}>{classDetail.title}</Text>

                  <View style={styles.row}>
                  {/* class level */}
                    <View style={styles.itemInfoTwo}>
                      <Ionicons name="book-outline" size={24} color="black" />
                      <Text>{classDetail.class_level?.vn_name}</Text>
                    </View>

                    {/* start time*/}
                    <View
                      style={[
                        styles.itemInfoTwo,
                        { justifyContent: "flex-end" },
                      ]}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={24}
                        color="black"
                      />
                      <Text>{DateTimeConfig.getDateFormat(classDetail.started_at)}</Text>
                    </View>
                  </View>

                  <View style={[styles.line, { marginTop: 10 }]} />

                  {/* max learners */}
                  <View style={styles.itemInfo}>
                    <View style={styles.row}>
                      <Ionicons name="cube-outline" size={24} color="black" />
                      <Text>Số lượng</Text>
                    </View>
                    <Text style={styles.itemContent}>
                      {classDetail.max_learners}
                    </Text>
                  </View>

                  {/* detail */}
                  <View style={styles.itemInfo}>
                    <View style={styles.row}>
                      <Ionicons
                        name="git-commit-outline"
                        size={24}
                        color="black"
                      />
                      <Text>Hình thức</Text>
                    </View>
                    <Text style={styles.itemContent}>
                      {classDetail.type.join(", ")}
                    </Text>
                  </View>

                  {/* time each lesson */}
                  <View style={styles.itemInfo}>
                    <View style={styles.row}>
                      <Ionicons name="timer-outline" size={24} color="black" />
                      <Text>Thời gian</Text>
                    </View>
                    <Text style={[styles.itemContent]}>time giờ/Buổi</Text>
                  </View>

                  {/* price */}
                  <View style={styles.itemInfo}>
                    <View style={styles.row}>
                      <Ionicons name="cash-outline" size={24} color="black" />
                      <Text>Học phí</Text>
                    </View>
                    <Text style={[styles.itemContent]}>
                      {formatCurrency(classDetail.price)}/Buổi
                    </Text>
                  </View>

                  {/* address */}
                  <View style={styles.itemInfo}>
                    <View style={styles.row}>
                      <Ionicons
                        name="location-outline"
                        size={24}
                        color="black"
                      />
                      <Text>Địa chỉ</Text>
                    </View>
                    <Text style={[styles.itemContent]}>
                      {`${classDetail.address_4}, ${classDetail.address_3}, ${classDetail.address_2}, ${classDetail.address_1}`}
                    </Text>
                  </View>

                  <View style={[styles.line, { marginTop: 10 }]} />

                  {/* class fee */}
                  <View style={[styles.itemInfo, { marginTop: 20 }]}>
                    <View style={styles.row}>
                      <Text>Phí nhận lớp</Text>
                    </View>
                    <Text style={[styles.itemContentFee]}>
                      {formatCurrency(50000)}
                    </Text>
                  </View>
                </View>

                {/* Student information */}
                <View style={styles.studentInfomationContainer}>
                  <Text style={[styles.containerTitle, { marginBottom: 10 }]}>
                    Mô tả
                  </Text>
                  <Text>{classDetail.description}</Text>
                </View>

                {/* Các lớp học liên quan */}
                <View style={styles.relatedClassContainer}>
                  {/* title */}
                  <Text style={[styles.containerTitle, { padding: 20 }]}>
                    Các lớp liên quan
                  </Text>

                  <FlatList
                    data={relatedClasses}
                    renderItem={({ item: relatedClass }) => (
                      <View style={styles.classItem}>
                        <Pressable>
                          <CourseItem
                            majorIconUrl={`${URL}${relatedClass.major?.icon?.path}`}
                            name={relatedClass.title}
                            level={relatedClass.class_level?.vn_name || ""}
                            date={DateTimeConfig.getDateFormat(relatedClass.started_at)}
                            time={2}
                            type={relatedClass.type.join(",")}
                            address={relatedClass.address_1}
                            cost={relatedClass.price}
                          />
                        </Pressable>
                      </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[
                      styles.classList,
                      relatedClasses.length === 1 && styles.centeredItem,
                    ]}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        )}

      </View>
      {/* Nút bấn để nhập lớp */}
      {classDetail?.user_status !== "author" && (
        <View style={[styles.buttonContainer, styles.shadow]}>
          {user.TYPE === UserType.LEANER ? (
            // Tham gia lớp học dành cho leaner
            // Disable khi learner tham gia vào lớp đọc đó, learner đó là người tạo lớp, người tham gia lớp học đó
            // Được active trạng thái không phải là membern ko phải là người tạo lớp, không phải người dạy lớp học đó
            <TouchableOpacity
              disabled={
                classDetail?.user_status === "member" ||
                classDetail?.tutor?.id === user.ID ||
                classDetail?.author?.id === user.ID
              }
              onPress={handleJoinClass}
              style={[
                classDetail?.user_status === "member" ||
                classDetail?.tutor?.id === user.ID ||
                classDetail?.author?.id === user.ID
                  ? styles.btnDiableReceiveClass
                  : styles.btnReceiveClass,
                styles.boxShadow,
              ]}
            >
              <Text style={styles.btnReceiveClassText}>
                {classDetail?.user_status === "member"
                  ? "Bạn đã tham gia lớp học"
                  : classDetail?.tutor?.id === user.ID
                  ? "Bạn đã dạy lớp này"
                  : classDetail?.author?.id === user.ID
                  ? "Bạn đã tạo lớp này"
                  : "Tham gia lớp học"}
              </Text>
            </TouchableOpacity>
          ) : (
            // Nhận lớp dành cho tutor
            // Disable khi là gia sư của lớp học đó, người tạo lớp đó, thành viên của lớp học đó
            // Active khi chưa là sư sư của lớp học, không phải người tạo lớp, không phải là thành viên trong lớp
            <TouchableOpacity
              disabled={
                classDetail?.user_status === "tutor" ||
                classDetail?.author?.id === user.ID ||
                classDetail?.user_status === "member"
              }
              onPress={handleAcceptClass}
              style={[
                classDetail?.user_status === "tutor" ||
                classDetail?.author?.id === user.ID ||
                classDetail?.user_status === "member"
                  ? styles.btnDiableReceiveClass
                  : styles.btnReceiveClass,
                styles.boxShadow,
              ]}
            >
              <Text style={styles.btnReceiveClassText}>
                {classDetail?.user_status === "tutor"
                  ? "Đã nhập lớp"
                  : classDetail?.author?.id === user.ID
                  ? "Bạn đã tạo lớp này"
                  : classDetail?.user_status === "member"
                  ? "Bạn đã tham gia lớp này"
                  : "Nhận dạy lớp"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Modal for leaner */}
      {user.TYPE === UserType.LEANER && (
        <>
          {classDetail && studentList.length > 0 && (
            <ModalJoinClass
              classId={classDetail.id}
              studentList={studentList}
              visiable={modalVisible}
              onRequestClose={() => setModalVisible(null)}
              onResultValue={setResultResponse}
            />
          )}
          {classDetail && studentList.length < 0 && (
            <ModalConfirmJoinClass
              confirmContent="Bạn chắc chắn muốn tham gia lớp học này?"
              visiable={modalVisible}
              onRequestClose={() => setModalVisible(null)}
              classId={classDetail.id}
              onResultValue={setResultResponse}
            />
          )}
        </>
      )}

      {user.TYPE === UserType.TUTOR && (
        <>
          {classDetail && (
            <ModalConfirmJoinClass
              confirmContent="Bạn muốn nhận dạy lớp học này?"
              visiable={modalVisible}
              onRequestClose={() => setModalVisible(null)}
              classId={classDetail.id}
              selectedStudents={studentList}
              onResultValue={setResultResponse}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.gray_e6,
  },

  headerContainer: {
    backgroundColor: BackgroundColor.primary,
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,

    elevation: 18,
  },

  bodyContainer: {},

  line: {
    height: 1,
    backgroundColor: BackgroundColor.gray_c6,
  },

  imageContainer: {
    padding: 10,
    borderRadius: 999,
    backgroundColor: BackgroundColor.white,
  },
  headerImage: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: BackgroundColor.white,
  },

  classInfoContainer: {
    backgroundColor: BackgroundColor.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -50,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 10,
  },

  classInfoTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  itemInfoTwo: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  itemInfo: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 10,
  },

  itemContent: {
    flex: 1,
    textAlign: "right",
    color: BackgroundColor.primary,
    fontWeight: "bold",
  },

  itemContentFee: {
    flex: 1,
    textAlign: "right",
    color: BackgroundColor.danger,
    fontWeight: "bold",
  },

  studentInfomationContainer: {
    backgroundColor: BackgroundColor.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 10,
  },

  containerTitle: {
    fontWeight: "bold",
    fontSize: 15,
  },

  itemInfoTitle: {
    fontWeight: "bold",
  },

  itemInfoText: {
    flex: 1,
    textAlign: "right",
  },

  btnReceiveClass: {
    backgroundColor: BackgroundColor.primary,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginHorizontal: 50,
    borderRadius: 10,
  },

  btnDiableReceiveClass: {
    backgroundColor: BackgroundColor.gray_c6,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginHorizontal: 50,
    borderRadius: 10,
  },

  btnReceiveClassText: {
    color: BackgroundColor.white,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },

  buttonContainer: {
    flex: 1,
    backgroundColor: BackgroundColor.white,
    justifyContent: "center",
    borderTopColor: BorderColor.gray_30,
    borderTopWidth: 1,
  },

  relatedClassContainer: {
    backgroundColor: BackgroundColor.white,
    // marginBottom: 20,
    paddingBottom: 20,
  },

  classItem: {
    padding: 10,
    width: 350,
  },

  classList: {
    paddingBottom: 10,
    paddingHorizontal: 10,
  },

  centeredItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
