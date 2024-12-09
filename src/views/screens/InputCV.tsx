import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BackLayout from "../layouts/Back";
import Ionicons from "@expo/vector-icons/Ionicons";
import FloatingBack from "../components/FloatingBack";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import {
  BarcodeScanningResult,
  Camera,
  useCameraPermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useContext, useEffect, useState } from "react";
import SLog, { LogType } from "../../services/SLog";
import CustomInput from "../components/Inputs/CustomInput";
import Input from "../components/Inputs/CVInput";
import DatePickerInput from "../components/Inputs/DatePickerInput";
import CvBoxEdit from "../components/CV/CVBoxEdit";
import ACV from "../../apis/ACV";
import { UserContext } from "../../configs/UserContext";
import CV from "../../models/CV";
import User from "../../models/User";
import Major from "../../models/Major";
import moment from 'moment';
import { BackgroundColor, BorderColor } from "../../configs/ColorConfig";
import Address from "../../models/Address";
import EducationItem from "../components/CV/EducationItem";
import ExperienceItem from "../components/CV/ExperienceItem";
import CertificateItem from "../components/CV/CertificateItem";
import Education from "../../models/Education";
import Experience from "../../models/Experience";
import Certificate from "../../models/Certificate";
import AEducation from "../../apis/AEducation";
import AExperience from "../../apis/AExperience";
import ACertificate from "../../apis/ACertificate";
import File from "../../models/File";
import ModalAlertUpdateCV from "../components/modal/ModalAlertUpdateCV";
import { NavigationContext } from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";
import { AccountContext } from "../../configs/AccountConfig";
import { LanguageContext } from "../../configs/LanguageConfig";
import ReactAppUrl from "../../configs/ConfigUrl";

const AVATAR_SIZE = 100;

const upload = async (
  uploadFunc: typeof AEducation.uploadFiles | typeof AExperience.uploadFiles | typeof ACertificate.uploadFiles,
  formData: FormData,
) => {
  return new Promise((resolve, reject) => {
    uploadFunc(formData,
      (data) => resolve(data),
      (loading) => console.log(`Loading: ${loading}`)
    )
  })
}

export default function InputCVScreen() {
  //context
  const languageContext = useContext(LanguageContext);
  const account = useContext(AccountContext).account;
  const navigation = useContext(NavigationContext);

  //STATES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const [permission, requestPermission] = useCameraPermissions();
  const [cv, setCV] = useState<any>();
  const [cvId, setCVId] = useState<string>('');
  const [userInfo, setUserInfo] = useState<User>();
  //dữ liệu trên input
  const [title, setTitle] = useState<string>("");
  const [biography, setBiography] = useState<string>("");
  const [educations, setEducations] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  const [eduImages, setEduImages] = useState<any[]>([]);
  const [expImages, setExpImages] = useState<any[]>([]);
  const [cerImages, setCerImages] = useState<any[]>([]);
  // const [newExperiences, ]

  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [navigateToAccount, setNavigateToAccount] = useState(false);
  const [titleError, setTilteError] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [hasChange, setHasChange] = useState(false);

  //END_STATES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


  //HANDLERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const pickImage = useCallback(() => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    })
      .then((result) => {
        SLog.log(LogType.Info, "ImagePicker", "process result", result);

        if (!result.canceled) {
          return Camera.scanFromURLAsync(result.assets[0].uri);
        }
        return [];
      })
      .then((value: BarcodeScanningResult[]) => {
        SLog.log(
          LogType.Info,
          "BarcodeScanningResult",
          "process result",
          value
        );
      });
  }, [permission]);

  const handleSetBoxItem = useCallback((data: any) => {

    if (data instanceof Education) {
      setEducations((prev) => [...prev, data]);
    } else if (data instanceof Experience) {
      setExperiences((prev) => [...prev, data]);
    } else if (data instanceof Certificate) {
      setCertificates((prev) => [...prev, data]);
    }
  },
    []); /* Không cần thêm state vào dependency do dùng callback trong `setState` */

  const handleSetBoxImages = useCallback((data: any, type: "education" | "experience" | "certificate") => {
    switch (type) {
      case "education":
        setEduImages((eduImages) => [...eduImages, data]);
        break;
      case "experience":
        setExpImages((expImages) => [...expImages, data]);
        break;
      case "certificate":
        setCerImages((cerImages) => [...cerImages, data])
        break;

      default:
        break;
    }
  }, [])

  ///
  const handleConfirm = useCallback(async () => {
    if (validate()) {
      console.log(titleError);
      return;
    }
    setIsProcessing(true);
    //validation
    // validate();

    // Step 1: save Images
    const educationFiles = new FormData();
    const experienceFiles = new FormData();
    const certificateFiles = new FormData();

    eduImages.forEach((image) =>
      educationFiles.append("files", {
        uri: image.uri,
        type: image.type,
        name: image.name,
      } as any)
    );
    expImages.forEach((image) =>
      experienceFiles.append("files", {
        uri: image.uri,
        type: image.type,
        name: image.name,
      } as any)
    );
    cerImages.forEach((image) =>
      certificateFiles.append("files", {
        uri: image.uri,
        type: image.type,
        name: image.name,
      } as any)
    );

    try {
      let educationResults: number[] = [], experienceResults: number[] = [], certificateResults: number[] = [];

      if (eduImages.length > 0) {
        console.log("Đang tải file Education...");
        const result = await upload(AEducation.uploadFiles, educationFiles);
        educationResults = (result as any).educationIds as number[];
        console.log("Kết quả Education:", educationResults);
      } else {
        console.log("Không có file Education để tải lên.");
      }

      if (expImages.length > 0) {
        console.log("Đang tải file Experience...");
        const result = await upload(AExperience.uploadFiles, experienceFiles);
        experienceResults = (result as any).experienceIds as number[];
        console.log("Kết quả Experience:", experienceResults);
      } else {
        console.log("Không có file Experience để tải lên.");
      }

      if (cerImages.length > 0) {
        console.log("Đang tải file Certificate...");
        const result = await upload(ACertificate.uploadFiles, certificateFiles);
        certificateResults = (result as any).certificateIds as number[];
        console.log("Kết quả Certificate:", certificateResults);
      } else {
        console.log("Không có file Certificate để tải lên.");
      }

      const oldEducations = educations.filter((education) => education.id !== -1);
      const newEducations = educations.filter((education) => education.id === -1);
      const oldExperiences = experiences.filter((experience) => experience.id !== -1);
      const newExperiences = experiences.filter((experience) => experience.id === -1);
      const oldCertificates = certificates.filter((certificate) => certificate.id !== -1);
      const newCertificates = certificates.filter((certificate) => certificate.id === -1);

      const newEduData = newEducations.map((newEdu, index) => {
        return newEdu.toInsertObjectWithEvidence(educationResults[index]);
      })
      const newExpData = newExperiences.map((newExp, index) => {
        return newExp.toInsertObjectWithEvidenceId(experienceResults[index])
      })
      const newCerData = newCertificates.map((newCer, index) => {
        return newCer.toInsertObjectWithEvidenceId(certificateResults[index])
      })
      const insertCV = {
        userId: cv?.user?.id,
        title: cv?.title,
        biography: cv?.biography,
        oldEducations: oldEducations.length > 0 ? oldEducations.map(item => item.toInsertObject()) : [],
        newEducations: newEduData.length > 0 ? newEduData : [],
        oldExperiences: oldExperiences.length > 0 ? oldExperiences.map(item => item.toInsertObject()) : [],
        newExperiences: newExpData.length > 0 ? newExpData : [],
        oldCertificates: oldCertificates.length > 0 ? oldCertificates.map(item => item.toInsertObject()) : [],
        newCertificates: newCerData.length > 0 ? newCerData : [],
      };

      console.log("Dữ liệu CV chuẩn bị upload:", JSON.stringify(insertCV, null, 2));
      ACV.sendRequestCV(insertCV, (data) => {
        console.log("update cv thành công: ", data);
        setShowAlert(true);
      }, (loading) => {
        setIsProcessing(false);
      })
      // setIsProcessing(true);


    } catch (error) {
      console.error("Lỗi trong quá trình tải file:", error);
    }
  }, [title, biography, eduImages, expImages, cerImages, cv, educations, experiences, certificates, isProcessing, titleError]);

  // VALIDATE
  const validate = useCallback(() => {

    setTilteError(title.trim() === "");
    return title.trim() === "";
  }, [title, titleError])

  //EFFECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //lấy dữ liệu CV về để hiển thị
  useEffect(() => {
    if (account && account.roles.some(role => role.id !== 6)) {
      // console.log(account?.roles);
      ACV.getPersonalCV(account.id, (cvs) => {
        const viewCv = cvs.find(cv => cv.id === `${account.id}_t`) ? cvs.find(cv => cv.id === `${account.id}_t`) : cvs[0];

        if (viewCv === undefined) {
          setCVId(account.id);
          setUserInfo(account);
          setIsNew(true);
        }
        else if (viewCv) {
          setCVId(viewCv.id);
          const cvData = new CV(
            viewCv.id,
            viewCv.user,
            viewCv.biography,
            viewCv.title,
            viewCv.approved_at,
            viewCv.updated_at,
            viewCv.certificates,
            viewCv.educations,
            viewCv.experiences
          )
          setCV(cvData);
          setUserInfo(viewCv.user);
          //gán giá trị vào các input fields
          setTitle(viewCv.title);
          setBiography(viewCv.biography);

          // Tạo dữ liệu cho educations
          const newEducations = viewCv.educations.map((item: any) =>
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
          setEducations(newEducations);

          // Tạo dữ liệu cho experiences
          const newExperiences = viewCv.experiences.map((item: any) =>
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
          setExperiences(newExperiences);

          // Tạo dữ liệu cho certificates (với score thay vì address)
          const newCertificates = viewCv.certificates.map((item: any) =>
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
          setCertificates(newCertificates);

          if (viewCv.id === `${account.id}_t`) {
            setCVId(viewCv.id);
            setShowAlert(true);
          }
        }
        else {
          setShowAlert(true)
        }
        // console.log(JSON.stringify(account, null, 2));

      }, ()=>{})
      setNavigateToAccount(false)
      setHasChange(false);
    } else {
      setNavigateToAccount(true);
      setShowAlert(true);
    }
  }, [])

  // Đặt lại title của header khi màn hình được hiển thị
  useEffect(() => {
    if (navigation && isNew) {
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
          <TouchableOpacity onPress={() => navigation.navigate(ScreenName.ACCOUNT)} style={{ paddingRight: 10 }}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        )
      });
    }
  }, [navigation, isNew]);

  // kiểm tra đã thay đổi dữ liệu của các field, nếu chưa thì disable button
  useEffect(() => {
    if (!isProcessing && title && biography) {
      const isDifferent = title !== cv.title ||
        biography !== cv.biography
      setHasChange(isDifferent)
    }
  }, [title, biography, educations, experiences, certificates, isProcessing])

  //testing >>------------------------------------<<
  
  //VIEW >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  return (
    <View style={styles.container}>
      <ScrollView style={[styles.scrollviewContainer]} showsVerticalScrollIndicator={false}>
        <View>
          <TouchableOpacity style={{ alignSelf: "center" }} onPress={pickImage}>
            <Image
              source={{ uri: `${ReactAppUrl.PUBLIC_URL}${account?.avatar}` }}
              style={styles.avatar}
            />
          </TouchableOpacity>

          <Input
            label={languageContext.language.WORKING_TITLE}
            onTextChange={setTitle}
            placeholder={languageContext.language.WORKING_TITLE}
            value={title}
            require={true}
            editable={true}
            error={titleError}
          />

          <Input
            label={languageContext.language.BIOGRAPHY}
            onTextChange={setBiography}
            placeholder={languageContext.language.PLACEHOLDER_BIO}
            value={biography}
            textArea={true}
            editable={true}
          />


          <CvBoxEdit
            typeItem="education"
            onAddItem={handleSetBoxItem}
            onAddImage={handleSetBoxImages}
            title={languageContext.language.EDUCATION}>
            <FlatList
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              data={educations}
              renderItem={({ item }) => <EducationItem
                education={item}
                isEdit={true}
                onDelete={(education) => {
                  setEducations(prevItems => prevItems.filter(item => item.id !== education.id))
                }} />}
            />
          </CvBoxEdit>


          <CvBoxEdit
            typeItem="experience"
            onAddItem={handleSetBoxItem}
            onAddImage={handleSetBoxImages}
            title={languageContext.language.WORK_EXPERIENCE}>
            <FlatList
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              data={experiences}
              renderItem={({ item }) => <ExperienceItem
                experience={item}
                isEdit={true}
                onDelete={(experience) => { setExperiences(prevItems => prevItems.filter(prevItem => prevItem.id !== experience.id)) }} />}
            />
          </CvBoxEdit>
          <CvBoxEdit
            typeItem="certificate"
            onAddItem={handleSetBoxItem}
            onAddImage={handleSetBoxImages}
            title={languageContext.language.CERTIFICATE}>
            <FlatList
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              data={certificates}
              renderItem={({ item }) => <CertificateItem
                certificate={item}
                isEdit={true}
                onDelete={(certificate) => { setCertificates(prevItems => prevItems.filter(item => item.id !== certificate.id)) }} />}
            />
          </CvBoxEdit>
        </View>
      </ScrollView>
      <View style={[styles.buttonContainer]}>
        <TouchableOpacity
          disabled={!hasChange}
          onPress={handleConfirm}
          style={[styles.btn, styles.boxShadow, !hasChange && styles.btnDisable]}
        >
          <Text style={styles.btnText}>
            {languageContext.language.CONFIRM}
          </Text>
        </TouchableOpacity>
      </View>
      <ModalAlertUpdateCV
        confirmTitle={languageContext.language.ANNOUNCE}
        confirmContent={!navigateToAccount ? languageContext.language.INPUT_CV_ALERT : languageContext.language.DENY_CV_CHILD_ALERT }
        imageStatus="success"
        onRequestCloseDialog={() => {
          setShowAlert(false)
          navigation?.navigate(navigateToAccount ? ScreenName.ACCOUNT : ScreenName.SETTING_PERSONAL_CV)
        }}
        visiable={showAlert}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: BackgroundColor.white
  },
  scrollviewContainer: {
    marginBottom: 45,
  },

  avatar: {
    borderRadius: 50,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignSelf: "center",
    marginTop: 20,
  },

  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 2,
  },
  btn: {
    position: 'absolute',
    bottom: 10,
    left: 50,
    right: 50,
    backgroundColor: BackgroundColor.primary,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  btnText: {
    color: BackgroundColor.white,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  btnDisable: {
    backgroundColor: BackgroundColor.gray_e6,
  },

  buttonContainer: {
  },

});
