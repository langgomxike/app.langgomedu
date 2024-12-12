import React, {useContext, useEffect, useState} from "react";
import {FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {BackgroundColor} from "../../configs/ColorConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from '@expo/vector-icons/Feather';
import {NavigationContext, NavigationRouteContext,} from "@react-navigation/native";
import {ClassDetailRoute} from "../../configs/NavigationRouteTypeConfig";
import AClass from "../../apis/AClass";
import ReactAppUrl from "../../configs/ConfigUrl";
import Class from "../../models/Class";
import DetailClassSkeleton from "../components/skeleton/DetailClassSkeleton";
import {UserContext, UserType} from "../../configs/UserContext";
import ModalJoinClass from "../components/modal/ModalJoinClass";
import AStudent from "../../apis/AStudent";
import ModalConfirmJoinClass from "../components/modal/ModalConfirmJoinClass";
import LessonItem from "../components/LessonItem";
import User from "../../models/User";
import {LanguageContext} from "../../configs/LanguageConfig";
import {AccountContext} from "../../configs/AccountConfig";
import AuthorTuorInClass from "../components/AuthorTuorInClass";
import moment from "moment";
import ButtonsInDetailClass from "../components/button/ButtonsInDetailClass";
import SFirebase, {FirebaseNode} from "../../services/SFirebase";
import ScreenName from "../../constants/ScreenName";
import QRInfo from "../components/QRInfo";
import {QRItems} from "../../configs/QRConfig";
import {RoleList} from "../../models/Role";
import MembersInClass from "../components/MembersInClass";
import {AppInfoContext} from "../../configs/AppInfoContext";
import ModalDialogForClass from "../components/modal/ModalDialogForClass";
import SLog, {LogType} from "../../services/SLog";

const URL = ReactAppUrl.PUBLIC_URL;
export default function ClassDetail() {
  // navigation ----------------------------------------------------------------
  const route = useContext(NavigationRouteContext);
  const param = (route?.params as ClassDetailRoute) || new Class();

  //contexts ---------------------------------------------------------------------
  const navigation = useContext(NavigationContext);
  const languageContext = useContext(LanguageContext);
  const account = useContext(AccountContext).account;
  const user = useContext(UserContext).user;
  const appInfoContext = useContext(AppInfoContext).infos;

  // state -------------------------------------------------------------------------
  const [userId, setUserId] = useState("");
  const [classDetail, setClassDetail] = useState<Class>();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState<string | null>("");
  const [modalContent, setModalContent] = useState<{title: string, content: string}>({title:"", content: ""});
  const [classLearners, setclassLearners] = useState<User[]>([]);
  const [userChildren, setUserChildren] = useState<User[]>([]);
  const [membersInClass, setMembersInClass] = useState<User[]>([]);
  const [resultResponse, setResultResponse] = useState(false);
  const [realTimeStatus, setRealTimeStatus] = useState<number>(0);
  const [ refresh, setRefresh ] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [classFee, setClassFee] = useState(0);

  // handlers -------------------------------------------------------------------------
  function formatCurrency(amount: number, locale = "vi-VN", currency = "VND") {
    // Kiểm tra nếu không phải số, trả về chuỗi lỗi
    if (typeof amount !== "number") return "Invalid input";

    return amount.toLocaleString(locale, {
      style: "currency",
      currency,
    });
  }

  const handleJoinClass =() => {
    // Kiểm tra xem có xung đột lịch không
    const conflictClassOfUsers = userChildren.find((child) => child.id === userId && child.conflicts);
    if (conflictClassOfUsers) {
      setModalContent({
        title: languageContext.language.JOIN,
        content: languageContext.language.CANNOT_TEACH_DUE_TO_CONFLICT,
      });
      setModalVisible("modalDialogForClass");
      return;
    }

    // Kiểm tra số lượng học sinh đã đầy
    if(classLearners && classDetail && classLearners.length >= classDetail?.max_learners) {
      setModalContent({title: languageContext.language.JOIN , content:languageContext.language.CLASS_FULL_CONTACT_TEACHER})
      setModalVisible("modalDialogForClass");
      return;
    }

     // Nếu userChildren chỉ chứa chính người dùng (tức là họ không có con cái nào khác)
     const onlyUser = userChildren.length === 1 && userChildren[0].id === userId;

     setModalVisible(onlyUser ? "modalConfirmJoinClass" : "modalJoinClass");

  }

  const handleAcceptClass = () => {
    if (classDetail?.author) {
      // SMessage.createNotification("nội dung", classDetail?.author.id, () => {});
    }
    const duplicateChild = userChildren.find((child) => child.id === userId && child.conflicts);
    if (duplicateChild) {
      setModalContent({
        title: languageContext.language.JOIN,
        content: languageContext.language.CANNOT_TEACH_DUE_TO_CONFLICT,
      });
      setModalVisible("modalDialogForClass");
      return;
    }
    else{
      setModalVisible("modalConfirmJoinClass");
      return;
    }
  };

  const onRefresh = () => {
    setRefresh(true);
    if (userId) {
      // Lấy data chi tiết lớp học
      AClass.getClassDetailWithUser(param.classId,userId,
        (_class) => {
          setClassDetail(_class);
          setRefresh(false);
        }, setLoading
      )
    }
  }

  const goToUpdateClass = (membersInClass: User[]) => {
    navigation?.navigate(ScreenName.UPDATE_CLASS, { classData: classDetail, members: membersInClass  })
  }

  // effect -------------------------------------------------------------------------
  
  // Đặt lại header khi màn hình detail
  useEffect(() => {
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
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        )
      });
    }
  }, [navigation]);

  // Bật nút chỉnh sửa lớp học nếu là lớp của mình
  useEffect(()=> {
    if (navigation) {
      navigation.setOptions({
        headerRight: () => {
          if(classDetail?.author?.id === account?.id) {
            return (
            <TouchableOpacity onPress={() => goToUpdateClass(membersInClass)} style={{ paddingRight: 10 }}>
              <Feather name="edit" size={24} color="white" />
            </TouchableOpacity>
            )
          }
        }
      })
    }
  }, [account, classDetail, membersInClass])

  //Get detail class
  useEffect(() => {
    if (userId) {
      // Lấy data chi tiết lớp học
      AClass.getClassDetailWithUser(
        param.classId,
        userId,
        (_class, membersInClass) => {
          setClassDetail(_class);
          console.log("User class: ", membersInClass);
          
          setMembersInClass(membersInClass);
          if ( _class) {
            AClass.getconflictingLessonsWithClassUsers(_class.id, userId, (data) => {
              setUserChildren(data);
              
            }, setLoading)
          }

          //Get student in class
          AStudent.getStudentsInClass(
            param.classId,
            (data) => {              
              setclassLearners(data);
            },
            setLoading
          );
        },
        () => {}
      );
    }
  }, [resultResponse, userId]);

  useEffect(() => {
    if (account) {
      setUserId(account.id);
      console.log(">>> user: " + account.id);
    }
  }, [account]);

  useEffect(() => {
    if(classDetail) {
      SFirebase.track(FirebaseNode.Classes,  [{key: FirebaseNode.Id, value: classDetail.id}], () => {
        const number = Math.floor(10 + Math.random() * 90);
        console.log(">>> class detail realTimeStatus number: ", number);
         
          setRealTimeStatus(number);
        })
    }

     // Tính phí tạo lớp
  const fee = classDetail  ? classDetail.total_lessons * classDetail.price *  (classDetail.max_learners ?? 1) *
    (classDetail.author?.id === classDetail.tutor?.id
      ? appInfoContext.creation_fee_for_tutors
      : appInfoContext.creation_fee_for_parents)
  : 0;

  setClassFee(fee);
    
  }, [classDetail])

  useEffect(() => {
    // console.log("realTimeStatus: ", realTimeStatus);
    // if(classDetail) console.log(classDetail.id);
    
  }, [realTimeStatus])

  useEffect(() => {
    if (!account) return;

    const isAdmin = !!(account?.roles.map(r => r.id).includes(RoleList.SUPER_ADMIN) ||  account?.roles.map(r => r.id).includes(RoleList.ADMIN));
    setIsAdmin(isAdmin);
  }, [account]);

  // render ----------------------------------------------------------------
  return (
    <View style={styles.container}>

      <QRInfo id={classDetail?.id ?? -1} type={QRItems.CLASS} />

      {loading && <DetailClassSkeleton />}
      {!loading && classDetail && (
        <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
         showsVerticalScrollIndicator={false}>
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
                    style={[styles.itemInfoTwo, { justifyContent: "flex-end" }]}
                  >
                    <Ionicons name="calendar-outline" size={24} color="black" />
                    <Text style={styles.infoTitle}>
                      {moment(classDetail.started_at).format("DD/MM/YYYY")}
                    </Text>
                  </View>
                </View>

                <View style={[styles.line, { marginTop: 10 }]} />

                {/* max learners */}
                <View style={styles.itemInfo}>
                  <View style={styles.row}>
                    <Ionicons name="cube-outline" size={24} color="black" />
                    <Text style={styles.infoTitle}>
                      {languageContext.language.QUANTITY}
                    </Text>
                  </View>
                  <Text style={styles.itemContent}>
                    {classDetail.max_learners} {languageContext.language.PERSON}
                  </Text>
                </View>

                <View style={styles.itemInfo}>
                  <View style={styles.row}>
                  <Feather name="users" size={21} color="black" />
                    <Text style={styles.infoTitle}>
                      {languageContext.language.JOIN}
                    </Text>
                  </View>
                  <Text style={styles.itemContent}>
                    {classLearners.length} {languageContext.language.PERSON}
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
                    <Text style={styles.infoTitle}>
                      {languageContext.language.FORM}
                    </Text>
                  </View>
                  <Text style={styles.itemContent}>{classDetail.type}</Text>
                </View>

                <View style={styles.itemInfo}>
                  <View style={styles.row}>
                    <Image
                      source={require("../../../assets/images/ic_start_time.png")}
                      style={styles.icImage}
                    />
                    <Text>{languageContext.language.START_TIME}</Text>
                  </View>
                  <Text style={[styles.itemContent]}>
                    {moment(classDetail.started_at).format("DD/MM/YYYY")}
                  </Text>
                </View>

                <View style={styles.itemInfo}>
                  <View style={styles.row}>
                    <Image
                      source={require("../../../assets/images/ic_end_time.png")}
                      style={styles.icImage}
                    />
                    <Text>{languageContext.language.END_TIME}</Text>
                  </View>
                  <Text style={[styles.itemContent]}>
                    {moment(classDetail.ended_at).format("DD/MM/YYYY")}
                  </Text>
                </View>

                {/* price */}
                <View style={styles.itemInfo}>
                  <View style={styles.row}>
                    <Ionicons name="cash-outline" size={24} color="black" />
                    <Text style={styles.infoTitle}>
                      {languageContext.language.PRICE}
                    </Text>
                  </View>
                  <Text style={[styles.itemContent]}>
                    {formatCurrency(classDetail.price)}/{languageContext.language.SESSION}
                  </Text>
                </View>

                {/* address */}
                <View style={styles.itemInfo}>
                  <View style={styles.row}>
                    <Ionicons name="location-outline" size={24} color="black" />
                    <Text style={styles.infoTitle}>
                      {languageContext.language.ADDRESS}
                    </Text>
                  </View>
                  <Text style={{ color: "#999", textAlign: "right", flex: 1 }}>
                    {`${classDetail.address?.detail}, ${classDetail.address?.ward}, ${classDetail.address?.district}, ${classDetail.address?.province}`}
                  </Text>
                </View>

                <View style={[styles.line, { marginTop: 10 }]} />

                {/* class fee */}
                <View style={[styles.itemInfo, { marginTop: 20 }]}>
                  <View style={styles.row}>
                    <Text style={styles.infoTitle}>
                      {languageContext.language.CLASS_FEE}
                    </Text>
                  </View>
                  <Text style={[styles.itemContentFee]}>
                    {formatCurrency(classFee)}
                  </Text>
                </View>
              </View>

              <AuthorTuorInClass classDetail={classDetail} />

              {/* class description */}
              <View style={styles.classDescription}>
                <Text style={[styles.containerTitle, { marginBottom: 10 }]}>
                  {languageContext.language.DESCRIPTION}
                </Text>
                <Text>{classDetail.description}</Text>
              </View>

            {/* Child in class */}
            {membersInClass && membersInClass.length > 0 && 
              <View style={styles.childContainer}>
                <Text style={[styles.containerTitle, { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 }]}>
                  {languageContext.language.CLASS_CHILDREN_LIST}
                </Text>
              <MembersInClass members={membersInClass}/>
               
              </View>
            }

              {/* Các buổi học*/}
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

      {!isAdmin && classDetail && (
        <ButtonsInDetailClass
          classFee = {classFee}
          classDetail={classDetail}
          handleJoinClass={handleJoinClass}
          handleAcceptClass={handleAcceptClass}
        />
      )}

      {/* Modal for leaner */}
      {user.TYPE === UserType.LEANER && (
        <>
          {classDetail && userChildren.length > 0 && (
            <ModalJoinClass
              classId={classDetail.id}
              studentList={userChildren}
              classLearners = {classLearners.length}
              maxLearners = {classDetail.max_learners}
              visiable={modalVisible}
              onRequestClose={() => setModalVisible(null)}
              onResultValue={setResultResponse}
            />
          )}
           {classDetail && userChildren.length === 1 && userChildren[0].id === userId && (
            <ModalConfirmJoinClass
              confirmContent={languageContext.language.WANT_TO_JOIN_CLASS}
              visiable={modalVisible}
              onRequestClose={() => setModalVisible(null)}
              classId={classDetail.id}
              onResultValue={setResultResponse}
            />
          )}
        </>
      )}

      {user.TYPE === UserType.TUTOR && classDetail && (
        <ModalConfirmJoinClass
          confirmContent={languageContext.language.WANT_TO_TEACH_CLASS}
          visiable={modalVisible}
          onRequestClose={() => setModalVisible(null)}
          classId={classDetail.id}
          selectedStudents={classLearners}
          onResultValue={setResultResponse}
        />
      )}

      <ModalDialogForClass
      confirmTitle={modalContent?.title}
      confirmContent={modalContent?.content}
      imageStatus="confirm"
      visiable={modalVisible}
      onRequestCloseDialog={() => setModalVisible(null)}
      />
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

  icImage: {
    width: 24,
    height: 24,
  },

  childContainer: {
    marginBottom: 10,
    backgroundColor: BackgroundColor.white,
  }
});