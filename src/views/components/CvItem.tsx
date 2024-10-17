import React from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BackgroundColor } from "../../configs/ColorConfig";
import Skill from "../../models/Skill";

type TutorItemProps = {
  avatar?: string;
  userName?: string;
  phoneNumber?: string;
  email?: string;
  dayOfBirth?: Date;
  address?: string;
  skills?: Skill[];
};

export default function tutorItem({
  avatar,
  userName,
  phoneNumber,
  email,
  dayOfBirth,
  address,
  skills,
}: TutorItemProps) {
  // Render
  return (
    <View style={[styles.container, styles.boxShadow]}>
      <View style={styles.headerContainer}>
        <View style={styles.boxShadow}>
          <Image
            source={require("../../../assets/images/img_avatar_user.png")}
            style={[styles.avatar]}
          />
        </View>
        <Text style={styles.tutorName}>{userName}</Text>
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.personalInfomation}>
          <View style={styles.col2}>
            {/* Phone */}
            <View style={[styles.infoContent, { flex: 1 }]}>
              <Image
                source={require("../../../assets/images/register_icon/ic_phone (1).png")}
                style={styles.contentImage}
              />
              <Text style={styles.contentText}>{phoneNumber}</Text>
            </View>

            <View style={[styles.infoContent, { flex: 1 }]}>
              <Image
                source={require("../../../assets/images/register_icon/ic_calendar.png")}
                style={styles.contentImage}
              />
              <Text style={styles.contentText}>
                {dayOfBirth?.getDate() +
                  "/" +
                  dayOfBirth?.getMonth +
                  "/" +
                  dayOfBirth?.getFullYear}
              </Text>
            </View>
          </View>

          {/* Email */}
          <View style={styles.infoContent}>
            <Image
              source={require("../../../assets/images/register_icon/ic_mail.png")}
              style={styles.contentImage}
            />

            <Text style={styles.contentText}>{email}</Text>
          </View>

          <View style={styles.infoContent}>
            <Image
              source={require("../../../assets/images/register_icon/ic_home.png")}
              style={styles.contentImage}
            />

            <Text>{address}</Text>
          </View>
        </View>

        <View style={styles.line}></View>

        <View style={styles.awardsContainer}>
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
                {item.vnName}
              </Text>
            ))}
          </ScrollView>
        </View>
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
    marginBottom: 10,
  },
  tutorName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
    marginVertical: 25,
    gap: 18,
  },

  infoContent: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  contentImage: {
    width: 25,
    height: 25,
  },
  contentText: {
    fontSize: 14,
  },

  col2: {
    flexDirection: "row",
    gap: 10,
  },
});
