import {FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native'
import React, {useCallback, useContext, useEffect, useState} from 'react'
//config
import {BackgroundColor, TextColor} from '../../configs/ColorConfig'
//icon
import Ionicons from '@expo/vector-icons/Ionicons'
import Feather from '@expo/vector-icons/Feather'
import AntDesign from '@expo/vector-icons/AntDesign'
//orther component
import HLine, {HLineType} from '../components/HLine'
import CvBox from '../components/CV/CvBox'
import ExperienceItem from '../components/CV/ExperienceItem'
import EducationItem from '../components/CV/EducationItem'
import ACV from '../../apis/ACV'
import User from '../../models/User'
import ReactAppUrl from '../../configs/ConfigUrl'
import CertificateItem from '../components/CV/CertificateItem'
import moment from 'moment'
import Address from '../../models/Address'
import {NavigationContext, NavigationRouteContext} from '@react-navigation/native'
import {LanguageContext} from '../../configs/LanguageConfig'
import {CVApprovalRoute, IdNavigationType} from '../../configs/NavigationRouteTypeConfig'
import {TouchableOpacity} from 'react-native-gesture-handler'
import Spinner from "react-native-loading-spinner-overlay";
import Rating from "../../models/Rating";
import DateTimeConfig from "../../configs/DateTimeConfig";
import SFirebase, {FirebaseNode} from "../../services/SFirebase";
import ARating from "../../apis/ARating";
import QRInfo from "../components/QRInfo";
import {QRItems} from "../../configs/QRConfig";
import ScreenName from "../../constants/ScreenName";

const star = require('../../../assets/icons/ic_star_outline.png')
const star_active = require('../../../assets/icons/ic_star.png')

export default function ViewCV() {
  //CONTEXT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const languageContext = useContext(LanguageContext);
  const navigation = useContext(NavigationContext);
  const route = useContext(NavigationRouteContext);
  const param = route?.params as CVApprovalRoute;
  const id = param.cv_id;
  console.log(param);


  //STATE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const [cv, setCV] = useState<any>();
  const [userInfo, setUserInfo] = useState<User>();
  const [birthday, setBirthday] = useState<string>('');
  const [address, setAddress] = useState<Address>();
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([new Rating(new User(), new User(), 4, "hello")]);

  const goToProfile = useCallback(() => {
    if (!userInfo) return;

    const data: IdNavigationType = {
      id: userInfo.id,
    };
    navigation?.navigate(ScreenName.PROFILE, data);
  }, [userInfo]);

  //effect
  useEffect(() => {
    // console.log(navigation);
    setLoading(true);

    if (id) {
      SFirebase.track(FirebaseNode.CVs, [{
        key: FirebaseNode.Id,
        value: id
      }], () => {
        ACV.getPersonalCV(id, (cvs) => {
          console.log(id);
          // console.log(JSON.stringify(cvs, null, 2));

          const viewCV = cvs.find(cv => cv.id === `${id}_t`) || cvs[0];
          // console.log(JSON.stringify(viewCV, null, 2));
          if (viewCV) {
            // console.log(JSON.stringify(cv, null, 2));
            setCV(viewCV);
            setUserInfo(viewCV.user);
            setAddress(viewCV.user?.address);

            if (viewCV.user) {
              const birthday = new Date(viewCV.user?.birthday);
              // const birthdayData = birthday.getDate() + '/' + (birthday.getMonth() +1) + '/' + birthday.getFullYear()
              const birthdayData = moment(birthday)
              setBirthday(birthdayData.format('DD/MM/yyyy'));
              // setBirthday(birthdayData);
            }
          }

        }, () => {
          setLoading(false);
        });
      });
    }
  }, [])

  useEffect(() => {
    if (navigation) {
      navigation.setOptions({
        title: "CV",
        headerShown: true,
        contentStyle: {
          padding: 0,
        },
        headerStyle: {
          backgroundColor: BackgroundColor.primary,
        },
        headerTintColor: "#fff",
        headerLeft: () => (
          <TouchableOpacity onPress={navigation?.goBack} style={{paddingRight: 10}}>
            <Ionicons name="chevron-back" size={24} color="white"/>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View style={{minHeight: 60}}>
            <QRInfo id={cv?.id ?? "-1"} type={QRItems.CV}/>
          </View>
        )
      });
    }
  }, [navigation, cv]);

  useEffect(() => {
    if (userInfo?.id) {
      SFirebase.track(FirebaseNode.Ratings, [], () => {
        ARating.getAllRatingsOfUser(userInfo.id, ratings => {
          setRatings(ratings);
        });
      });
    }
  }, [userInfo]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}
                style={styles.container}>
      {/* header */}
      <Spinner visible={loading}/>


      <TouchableOpacity style={styles.header} onPress={goToProfile}>
        <Image style={styles.avatar} source={{uri: ReactAppUrl.PUBLIC_URL + userInfo?.avatar}}/>
        <Text style={styles.badge}> {userInfo?.point} </Text>
        <Text style={styles.name}>{userInfo?.full_name}</Text>
        <Text style={styles.title}> {cv?.title}</Text>
      </TouchableOpacity>

      {/* main - view */}
      <View style={styles.main}>
        {/* informations */}
        <View style={styles.infor}>
          <View style={styles.inforItem}>
            {/* day of birth */}
            <View style={styles.inforItemChild}>
              <AntDesign name="calendar" size={20} color="black"/>
              <Text style={styles.inforItemText}> {birthday} </Text>
            </View>
            {/* phone number */}
            <View style={styles.inforItemChild}>
              <Feather name="phone-call" size={20} color="black"/>
              <Text style={styles.inforItemText}> {userInfo?.phone_number} </Text>
            </View>

          </View>
          {/* mail */}
          {/* <View style={styles.inforItem}>
            <View style={styles.inforItemChild}>
              <Feather name="mail" size={20} color="black" />
              <Text style={styles.inforItemText}> {userInfo?.email} </Text>
            </View>
          </View> */}
          <View style={styles.inforItem}>
            {/* interested major */}
            <View style={styles.inforItemChild}>
              <Feather name="bookmark" size={24} color="black"/>
              <Text
                style={styles.inforItemText}> {(userInfo && userInfo.interested_majors.length > 0) && userInfo.interested_majors[0].vn_name} </Text>
            </View>
          </View>
          <View style={styles.inforItem}>
            {/* location */}
            <View style={styles.inforItemChild}>
              <Ionicons name="location-outline" size={20} color="black"/>
              <Text
                style={styles.inforItemText}> {`${address?.detail}, ${address?.ward}, ${address?.district}, ${address?.province}`}</Text>
            </View>
          </View>

        </View>
        <HLine type={HLineType.LIGHT}/>
        {/* about me */}
        <View style={styles.aboutView}>
          <Text style={styles.aboutText}>
            {cv?.biography}
          </Text>
        </View>

        {/* education */}
        <View>
          <CvBox title={languageContext.language.EDUCATION}>
            <FlatList
              scrollEnabled={false}
              data={cv?.educations}
              renderItem={({item}) => <EducationItem education={item} onDelete={() => {
              }}/>}
            />

          </CvBox>
        </View>
        {/* work experience */}
        <View>
          <CvBox title={languageContext.language.WORK_EXPERIENCE}>
            <FlatList
              scrollEnabled={false}
              data={cv?.experiences}
              renderItem={({item}) => <ExperienceItem experience={item} onDelete={() => {
              }}/>}
            />
          </CvBox>
        </View>
        {/* Certificate */}
        <View>
          <CvBox title={languageContext.language.CERTIFICATE}>
            <FlatList
              scrollEnabled={false}
              data={cv?.certificates}
              renderItem={({item}) => <CertificateItem certificate={item} onDelete={() => {
              }}/>}
            />
          </CvBox>
        </View>

        {/*   ratings history */}
        {ratings?.length > 0 && <CvBox title={"Danh gia tu hoc vien"}>
          <FlatList
            nestedScrollEnabled={false}
            horizontal={true}
            data={ratings}
            keyExtractor={item => item.id + ""}
            renderItem={({item, index}) => (
              <View style={{flex: 1, marginVertical: 20,}}>
                <Pressable key={index}
                           style={[styles.btnReport, styles.btnShowdow, reportListStyle.container, {minHeight: 200}]}>
                  <View style={{flexDirection: "row"}}>
                    {[..."*".repeat(item.value)].slice(0, 5).map((r, i) => (
                      <Image key={i} source={star_active} style={{width: 15, height: 15}}/>
                    ))}

                    {[..."*".repeat(5 - item.value > 0 ? 5 - item.value : 0)].slice(0, 5).map((r, i) => (
                      <Image key={i} source={star} style={{width: 15, height: 15}}/>
                    ))}

                    <Text
                      style={reportListStyle.time}>⏰{DateTimeConfig.getDateFormat(new Date(item.created_at).getTime(), true, true)}</Text>
                  </View>

                  <View style={{flexDirection: "row", marginTop: 10,}}>
                    <Image src={ReactAppUrl.PUBLIC_URL + item.rater?.avatar} style={reportListStyle.avatar}/>

                    <View style={{flex: 1}}>
                      <Text style={reportListStyle.username}>{item.rater?.full_name}</Text>
                      <Text style={reportListStyle.content}>{item.content?.substring(0, 180)}</Text>
                    </View>
                  </View>

                </Pressable>
              </View>
            )}
          />
        </CvBox>}

      </View>
    </ScrollView>
  )
}

const reportListStyle = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 300,
    borderWidth: 0.8,
    borderColor: BackgroundColor.sub_warning,
    marginHorizontal: 10,
    marginBottom: 5,
    marginTop: 5,
    borderRadius: 20,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 35,
    borderWidth: 0.5,
    borderColor: BackgroundColor.sub_warning,
  },

  username: {
    fontWeight: "700",
    paddingHorizontal: 10,
    fontSize: 14,
  },

  content: {
    paddingHorizontal: 10,
    fontSize: 10,
  },

  level: {
    backgroundColor: BackgroundColor.warning,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 10,
    fontSize: 10,
    textAlign: "center",
    textAlignVertical: 'center',
  },

  time: {
    flex: 1,
    textAlign: "right",
    fontSize: 10,
    textAlignVertical: 'center',
    color: TextColor.black,
  }

});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.primary,
  },

  btnReport: {
    borderColor: "red",
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
    backgroundColor: BackgroundColor.white
  },

  btnShowdow: {
    shadowColor: BackgroundColor.warning,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  btnReportText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },

  header: {
    backgroundColor: BackgroundColor.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  main: {
    flex: 1,
    marginTop: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: BackgroundColor.white,
    paddingTop: 15,
    paddingHorizontal: 10
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 999,
    marginTop: 10
  },
  badge: {
    backgroundColor: BackgroundColor.schedule_leaner,
    color: TextColor.black,
    fontWeight: 'bold',
    paddingHorizontal: 25,
    paddingVertical: 3,
    borderRadius: 10,
    transform: [
      {translateY: -10}
    ]
  },
  name: {
    color: TextColor.white,
    fontWeight: 'bold',
    fontSize: 20,
  },
  title: {
    color: TextColor.white,
  },
  infor: {
    flexDirection: 'column',
    marginHorizontal: 15,
    marginTop: 10,
  },
  inforItem: {
    flexDirection: 'row',
  },
  inforItemChild: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 15,
  },
  inforItemText: {
    fontSize: 14
  },
  aboutView: {
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  aboutText: {
    fontSize: 14,
    color: TextColor.black
  }

})