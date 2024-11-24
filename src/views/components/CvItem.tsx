import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { BackgroundColor } from "../../configs/ColorConfig";
import CV from "../../models/CV";
import ReactAppUrl from "../../configs/ConfigUrl";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment";

type TutorItemProps = {
  tutorData: CV;
};
const URL = ReactAppUrl.PUBLIC_URL;

const colorItem = "#666"
export default function CvItem({ tutorData }: TutorItemProps) {
  // Render
  return (
    <View style={[styles.container, styles.boxShadow]}>
      <View style={styles.headerContainer}>
        <View style={styles.boxShadow}>
          <Image
            source={{ uri: `${URL}${tutorData.user?.avatar}` }}
            style={[styles.avatar]}
          />
          <Text style={styles.point}>100</Text>
        </View>
        <Text style={styles.tutorName}>{tutorData.user?.full_name}</Text>
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.personalInfomation}>
          {/* <View style={styles.col2}> */}
          {/* Phone */}
          <View style={[styles.infoContent]}>
            <View style={styles.item}>
              <Ionicons name="call-outline" size={20} color={colorItem} />
              <Text style={styles.subTitle}>Số điện thoại</Text>
            </View>
            <Text style={styles.contentText}>
              {tutorData.user?.phone_number}
            </Text>
          </View>

          <View style={[styles.infoContent]}>
            <View style={styles.item}>
              <Ionicons name="calendar-outline" size={20} color={colorItem} />
             <Text style={styles.subTitle}>Ngày sinh</Text>
            </View>
            <Text style={styles.contentText}>{moment(tutorData.user?.birthday).format("DD/MM/YYYY")}</Text>
          </View>
          {/* </View> */}

          <View style={{ flexDirection: "column", gap: 5, justifyContent: "space-between"}}>
            <View style={[styles.item]}>
              <Ionicons name="location-outline" size={20} color={colorItem} />
             <Text style={styles.subTitle}>Địa chỉ</Text>
            </View>
            <Text
              style={styles.contentAddress}
            >{`${tutorData.user?.address?.ward}, ${tutorData.user?.address?.district}\n${tutorData.user?.address?.province}`}</Text>
          </View>
        </View>

        {/* <View style={styles.line}></View> */}

        {/* <View style={styles.awardsContainer}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            nestedScrollEnabled={true}
          >
            {skills?.map((item, index) => (
              <Text
                key={index.toString()}
                style={[styles.awardItem, styles.boxshadow2]}
              >
                {item.vn_name}
              </Text>
            ))}
          </ScrollView>
        </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BackgroundColor.white,
    borderRadius: 20,
  },

  scrollContainer: {
    padding: 10, // Khoảng cách bên trong
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

  boxshadow2: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },

  headerContainer: {
    backgroundColor: BackgroundColor.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 999,
  },
  tutorName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    color: BackgroundColor.white,
  },

  bodyContainer: {
    backgroundColor: BackgroundColor.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  awardsContainer: {
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 20,
  },

  awardItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 10,
    marginHorizontal: 5,
    backgroundColor: BackgroundColor.white,
    borderRadius: 7,
    fontWeight: "semibold",
    borderWidth: 0.5,
    borderColor: BackgroundColor.gray_10,
  },

  line: {
    height: 1,
    backgroundColor: BackgroundColor.gray_c6,
  },

  personalInfomation: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    marginVertical: 25,
    gap: 15,
  },

  infoContent: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },

  contentImage: {
    width: 25,
    height: 25,
  },
  contentText: {
    fontSize: 14,
    textAlign: "right",
    fontWeight: "600",
    color: "#4D5267",
  },

  col2: {
    flexDirection: "row",
    gap: 10,
  },

  point: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: BackgroundColor.warning,
    fontWeight: "bold",
    color: "#fff",
    borderRadius: 20,
    textAlign: "center",
    marginTop: -15,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    gap: 5,
    fontSize: 14,
    color: "black",
  },

  contentAddress: {
    fontSize: 14,
    textAlign: "left",
    marginLeft: 5,
    fontWeight: "600",
    color: "#4D5267",
  },

  subTitle: {
    color: colorItem
  }
});
