import { ScrollView, StyleSheet, Text } from "react-native";
import InfoClass from "./InfoClass";
import InfoLesson from "./InfoLesson";
import InfoTuition from "./LearnerClass/InfoTuition";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useCallback, useContext, useState } from "react";
import AClass from "../../../apis/AClass";
import Lesson from "../../../models/Lesson";
import Dialog from "react-native-dialog";
import { NavigationContext } from "@react-navigation/native";
import ScreenName from "../../../constants/ScreenName";
import { AccountContext } from "../../../configs/AccountConfig";
import { RoleList } from "../../../models/Role";
import { LanguageContext } from "../../../configs/LanguageConfig";

const LearnerClass = () => {
  // context
  const navigation = useContext(NavigationContext);
  const user = useContext(AccountContext); // get account info
  const languageContext = useContext(LanguageContext).language;

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

  // Data change handlers
  const handleDataChangeClass = (
    title?: string,
    desc?: string,
    monHoc?: string,
    capHoc?: number
  ) => {
    if (title) setDataTitle(title);
    if (desc) setDataDesc(desc);
    if (monHoc) setDataMajorId(parseInt(monHoc));
    if (capHoc) setDataClassLevel(capHoc);
  };

  const handleDataChangeLesson = (lessons: Lesson[]) => {
    setLessons(lessons);
  };

  const handleDataChangeTuition = (
    price?: string,
    dateStart?: string,
    dateEnd?: string,
    maxLearner?: number,
    provice?: string,
    district?: string,
    ward?: string,
    detail?: string
  ) => {
    if (price) setDataPrice(parseFloat(price));
    if (dateStart) setDataDateStart(dateStart);
    if (dateEnd) setDataDateEnd(dateEnd);
    if (provice) setDataProvinces(provice);
    if (district) setDataDistrict(district);
    if (ward) setDataWard(ward);
    if (detail) setDataDetail(detail);
    if (maxLearner !== undefined) setMaxLearners(maxLearner);
  };

  const convertStringToTimestamp = (dateString: string) => {
    const [day, month, year] = dateString.split("/").map(Number);
    const dateObj = new Date(year, month - 1, day);
    return !isNaN(dateObj.getTime()) ? dateObj.getTime() : null;
  };

  const handleNavigateToDetail = useCallback(
    (classId: number) => {
      navigation?.navigate(ScreenName.DETAIL_CLASS, { classId });
    },
    [navigation]
  );

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
      AClass.createClassForLearner(
        dataTitle,
        dataDesc,
        dataMajorId,
        dataClassLevel,
        dataPrice,
        convertStringToTimestamp(dataDateStart),
        convertStringToTimestamp(dataDateEnd),
        maxLearners,
        dataProvinces,
        dataDistrict,
        dataWard,
        dataDetail,
        tutorId, // Pass tutorId from context
        authorId, // Pass authorId from context
        lessons,
        (isSuccess, insertId) => {
          if (isSuccess && insertId) {
            setCreateClassId(insertId);
            setIsDialogVisible(true); // Show dialog on success
          }
        }
      );
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

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <InfoClass onNext={handleDataChangeClass} />
      <InfoLesson handleGetLesson={handleDataChangeLesson} />
      <InfoTuition
        onNext={handleDataChangeTuition}
        userId={user.account?.id ?? ""}
      />

      <TouchableOpacity style={styles.btnNext} onPress={handleSaveClass}>
        <Text style={styles.txtNext}>{languageContext.BTN_TAO_LOP}</Text>
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
            handleNavigateToDetail(createClassId);
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

export default LearnerClass;
