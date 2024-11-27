import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { BackgroundColor, BorderColor } from "../../configs/ColorConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  NavigationContext,
  NavigationRouteContext,
} from "@react-navigation/native";
import { ClassDetailRoute } from "../../configs/NavigationRouteTypeConfig";
import AClass from "../../apis/AClass";
import ReactAppUrl from "../../configs/ConfigUrl";
import Class from "../../models/Class";
import DetailClassSkeleton from "../components/skeleton/DetailClassSkeleton";
import { UserContext, UserType } from "../../configs/UserContext";
import ModalJoinClass from "../components/modal/ModalJoinClass";
import AStudent from "../../apis/AStudent";
import ModalConfirmJoinClass from "../components/modal/ModalConfirmJoinClass";
import LessonItem from "../components/LessonItem";
import DateTimeConfig from "../../configs/DateTimeConfig";
import User from "../../models/User";
import { LanguageContext } from "../../configs/LanguageConfig";
import { AccountContext } from "../../configs/AccountConfig";
import AuthorTuorInClass from "../components/AuthorTuorInClass";

const URL = ReactAppUrl.PUBLIC_URL;
export default function ClassDetail() {
  const route = useContext(NavigationRouteContext);
  const param = (route?.params as ClassDetailRoute) || new Class();

  // Get class id

  //contexts
  const navigation = useContext(NavigationContext);
  const languageContext = useContext(LanguageContext);
  const account = useContext(AccountContext).account;
  const user = useContext(UserContext).user;

  // state
  const [userId, setUserId] = useState("");
  const [classDetail, setClassDetail] = useState<Class>();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState<string | null>("");
  const [classLearners, setclassLearners] = useState<User[]>([]);
  const [resultResponse, setResultResponse] = useState(false);

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
      classLearners.length > 0 ? "modalJoinClass" : "modalConfirmJoinClass"
    );
  }, [classLearners]);

  const handleAcceptClass = () => {
    setModalVisible("modalConfirmJoinClass");
  };

  // effect
  useEffect(() => {
    //Get detail class
    if (userId) {
      AClass.getClassDetailWithUser(
        param.classId,
        userId,
        (_class) => {
          setClassDetail(_class);
          // console.log("Detail class", JSON.stringify(_class, null, 2));
        },
        setLoading
      );
      if (user.TYPE === UserType.LEANER) {
        //Get student class belongs to user for leaner
        console.log(
          ">>>Get student class belongs to user for leaner: user id: ",
          userId
        );

        AStudent.getStudentBelongsToUser(
          userId,
          (data) => {
            setclassLearners(data);
          },
          setLoading
        );
      } else {
        //Get student in class for tutor
        AStudent.getStudentsInClass(
          param.classId,
          (data) => {
            setclassLearners(data);
          },
          setLoading
        );
      }
    }
  }, [resultResponse, userId]);

  useEffect(() => {
    // Đặt lại title của header khi màn hình được hiển thị
    if (navigation) {
      navigation.setOptions({
        title: languageContext.language.CLASS_DETAILS,
        headerShown: true,
        contentStyle: {
          padding: 0,
        },
        headerStyle: {
          backgroundColor: BackgroundColor.primary,
        },
        headerTintColor: "#fff",
      });
    }
  }, [navigation]);

  useEffect(() => {
    if (account) {
      setUserId(account.id);
      console.log(">>> user: " + account.id);
    }
  }, [account]);

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
                      uri: `${URL}${classDetail?.major?.icon}`,
                    }}
                    style={styles.headerImage}
                  />
                </View>
                <Text style={styles.headerTitle}>
                  {languageContext.language.TYPE === "vi"
                    ? classDetail.major?.vn_name
                    : languageContext.language.TYPE === "en"
                    ? classDetail.major?.en_name
                    : classDetail.major?.ja_name}
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
                      <Text style={styles.infoTitle}>
                        {languageContext.language.TYPE === "vi"
                          ? classDetail.class_level?.vn_name
                          : languageContext.language.TYPE === "en"
                          ? classDetail.class_level?.en_name
                          : classDetail.class_level?.ja_name}
                      </Text>
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
                      <Text style={styles.infoTitle}>
                        {DateTimeConfig.getDateFormat(classDetail.started_at)}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.line, { marginTop: 10 }]} />

                  {/* max learners */}
                  <View style={styles.itemInfo}>
                    <View style={styles.row}>
                      <Ionicons name="cube-outline" size={24} color="black" />
                      <Text style={styles.infoTitle}>{languageContext.language.QUANTITY}</Text>
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
                      <Text style={styles.infoTitle}>{languageContext.language.FORM}</Text>
                    </View>
                    <Text style={styles.itemContent}>{classDetail.type}</Text>
                  </View>

                  {/* time each lesson */}
                  <View style={styles.itemInfo}>
                    <View style={styles.row}>
                      <Ionicons name="timer-outline" size={24} color="black" />
                      <Text style={styles.infoTitle}>{languageContext.language.TIME}</Text>
                    </View>
                    <Text style={[styles.itemContent]}>time giờ/Buổi</Text>
                  </View>

                  {/* price */}
                  <View style={styles.itemInfo}>
                    <View style={styles.row}>
                      <Ionicons name="cash-outline" size={24} color="black" />
                      <Text style={styles.infoTitle}>{languageContext.language.PRICE}</Text>
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
                      <Text style={styles.infoTitle}>{languageContext.language.ADDRESS}</Text>
                    </View>
                    <Text style={{color: "#999", textAlign: "right", flex: 1}}>
                      {`${classDetail.address?.detail}, ${classDetail.address?.ward}, ${classDetail.address?.district}, ${classDetail.address?.province}`}
                    </Text>
                  </View>

                  <View style={[styles.line, { marginTop: 10 }]} />

                  {/* class fee */}
                  <View style={[styles.itemInfo, { marginTop: 20 }]}>
                    <View style={styles.row}>
                      <Text style={styles.infoTitle}>{languageContext.language.CLASS_FEE}</Text>
                    </View>
                    <Text style={[styles.itemContentFee]}>
                      {formatCurrency(50000)}
                    </Text>
                  </View>
                </View>

                <AuthorTuorInClass classDetail={classDetail}/>

                {/* class description */}
                <View style={styles.classDescription}>
                  <Text style={[styles.containerTitle, { marginBottom: 10 }]}>
                    {languageContext.language.DESCRIPTION}
                  </Text>
                  <Text>{classDetail.description}</Text>
                </View>

                {/* Các lớp học liên quan */}
                <View style={styles.lessonContainer}>
                  <Text style={[styles.containerTitle, { padding: 20 }]}>
                    {languageContext.language.LESSONS}
                  </Text>

                  <FlatList
                    scrollEnabled={false}
                    // horizontal={true}
                    data={classDetail.lessons}
                    renderItem={({ item: lesson }) => {
                      return <LessonItem lessonData={lesson} />;
                    }}
                    contentContainerStyle={{ paddingHorizontal: 15 }}
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
                classDetail?.tutor?.id === userId ||
                classDetail?.author?.id === userId
              }
              onPress={handleJoinClass}
              style={[
                classDetail?.user_status === "member" ||
                classDetail?.tutor?.id === userId ||
                classDetail?.author?.id === userId
                  ? styles.btnDiableReceiveClass
                  : styles.btnReceiveClass,
                styles.boxShadow,
              ]}
            >
              <Text style={styles.btnReceiveClassText}>
                {classDetail?.user_status === "member"
                  ? "Bạn đã tham gia lớp học"
                  : classDetail?.tutor?.id === userId
                  ? "Bạn đã dạy lớp này"
                  : classDetail?.author?.id === userId
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
                classDetail?.author?.id === userId ||
                classDetail?.user_status === "member"
              }
              onPress={handleAcceptClass}
              style={[
                classDetail?.user_status === "tutor" ||
                classDetail?.author?.id === userId ||
                classDetail?.user_status === "member"
                  ? styles.btnDiableReceiveClass
                  : styles.btnReceiveClass,
                styles.boxShadow,
              ]}
            >
              <Text style={styles.btnReceiveClassText}>
                {classDetail?.user_status === "tutor"
                  ? "Đã nhập lớp"
                  : classDetail?.author?.id === userId
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
          {classDetail && classLearners.length > 0 && (
            <ModalJoinClass
              classId={classDetail.id}
              studentList={classLearners}
              visiable={modalVisible}
              onRequestClose={() => setModalVisible(null)}
              onResultValue={setResultResponse}
            />
          )}
          {classDetail && classLearners.length < 0 && (
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
              selectedStudents={classLearners}
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

  infoTitle: {
    // fontWeight: "500",
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

  // Class info container
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

  // class description
  classDescription: {
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

  lessonContainer: {
    backgroundColor: BackgroundColor.white,
    paddingBottom: 10,
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
