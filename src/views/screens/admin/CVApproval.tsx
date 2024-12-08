import { Text, View, StyleSheet, Image, ScrollView, FlatList, TouchableOpacity } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
//config
import { BackgroundColor, TextColor } from "../../../configs/ColorConfig";
//icon
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
//orther component
import HLine, { HLineType } from "../../components/HLine";
import CvBox from "../../components/CV/ApprovedCVBox";
import ExperienceItem from "../../components/CV/ExperienceItem";
import EducationItem from "../../components/CV/EducationItem";
import ACV from "../../../apis/ACV";
import User from "../../../models/User";
import ReactAppUrl from "../../../configs/ConfigUrl";
import CertificateItem from "../../components/CV/CertificateItem";
import moment from "moment";
import Address from "../../../models/Address";
import { NavigationContext, NavigationRouteContext } from "@react-navigation/native";
import { CVApprovalRoute } from "../../../configs/NavigationRouteTypeConfig";
import Education from "../../../models/Education";
import Experience from "../../../models/Experience";
import Certificate from "../../../models/Certificate";
import File from "../../../models/File";
import CVApprovalSkeleton from "../../components/skeleton/CVApprovalSkeleton";
import ModalApproveCVReason from "../../components/modal/ModalApproveCVReson";
import SFirebase, { FirebaseNode } from "../../../services/SFirebase";
import ScreenName from "../../../constants/ScreenName";

export default function CVApproval() {
  // context, route ----------------------------------------------------------------
  const navigation = useContext(NavigationContext);
  const route = useContext(NavigationRouteContext);
  const param = route?.params as CVApprovalRoute;
  const cvId = param.cv_id;
  // states ---------------------------------------------------------------------
  const [cv, setCV] = useState<any>();
  const [userInfo, setUserInfo] = useState<User>();
  const [birthday, setBirthday] = useState<string>("");
  const [address, setAddress] = useState<Address>();

  const [newCv, setNewCv] = useState<any>();

  const [oldEducations, setOldEducations] = useState<Education[]>([]);
  const [oldExperiences, setOldExperiences] = useState<Experience[]>([]);
  const [oldCertificates, setOldCertificates] = useState<Certificate[]>([]);

  const [newEducations, setNewEducations] = useState<Education[]>([]);
  const [newExperiences, setNewExperiences] = useState<Experience[]>([]);
  const [newCertificates, setNewCertificates] = useState<Certificate[]>([]);

  const [loading, setLoading] = useState(false);
  const [isApproved, setIsApproved] = useState<boolean>();
  const [isChange, setIsChange] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  // const [reason, setReason] = useState("");
  //handler -----------------------------------------------------------------------
  const handleConfirm = useCallback(() => {
    const cvId = newCv.id;
    const oldCvId = cv.id;
    const approveData = {
      oldCvId: oldCvId,
      cvId: cvId,
    }

    ACV.approveCV(approveData, (result) => {
      console.log(result);
      setIsApproved(result.status);
      navigation?.navigate(ScreenName.SHOW_CV, {cv_id :cv.id});
    }, (loading) => {
      console.log(loading);

    })
  }, [cv, newCv])

  const handleCancel = useCallback((reason : string)=> {
    const cvId = newCv.id;
    const oldCvId = cv.id;

    const approveData = {
      oldCvId: oldCvId,
      cvId: cvId,
      reason: reason,
    }

    ACV.denyCV(approveData, (result) => {
      console.log(result);
      setIsApproved(result.status);
      navigation?.navigate(ScreenName.SHOW_CV, {cv_id :cv.id});
    }, (loading) => {
      console.log(loading);

    })
      
  }, [cv, newCv])

  //effect ------------------------------------------------------------------------
  useEffect(() => {
    console.log(cvId);
    if (cvId) {
      ACV.getTempCV(cvId, (cvs) => {
        // console.log(JSON.stringify(cvs, null, 2));

        const cv = cvs.find(cv => cv.id === cvId.split("_")[0]);
        if (cv) {
          // console.log(cv);
          setCV(cv);
          setUserInfo(cv.user);
          setAddress(cv.user?.address);
          if (cv.user) {
            const birthday = new Date(cv.user?.birthday);
            const birthdayData = moment(birthday);
            setBirthday(birthdayData.format("DD/MM/yyyy"));
          }
          // Set Old educations, experiences, certificates
          // Tạo dữ liệu cho educations
          const newEducations = cv.educations.map((item: any) =>
            new Education(
              item.id,
              item.name,
              item.note,
              new Address(
                item.address?.id,
                item.address?.province,
                item.address?.district,
                item.address?.ward,
                item.address?.detail
              ),
              item.started_at,
              item.ended_at,
              item.evidence
                ? new File(
                  (item.evidence as File).id,
                  (item.evidence as File).name,
                  (item.evidence as File).path,
                  (item.evidence as File).ratio,
                  (item.evidence as File).created_at,
                  (item.evidence as File).updated_at
                )
                : undefined
            )
          );
          setOldEducations(newEducations);

          // Tạo dữ liệu cho experiences
          const newExperiences = cv.experiences.map((item: any) =>
            new Experience(
              item.id,
              item.name,
              item.note,
              new Address(
                item.address?.id,
                item.address?.province,
                item.address?.district,
                item.address?.ward,
                item.address?.detail
              ),
              item.started_at,
              item.ended_at,
              item.evidence
                ? new File(
                  (item.evidence as File).id,
                  (item.evidence as File).name,
                  (item.evidence as File).path,
                  (item.evidence as File).ratio,
                  (item.evidence as File).created_at,
                  (item.evidence as File).updated_at
                )
                : undefined
            )
          );
          setOldExperiences(newExperiences);

          // Tạo dữ liệu cho certificates (với score thay vì address)
          const newCertificates = cv.certificates.map((item: any) =>
            new Certificate(
              item.id,
              item.name,
              item.note,
              item.score, // Thay address bằng score
              item.valid_at,
              item.expired_at,
              item.evidence
                ? new File(
                  (item.evidence as File).id,
                  (item.evidence as File).name,
                  (item.evidence as File).path,
                  (item.evidence as File).ratio,
                  (item.evidence as File).created_at,
                  (item.evidence as File).updated_at
                )
                : undefined
            )
          );
          setOldCertificates(newCertificates);

        }
        const newCV = cvs.find(cv => cv.id === `${cvId}`);
        if (newCV) {
          setNewCv(newCV);

          // Set New educations, experiences, certificates
          // Tạo dữ liệu cho educations
          const newEducations = newCV.educations.map((item: any) =>
            new Education(
              item.id,
              item.name,
              item.note,
              new Address(
                item.address?.id,
                item.address?.province,
                item.address?.district,
                item.address?.ward,
                item.address?.detail
              ),
              item.started_at,
              item.ended_at,
              item.evidence
                ? new File(
                  (item.evidence as File).id,
                  (item.evidence as File).name,
                  (item.evidence as File).path,
                  (item.evidence as File).ratio,
                  (item.evidence as File).created_at,
                  (item.evidence as File).updated_at
                )
                : undefined
            )
          );
          setNewEducations(newEducations);

          // Tạo dữ liệu cho experiences
          const newExperiences = newCV.experiences.map((item: any) =>
            new Experience(
              item.id,
              item.name,
              item.note,
              new Address(
                item.address?.id,
                item.address?.province,
                item.address?.district,
                item.address?.ward,
                item.address?.detail
              ),
              item.started_at,
              item.ended_at,
              item.evidence
                ? new File(
                  (item.evidence as File).id,
                  (item.evidence as File).name,
                  (item.evidence as File).path,
                  (item.evidence as File).ratio,
                  (item.evidence as File).created_at,
                  (item.evidence as File).updated_at
                )
                : undefined
            )
          );
          setNewExperiences(newExperiences);

          // Tạo dữ liệu cho certificates (với score thay vì address)
          const newCertificates = newCV.certificates.map((item: any) =>
            new Certificate(
              item.id,
              item.name,
              item.note,
              item.score, // Thay address bằng score
              item.valid_at,
              item.expired_at,
              item.evidence
                ? new File(
                  (item.evidence as File).id,
                  (item.evidence as File).name,
                  (item.evidence as File).path,
                  (item.evidence as File).ratio,
                  (item.evidence as File).created_at,
                  (item.evidence as File).updated_at
                )
                : undefined
            )
          );
          setNewCertificates(newCertificates);
        }
      }, setLoading);
    }
  }, [cvId]);

  //lay firebase
  useEffect(()=> {
    const id = cvId.split('_')[0];
    SFirebase.track(FirebaseNode.CVs, [{
      key: FirebaseNode.Id,
      value: id
    }], ()=> {
      setIsChange(true)
    })
  },[])
  useEffect(()=>{
    const id = cvId.split('_')[0];
    console.log(id);
    
    if(isChange){
      // navigation?.navigate(ScreenName.SHOW_CV, {id});
    }
  }, [isChange])
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
        ),
        headerRight: () => (
          <View style={[styles.headerRight]}>
            <View style={[styles.oldBadge, styles.oldBorder, styles.oldBackground]}>
              <Text style={[styles.bagdeText,]}>CV cũ</Text>
            </View>
            <View style={[styles.newBadge, styles.newBorder, styles.newBackground]}>
              <Text style={[styles.bagdeText,]}>CV mới</Text>
            </View>
          </View>
        ),
      });
    }
  }, [navigation]);

  // Test -------------------------------
  // useEffect(()=> {
  //   console.log("newCV", JSON.stringify(newCv, null, 2));

  // }, [newCv])

  // ------------------------------------

  return (
    <View style={styles.container}>
      {loading ? <CVApprovalSkeleton /> :
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* header */}
          <View style={styles.header}>
            <Image
              style={styles.avatar}
              source={{ uri: ReactAppUrl.PUBLIC_URL + userInfo?.avatar }}
            />
            <Text style={styles.badge}> {userInfo?.point} </Text>
            <Text style={styles.name}>{userInfo?.full_name}</Text>
            {/* TITLE */}
            <View style={styles.approveTitleBox}>
              {!isApproved && <Text style={[styles.title, styles.oldBorder, styles.oldBackground]}> {cv?.title} </Text>}
              <Text style={[styles.title, styles.newBorder, styles.newBackground]}> {newCv?.title} </Text>
            </View>
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
                    {(userInfo && userInfo.interested_majors.length > 0) && userInfo.interested_majors[0].vn_name}
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
              <Text style={styles.titleText}>{"Biography"}</Text>
              <View style={[styles.approveBioBox]}>
                {!isApproved && <Text style={[styles.aboutText, styles.oldBorder]}>{cv?.biography}</Text>}
                <Text style={[styles.aboutText, styles.newBorder]}>{newCv?.biography}</Text>
              </View>
            </View>

            {/* education */}
            <View>
              <Text style={styles.approveCVText}>{"Educations"}</Text>
              <View style={styles.approveCVBox}>
                {!isApproved && <CvBox isOld={true} title="Old Education">
                  <FlatList
                    scrollEnabled={false}
                    data={oldEducations}
                    renderItem={({ item }) => <EducationItem education={item} onDelete={() => { }} />}
                  />
                </CvBox>}
                <CvBox title="New Education">
                  <FlatList
                    scrollEnabled={false}
                    data={newEducations}
                    renderItem={({ item }) => <EducationItem education={item} onDelete={() => { }} />}
                  />
                </CvBox>
              </View>
            </View>
            {/* work experience */}
            <View >
              <Text style={styles.approveCVText}>{"Word Experiences"}</Text>
              <View style={styles.approveCVBox}>
                {!isApproved && <CvBox isOld={true} title="Old Work Experience">
                  <FlatList
                    scrollEnabled={false}
                    data={oldExperiences}
                    renderItem={({ item }) => <ExperienceItem experience={item} onDelete={() => { }} />}
                  />
                </CvBox>}
                <CvBox title="New Work Experiences">
                  <FlatList
                    scrollEnabled={false}
                    data={newExperiences}
                    renderItem={({ item }) => <ExperienceItem experience={item} onDelete={() => { }} />}
                  />
                </CvBox>
              </View>
            </View>
            {/* Certificate */}
            <View>
              <Text style={styles.approveCVText}>{"Certificate"}</Text>
              <View style={styles.approveCVBox}>
                {!isApproved && <CvBox isOld={true} title="Old Certificate">
                  <FlatList
                    scrollEnabled={false}
                    data={oldCertificates}
                    renderItem={({ item }) => <CertificateItem certificate={item} onDelete={() => { }} />}
                  />
                </CvBox>}
                <CvBox title="New Certificate">
                  <FlatList
                    scrollEnabled={false}
                    data={newCertificates}
                    renderItem={({ item }) => <CertificateItem certificate={item} onDelete={() => { }} />}
                  />
                </CvBox>
              </View>
            </View>
          </View>
        </ScrollView>
      }
      <View style={styles.btnCotainer}>
        <TouchableOpacity onPress={() => { setShowModal(true) }} style={[styles.btn, styles.btnDeny]}>
          <Text style={styles.btnDenyText}>Từ Chối</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { handleConfirm() }} style={[styles.btn, styles.btnAccept]}>
          <Text style={styles.btnAcceptText}>Chấp nhận</Text>
        </TouchableOpacity>
      </View>
      <ModalApproveCVReason
        confirmTitle="Tu Choi CV"
        visiable={showModal}
        onRequestCloseDialog={()=>{setShowModal(false)}}
        onConfirm={handleCancel}
      />
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
    margin: 0,
    padding: 5,
    color: TextColor.white,
    borderWidth: 1,
    borderRadius: 5,
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
    margin: 0,
    padding: 5,
    fontSize: 14,
    color: TextColor.black,
    borderWidth: 1,
    borderRadius: 5,
  },
  approveCVBox: {
    backgroundColor: BackgroundColor.white,
    borderColor: BackgroundColor.gray_e6,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  approveCVText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  approveTitleBox: {
    backgroundColor: BackgroundColor.primary,
    borderColor: BackgroundColor.gray_e6,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  approveBioBox: {
    backgroundColor: BackgroundColor.white,
    borderColor: BackgroundColor.gray_e6,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    gap: 5,
  },
  oldBorder: {
    borderColor: BackgroundColor.warning,
  },
  oldBackground: {
    backgroundColor: BackgroundColor.warning,
  },
  newBorder: {
    borderColor: BackgroundColor.sub_primary,
  },
  newBackground: {
    backgroundColor: BackgroundColor.sub_primary,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
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
  headerRight: {
    flexDirection: 'row',
    gap: 4,
  },
  oldBadge: {
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: BackgroundColor.warning,
    borderColor: BackgroundColor.warning,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  newBadge: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  bagdeText: {
    fontSize: 12,
    color: TextColor.white,
  }
});
