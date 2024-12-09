import { ScrollView, StyleSheet, Text } from "react-native";
import UpdateInfoClass from "./UpdateInfoClass";
import UpdateInfoLesson from "./UpdateInfoLesson";
import UpdateInfoTuition from "./UpdateLearnerClass/UpdateInfoTuitionLearner";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useCallback, useContext, useEffect, useState } from "react";
import AClass from "../../../apis/AClass";
import Lesson from "../../../models/Lesson";
import Dialog from "react-native-dialog";
import {
  NavigationContext,
  NavigationRouteContext,
} from "@react-navigation/native";
import ScreenName from "../../../constants/ScreenName";
import { AccountContext } from "../../../configs/AccountConfig";
import { RoleList } from "../../../models/Role";
import { LanguageContext } from "../../../configs/LanguageConfig";
import { UpdateClassRoute } from "../../../configs/NavigationRouteTypeConfig";
import Class from "../../../models/Class";
import UpdateInfoTuitionLearner from "./UpdateLearnerClass/UpdateInfoTuitionLearner";

const UpdateLearnerClass = () => {
  // context
  const navigation = useContext(NavigationContext);
  const user = useContext(AccountContext); // get account info
  const languageContext = useContext(LanguageContext).language;
  // route, context
  const route = useContext(NavigationRouteContext);
  const param = (route?.params as UpdateClassRoute) || new Class();

  if (!user || !user.account) {
    return <Text>Error: User not found</Text>; // handle case where user data is not available
  }

  const roleIds = user.account?.roles?.map((role) => role.id); // get role ids
  const tutorId = roleIds?.includes(RoleList.TUTOR)
    ? user.account?.id ?? ""
    : ""; // if not TUTOR, it's an empty string
  const authorId = user.account?.id;

  // state
  const [dataTitle, setDataTitle] = useState<string>("");
  const [dataDesc, setDataDesc] = useState<string>("");
  const [dataMajorId, setDataMajorId] = useState<number>(-1);
  const [dataClassLevel, setDataClassLevel] = useState<number>(-1);
  // address state
  const [dataProvinces, setDataProvinces] = useState("");
  const [dataDistrict, setDataDistrict] = useState("");
  const [dataWard, setDataWard] = useState("");
  const [dataDetail, setDataDetail] = useState("");
  // error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // lesson state
  const [lessons, setLessons] = useState<Lesson[]>([]);
  // tuition state
  const [dataPrice, setDataPrice] = useState<number | null>(null);
  const [dataDateStart, setDataDateStart] = useState("");
  const [dataDateEnd, setDataDateEnd] = useState("");
  // max learners state
  const [maxLearners, setMaxLearners] = useState<number>(0);
  // newly created class id
  const [createClassId, setCreateClassId] = useState<number>(-1);
  // dialog visibility state
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [classData, setClassData] = useState<Class>(new Class());

  const convertStringToTimestamp = (dateString: string) => {
    const [day, month, year] = dateString.split("/").map(Number);
    const dateObj = new Date(year, month - 1, day);
    return !isNaN(dateObj.getTime()) ? dateObj.getTime() : null;
  };

  const handleSaveClass = useCallback(() => {
    if (!dataTitle.trim()) {
      setErrorMessage(languageContext.ERR_MESSAGE_TITLE);
      return;
    }
    if (!dataDesc.trim()) {
      setErrorMessage(languageContext.ERR_MESSAGE_DESCRIPTION);
      return;
    }
    if (dataMajorId === -1) {
      setErrorMessage(languageContext.ERR_MESSAGE_MAJOR);
      return;
    }
    if (dataClassLevel === -1) {
      setErrorMessage(languageContext.ERR_MESSAGE_CLASS_LEVEL);
      return;
    }
    if (dataPrice === null || dataPrice === 0 || isNaN(dataPrice)) {
      setErrorMessage(languageContext.ERR_MESSAGE_PRICE);
      return;
    }
    if (!dataDateStart.trim() || !dataDateEnd.trim()) {
      setErrorMessage(languageContext.ERR_MESSAGE_DATE_START_END);
      return;
    }
    if (!authorId) {
      setErrorMessage(languageContext.ERR_MESSAGE_AUTHOR);
      return;
    }

    setErrorMessage(null);

    if (dataDateStart && dataDateEnd) {
      // AClass.createClassForLearner(
      //   dataTitle,
      //   dataDesc,
      //   dataMajorId,
      //   dataClassLevel,
      //   dataPrice,
      //   convertStringToTimestamp(dataDateStart),
      //   convertStringToTimestamp(dataDateEnd),
      //   maxLearners,
      //   dataProvinces,
      //   dataDistrict,
      //   dataWard,
      //   dataDetail,
      //   tutorId, // Pass tutorId from context
      //   authorId, // Pass authorId from context
      //   lessons,
      //   (isSuccess, insertId) => {
      //     if (isSuccess && insertId) {
      //       setCreateClassId(insertId);
      //       setIsDialogVisible(true); // Show dialog on success
      //     }
      //   }
      // );
    }
  }, [
    dataTitle,
    dataDesc,
    dataMajorId,
    dataClassLevel,
    dataPrice,
    dataDateStart,
    dataDateEnd,
    maxLearners,
    dataProvinces,
    dataDistrict,
    dataWard,
    dataDetail,
    tutorId, // Ensure tutorId is available here
    authorId, // Ensure authorId is available here
    lessons,
  ]);

  // useEffect
  useEffect(() => {
    setClassData(param.classData);
  }, [param.classData]);

  // render
  if (!param.classData) {
    return <Text>Không có dữ liệu lớp học.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <UpdateInfoClass classData={param.classData} />
      {classData.lessons && <UpdateInfoLesson lessonData={classData.lessons} />}
      <UpdateInfoTuitionLearner
      tuitionData={param.classData}
      userId={user.account?.id ?? ""}
      childs={param.members}
      />

      <TouchableOpacity style={styles.btnNext} onPress={handleSaveClass}>
        <Text style={styles.txtNext}>Chỉnh Sửa</Text>
      </TouchableOpacity>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <Dialog.Container visible={isDialogVisible}>
        <Dialog.Title>{languageContext.DIALOG_TITLE}</Dialog.Title>
        <Dialog.Description>
          {languageContext.DIALOG_TITLE}: {createClassId}.
        </Dialog.Description>
        <Dialog.Button
          label="OK"
          onPress={() => {
            setIsDialogVisible(false);
          }}
        />
      </Dialog.Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Đảm bảo chiếm đủ không gian
    paddingBottom: 250,
  },
  btnNext: {
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    height: 40,
    backgroundColor: "#0D99FF",
    marginTop: 20,
    borderRadius: 10,
    marginLeft: 75,
  },
  txtNext: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
});

export default UpdateLearnerClass;
