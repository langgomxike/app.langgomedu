import React, {useEffect, useState} from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import CustomInput from "../../components/Inputs/CustomInput";
import { BackgroundColor } from "../../../configs/ColorConfig";
import DetailHistoryBottonSheet from "../../components/bottom-sheet/DetailHistoryBottomSheet";


export default function HistoryAttendance () {
  // states
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);

  // handlers

  //effects
  useEffect(() => {
    alert("cal api to get histories here");
    const historyList = [
      {
        date: "08/10/2024",
        data: [
          // Thay thế "histories" bằng "data"
          { title: "Toan", price: "200.000", status: "tutor" },
          { title: "Sinh", price: "200.000", status: "tutor" },
          { title: "Anh", price: "200.000", status: "learner" },
        ],
      },
      {
        date: "07/10/2024",
        data: [
          { title: "Toan", price: "200.000", status: "learner" },
          { title: "Sinh", price: "200.000", status: "tutor" },
          { title: "Anh", price: "200.000", status: "learner" },
        ],
      },
      // {
      //   date: "06/10/2024",
      //   data: [
      //     { title: "Toan", price: "200.000", status: "tutor" },
      //     { title: "Sinh", price: "200.000", status: "tutor" },
      //     { title: "Anh", price: "200.000", status: "learner" },
      //   ],
      // },
    ];
    setHistoryList(historyList);
  }, []);

  // render
  return (
    <View style={styles.container}>
        <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
        <Text>History</Text>
        <View style={styles.queryContaienr}>
          <View style={[styles.queryDateBlock, styles.marginBottom]}>
            <View style={{ flex: 1 }}>
              <CustomInput
                label="Từ ngày"
                placeholder="08/10/2024"
                required={false}
                value={fromDate}
                onChangeText={setFromDate}
                type="date"
              />
            </View>
            <View style={{ flex: 1 }}>
              <CustomInput
                label="Đến ngày"
                placeholder="08/10/2024"
                required={false}
                value={toDate}
                onChangeText={setToDate}
                type="date"
              />
            </View>
          </View>

          <View style={styles.marginBottom}>
            <CustomInput
              label="Môn học"
              placeholder=""
              required={false}
              value={fromDate}
              onChangeText={setFromDate}
              type="text"
            />
          </View>

          <View>
            <TouchableOpacity style={styles.btnQuery}>
              <Text style={styles.btnQueryText}>Truy vấn</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.colorInfoContainer}>
          <View style={styles.colorInfoItem}>
            <View style={[styles.color, styles.tutorColor]}></View>
            <Text>Gia sư</Text>
          </View>
          <View style={styles.colorInfoItem}>
            <View style={[styles.color, styles.leanerColor]}></View>
            <Text>Người học</Text>
          </View>
        </View>

        <View style={styles.historyContainer}>
          <FlatList
            data={historyList}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={[styles.sectionContainer, styles.boxShadow]}>
                {/* Hiển thị ngày */}
                <View style={styles.headerContainer}>
                  <Text style={styles.headerText}>{item.date}</Text>
                </View>

                {/* FlatList bên trong để hiển thị các giao dịch của ngày */}
                <FlatList
                  scrollEnabled={false}
                  data={item.data}
                  keyExtractor={(subItem, subIndex) => subIndex.toString()}
                  renderItem={({ item: subItem }) => (
                    <View
                      style={[
                        styles.itemContainer,
                        subItem.status == "tutor"
                          ? styles.tutorBorderRight
                          : styles.learnerBorderRight,
                      ]}
                    >
                        <TouchableOpacity activeOpacity={0.5} onPress={() => setIsVisible(true)}>
                      <View style={styles.itemContentContainer}>

                       
                        <View style={styles.subjectContainer}>
                          <Image
                            source={{
                              uri: "https://cdn-icons-png.flaticon.com/128/15311/15311632.png",
                            }}
                            style={styles.subjectImage}
                          />
                          <Text style={styles.title}>{subItem.title}</Text>
                        </View>

                        <Text style={styles.price}>{subItem.price}</Text>

                      </View>
                      <View style={styles.itemBadgeContainer}>
                        <Text style={[styles.badge, styles.payText]}>
                          Thanh toán
                        </Text>
                        <Text style={[styles.badge, styles.attendedText]}>
                          Điểm danh
                        </Text>
                      </View>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            )}
          />
        </View>
      </ScrollView>
      <DetailHistoryBottonSheet
      isVisible={isVisible}
      onCloseButtonSheet={() => setIsVisible(false)}
      />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },

  queryContaienr: {
    marginTop: 20,
    paddingHorizontal: 20,
  },

  queryDateBlock: {
    flexDirection: "row",
    gap: 20,
  },

  marginBottom: {
    marginBottom: 20,
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

  btnQuery: {
    backgroundColor: BackgroundColor.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
  },

  btnQueryText: {
    color: BackgroundColor.white,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },

  colorInfoContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 30,
    marginTop: 30,
  },

  colorInfoItem: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  color: {
    width: 25,
    height: 10,
    borderRadius: 999
  },

  tutorColor: {
    backgroundColor: "#76E5D8",
  },

  leanerColor: {
    backgroundColor: "#FD9011",
  },

  historyContainer: {
    marginVertical: 20,
  },

  sectionContainer: {
    borderColor: "#CFDFF9",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 20,
    backgroundColor: BackgroundColor.white,
  },

  headerContainer: {
    backgroundColor: "#E8EEFE",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  itemContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CFDFF9",
    borderRightWidth: 3,
  },

  itemContentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
  },

  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#33B55D",
  },

  tutorBorderRight: {
    borderRightColor: "#76E5D8",
  },

  learnerBorderRight: {
    borderRightColor: "#FD9011",
  },

  itemBadgeContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },

  subjectContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  subjectImage: {
    width: 35,
    height: 35,
  },

  badge: {
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 3,
    fontSize: 12,
  },

  payText: {
    backgroundColor: BackgroundColor.warning,
    color: BackgroundColor.black,
    fontWeight: 500,
  },

  attendedText: {
    backgroundColor: BackgroundColor.primary,
    color: BackgroundColor.white,
    fontWeight: 500,
  },
});
