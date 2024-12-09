import { ScrollView, StyleSheet, Text } from "react-native";
import UpdateInfoClass from "./UpdateInfoClass";
import UpdateInfoLesson from "./UpdateInfoLesson";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useCallback, useContext, useEffect, useState } from "react";
import Lesson from "../../../models/Lesson";
import Dialog from "react-native-dialog";
import {
  NavigationContext,
  NavigationRouteContext,
} from "@react-navigation/native";
import { AccountContext } from "../../../configs/AccountConfig";
import { LanguageContext } from "../../../configs/LanguageConfig";
import { UpdateClassRoute } from "../../../configs/NavigationRouteTypeConfig";
import Class from "../../../models/Class";
import UpdateInfoTuition from "./UpdateTurtorClass/UpdateInfoTuition";
import AClass from "../../../apis/AClass";

const UpdateTutorClass = () => {
  // context
  const user = useContext(AccountContext); // get account info
  const languageContext = useContext(LanguageContext).language;
  // route, context
  const route = useContext(NavigationRouteContext);
  const param = (route?.params as UpdateClassRoute) || new Class();

  if (!user || !user.account) {
    return <Text>Error: User not found</Text>; // handle case where user data is not available
  }

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

  useEffect(() => {
    if (param.classData) {
      setDataTitle(param.classData.title);
      setDataDesc(param.classData.description);
      setDataMajorId(param.classData.major?.id ?? 0);
      setDataClassLevel(param.classData.class_level?.id ?? 0);
      setDataProvinces(param.classData.address?.province ?? "");
      setDataDistrict(param.classData.address?.district ?? "");
      setDataWard(param.classData.address?.ward ?? "");
      setDataDetail(param.classData.address?.detail ?? "");
      setLessons(param.classData.lessons || []);
      setDataPrice(param.classData.price);
      setDataDateStart(param.classData.started_at ? new Date(param.classData.started_at).toLocaleDateString() : "");
      setDataDateEnd(param.classData.ended_at ? new Date(param.classData.ended_at).toLocaleDateString() : "");
      setMaxLearners(param.classData.max_learners);

      if (param.classData.id) {
        setClassData(param.classData);
      } else {
        console.log("khong co id lop hoc!");
        
      }
    }
  }, [param.classData])

  const handleUpdateClass = useCallback(() => {

    if (!classData?.id) {
      console.error("classData.id không tồn tại.");
      return;
    }

    if (dataDateStart && dataDateEnd) {
      AClass.updateClass(
        classData.id,
        dataTitle,
        dataDesc,
        dataMajorId,
        dataClassLevel,
        dataPrice ?? 0,
        convertStringToTimestamp(dataDateStart) ?? 0,
        convertStringToTimestamp(dataDateEnd) ?? 0,
        new Date().getTime(),
        maxLearners,
        dataProvinces,
        dataDistrict,
        dataWard,
        dataDetail,
        lessons,
        (isSuccess, errorMessage) => {
          if (isSuccess) {
            setIsDialogVisible(true);
          } else {
            setErrorMessage(errorMessage ?? null);
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
    new Date().getTime(),
    maxLearners,
    dataProvinces,
    dataDistrict,
    dataWard,
    dataDetail,
    lessons,
    classData.id,
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
      <UpdateInfoTuition tuitionData={param.classData} />

      <TouchableOpacity style={styles.btnNext} onPress={handleUpdateClass}>
        <Text style={styles.txtNext}>Chỉnh Sửa</Text>
      </TouchableOpacity>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <Dialog.Container visible={isDialogVisible}>
        <Dialog.Title>{languageContext.DIALOG_TITLE}</Dialog.Title>
        <Dialog.Description>
          {languageContext.DIALOG_TITLE}.
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

export default UpdateTutorClass;
