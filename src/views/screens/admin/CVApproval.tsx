import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
//config
import { BackgroundColor, TextColor } from "../../../configs/ColorConfig";
//icon
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
//orther component
import HLine, { HLineType } from "../../components/HLine";
import CvBox from "../../components/CV/CvBox";
import ExperienceItem from "../../components/CV/ExperienceItem";
import EducationItem from "../../components/CV/EducationItem";
import ACV from "../../../apis/ACV";
import CV from "../../../models/CV";
import { UserContext } from "../../../configs/UserContext";
import User from "../../../models/User";
import Education from "../../../models/Education";
import Experience from "../../../models/Experience";
import ReactAppUrl from "../../../configs/ConfigUrl";
import CertificateItem from "../../components/CV/CertificateItem";
import Major from "../../../models/Major";
import moment from "moment";
import Address from "../../../models/Address";
import { NavigationContext, NavigationRouteContext } from "@react-navigation/native";
import { CVApprovalRoute } from "../../../configs/NavigationRouteTypeConfig";

export default function CVApproval() {
  // context, route ----------------------------------------------------------------
  const navigation = useContext(NavigationContext);
  const route = useContext(NavigationRouteContext);
  const param = route?.params as CVApprovalRoute;

  // states ---------------------------------------------------------------------
  const [cv, setCV] = useState<CV>();
  const [userInfo, setUserInfo] = useState<User>();
  const [birthday, setBirthday] = useState<string>("");
  const [address, setAddress] = useState<Address>();

  //effect ------------------------------------------------------------------------
  useEffect(() => {
    if(param.cv_id) {
      ACV.getPersonalCV(param.cv_id, (cv) => {
        if (cv) {
          // console.log(cv);
  
          setCV(cv);
          setUserInfo(cv.user);
          setAddress(cv.user?.address);
  
          if (cv.user) {
            const birthday = new Date(cv.user?.birthday);
            // const birthdayData = birthday.getDate() + '/' + (birthday.getMonth() +1) + '/' + birthday.getFullYear()
            const birthdayData = moment(birthday);
            setBirthday(birthdayData.format("DD/MM/yyyy"));
            // setBirthday(birthdayData);
          }
        }
      });
    }
  }, [param.cv_id]);

  // Đặt lại title của header khi màn hình được hiển thị
  useEffect(() => {
    if (navigation) {
      navigation.setOptions({
        title: "Duyệt CV",
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
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* header */}
        <View style={styles.header}>
          <Image
            style={styles.avatar}
            source={{ uri: ReactAppUrl.PUBLIC_URL + userInfo?.avatar }}
          />
          <Text style={styles.badge}> {userInfo?.point} </Text>
          <Text style={styles.name}>{userInfo?.full_name}</Text>
          <Text style={styles.title}> {cv?.title}</Text>
        </View>
        {/* main - view */}
        <View style={styles.main}>
          {/* informations */}
          <View style={styles.infor}>
            <View style={styles.inforItem}>
              {/* day of birth */}
              <View style={styles.inforItemChild}>
                <AntDesign name="calendar" size={20} color="black" />
                <Text style={styles.inforItemText}> {birthday} </Text>
              </View>
              {/* phone number */}
              <View style={styles.inforItemChild}>
                <Feather name="phone-call" size={20} color="black" />
                <Text style={styles.inforItemText}>
                  {" "}
                  {userInfo?.phone_number}{" "}
                </Text>
              </View>
            </View>
            <View style={styles.inforItem}>
              {/* interested major */}
              <View style={styles.inforItemChild}>
                <Feather name="bookmark" size={24} color="black" />
                <Text style={styles.inforItemText}>
                  {" "}
                  {userInfo && userInfo.interested_majors[0].vn_name}{" "}
                </Text>
              </View>
            </View>
            <View style={styles.inforItem}>
              {/* location */}
              <View style={styles.inforItemChild}>
                <Ionicons name="location-outline" size={20} color="black" />
                <Text style={styles.inforItemText}>
                  {" "}
                  {`${address?.detail}, ${address?.ward}, ${address?.district}, ${address?.province}`}
                </Text>
              </View>
            </View>
          </View>
          <HLine type={HLineType.LIGHT} />
          {/* about me */}
          <View style={styles.aboutView}>
            <Text style={styles.aboutText}>{cv?.biography}</Text>
          </View>

          {/* education */}
          <View>
            <CvBox title="Education">
              <FlatList
                scrollEnabled={false}
                data={cv?.educations}
                renderItem={({ item }) => <EducationItem education={item} />}
              />
            </CvBox>
          </View>
          {/* work experience */}
          <View>
            <CvBox title="Work Experience">
              <FlatList
                scrollEnabled={false}
                data={cv?.experiences}
                renderItem={({ item }) => <ExperienceItem experience={item} />}
              />
            </CvBox>
          </View>
          {/* Certificate */}
          <View>
            <CvBox title="Certificate">
              <FlatList
                scrollEnabled={false}
                data={cv?.certificates}
                renderItem={({ item }) => (
                  <CertificateItem certificate={item} />
                )}
              />
            </CvBox>
          </View>
        </View>
      </ScrollView>
      <View style={styles.btnCotainer}>
        <TouchableOpacity style={[styles.btn, styles.btnDeny]}>
          <Text style={styles.btnDenyText}>Từ Chối</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnAccept]}>
          <Text style={styles.btnAcceptText}>Chấp nhận</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.primary,
  },

  header: {
    backgroundColor: BackgroundColor.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  main: {
    marginTop: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: BackgroundColor.white,
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 999,
    marginTop: 10,
  },
  badge: {
    backgroundColor: BackgroundColor.schedule_leaner,
    color: TextColor.black,
    fontWeight: "bold",
    paddingHorizontal: 25,
    paddingVertical: 3,
    borderRadius: 10,
    transform: [{ translateY: -10 }],
  },
  name: {
    color: TextColor.white,
    fontWeight: "bold",
    fontSize: 20,
  },
  title: {
    color: TextColor.white,
  },
  infor: {
    flexDirection: "column",
    marginHorizontal: 15,
    marginTop: 10,
  },
  inforItem: {
    flexDirection: "row",
  },
  inforItemChild: {
    flexDirection: "row",
    flex: 1,
    marginBottom: 15,
  },
  inforItemText: {
    fontSize: 14,
  },
  aboutView: {
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  aboutText: {
    fontSize: 14,
    color: TextColor.black,
  },

  btnCotainer: {
    flexDirection: "row",
    gap: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: BackgroundColor.white,
    borderTopWidth: 2,
    borderTopColor: BackgroundColor.gray_e6
  },

  btn: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 20,
    alignItems: "center",
    borderRadius: 8,
  },

  btnDeny: {
    borderWidth: 1,
    borderColor: "#ff0000",
  },

  btnDenyText: {
    color: "#ff0000",
  },

  btnAccept: {
    backgroundColor: BackgroundColor.primary,
  },

  btnAcceptText: {
    color: BackgroundColor.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
