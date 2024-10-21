import React, { useEffect, useState } from "react";
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

const URL = ReactAppUrl.PUBLIC_URL;
export default function ClassDetail() {
  const route: RouteProp<RootStackParamList> = useRoute();
  // Get class id
  const param = route.params;

  // state
  const [classDetail, setClassDetail] = useState<Class>();
  const [relatedClasses, setRelatedClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  // Hàm để điều hướng đến màn hình DetailClass mới
  // const navigation: NavigationProp<RootStackParamList> = useNavigation();
  // const handleNavigateToDetail = (classId: string) => {
  // navigation.navigate(ScreenName.DETAIL_CLASS, { classId }); // Truyền classId qua route params
  // };

  // handlers
  function fomatDate(timestamp: number) {
    if (!timestamp) return ""; // Kiểm tra nếu timestamp là undefined hoặc null

    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Trả về chuỗi theo định dạng DD/MM/YYYY
  }

  function formatCurrency(amount: number, locale = "vi-VN", currency = "VND") {
    // Kiểm tra nếu không phải số, trả về chuỗi lỗi
    if (typeof amount !== "number") return "Invalid input";

    return amount.toLocaleString(locale, {
      style: "currency",
      currency,
    });

    // console.log(formatCurrency(price, "en-GB", "GBP")); // "£123,456,789.00" (Anh)
    // console.log(formatCurrency(price, "ja-JP", "JPY")); // "￥123,456,789" (Nhật)
    // console.log(formatCurrency(price, "vi-VN", "VND")); // "123.456.789 ₫" (Việt Nam)
  }

  // effect
  useEffect(() => {
    AClass.getClassById(
      param.classId,
      (_class, relatedClasses) => {
        setClassDetail(_class);
        setRelatedClasses(relatedClasses);
        // console.log(">>> data find by id: ", JSON.stringify(_class, null, 2));
      },
      setLoading
    );
  }, []);

  // render
  return (
    <View style={styles.container}>
      <View style={{ flex: 9 }}>
      {loading &&
       <DetailClassSkeleton/> }
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
                    <View style={styles.itemInfoTwo}>
                      <Ionicons name="book-outline" size={24} color="black" />
                      <Text>{classDetail.class_level?.vn_name}</Text>
                    </View>

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
                      <Text>
                        {fomatDate(classDetail.started_at)}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.line, { marginTop: 10 }]}></View>

                  <View style={styles.itemInfo}>
                    <View style={styles.row}>
                      <Ionicons name="cube-outline" size={24} color="black" />
                      <Text>Số lượng</Text>
                    </View>
                    <Text style={styles.itemContent}>
                      {classDetail.max_learners}
                    </Text>
                  </View>

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

                  <View style={styles.itemInfo}>
                    <View style={styles.row}>
                      <Ionicons name="timer-outline" size={24} color="black" />
                      <Text>Thời gian</Text>
                    </View>
                    <Text style={[styles.itemContent]}>time giờ/Buổi</Text>
                  </View>

                  <View style={styles.itemInfo}>
                    <View style={styles.row}>
                      <Ionicons name="cash-outline" size={24} color="black" />
                      <Text>Học phí</Text>
                    </View>
                    <Text style={[styles.itemContent]}>
                      {formatCurrency(classDetail.price)}/Buổi
                    </Text>
                  </View>

                  <View style={styles.itemInfo}>
                    <View style={styles.row}>
                    <Ionicons name="location-outline" size={24} color="black" />
                      <Text>Địa chỉ</Text>
                    </View>
                    <Text style={[styles.itemContent]}>
                      {`${classDetail.address_4}, ${classDetail.address_3}, ${classDetail.address_2}, ${classDetail.address_1}`}
                    </Text>
                  </View>

                  <View style={[styles.line, { marginTop: 10 }]}></View>

                  <View style={[styles.itemInfo, { marginTop: 20 }]}>
                    <View style={styles.row}>
                      <Text>Phí nhận lớp</Text>
                    </View>
                    <Text style={[styles.itemContentFee]}>{formatCurrency(50000)}</Text>
                  </View>
                </View>

                {/* Stduent infomation */}
                <View style={styles.studentInfomationContainer}>
                  {/* <Text style={styles.containerTitle}>Thông tin</Text>

                <View style={[styles.itemInfo, { marginTop: 20 }]}>
                  <View style={styles.row}>
                    <Text style={styles.itemInfoTitle}>Giới tính</Text>
                  </View>
                  <Text style={styles.itemInfoText}>Nam</Text>
                </View>
                <View style={[styles.line, { marginVertical: 11 }]}></View> */}
                  <Text style={[styles.containerTitle, { marginBottom: 10 }]}>
                    Mô tả
                  </Text>
                  <Text>{classDetail.description}</Text>
                </View>

                {/* Các lớp học liên quan */}
                <View style={styles.relatedClassContainer}>
                  <Text style={[styles.containerTitle, { padding: 20 }]}>
                    Các lớp liên quan
                  </Text>
                  <FlatList
                    data={relatedClasses}
                    renderItem={({ item:relatedClass }) => (
                      <View style={styles.classItem}>
                        <Pressable>
                        <CourseItem
<<<<<<< HEAD
                              majorIconUrl={`${URL}${relatedClass.major?.icon?.path}`}
                              name={relatedClass.title}
                              level={relatedClass.class_level?.vn_name || ""}
                              date={fomatDate(relatedClass.started_at)}
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
=======
                          name={item.name}
                          level={item.level}
                          date={item.date}
                          time={item.time}
                          type={item.type}
                          address={item.address}
                          cost={item.cost}
                          majorIconUrl=""
                        />
                      </Pressable>
                    </View>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal={true}
                  showsHorizontalScrollIndicator={true}
                  contentContainerStyle={styles.classList}
                />
>>>>>>> 4ced0359b4e43884d12b28d4d68f3307644d317c
              </View>
            </View>
          </ScrollView>
        )}
      </View>
      {/* Nút bấn để nhập lớp */}
      <View style={[styles.buttonContainer, styles.shadow]}>
        <TouchableOpacity disabled={true} style={[styles.btnReceiveClass, styles.boxShadow]}>
          <Text style={styles.btnReceiveClassText}>Nhận lớp</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 20,
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