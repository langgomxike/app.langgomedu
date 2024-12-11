import { ScrollView, StyleSheet, Text } from "react-native";
import UpdateInfoClass from "./UpdateInfoClass";
import UpdateInfoLesson from "./UpdateInfoLesson";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useContext, useEffect, useState } from "react";
import Dialog from "react-native-dialog";
import { NavigationRouteContext } from "@react-navigation/native";
import { AccountContext } from "../../../configs/AccountConfig";
import { RoleList } from "../../../models/Role";
import { LanguageContext } from "../../../configs/LanguageConfig";
import { UpdateClassRoute } from "../../../configs/NavigationRouteTypeConfig";
import Class from "../../../models/Class";
import UpdateInfoTuitionLearner from "./UpdateLearnerClass/UpdateInfoTuitionLearner";
import AClass from "../../../apis/AClass";
import User from "../../../models/User";

const UpdateLearnerClass = () => {
  // context
  // get account info
  const user = useContext(AccountContext);
  if (!user || !user.account) {
    return <Text>Error: User not found</Text>;
  }
  const languageContext = useContext(LanguageContext).language;
  const route = useContext(NavigationRouteContext);
  const param = (route?.params as UpdateClassRoute) || new Class();

  // state ------------------------------------------------------------
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
  // tuition
  const [dataPrice, setDataPrice] = useState<number>(-1);
  const [dataDateStart, setDataDateStart] = useState<number>(-1);
  const [dataDateEnd, setDataDateEnd] = useState<number>(-1);
  // max learners
  const [maxLearners, setMaxLearners] = useState<number>(0);
  // dialog visibility
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [classData, setClassData] = useState<Class>(new Class());
  const [childJoined, setChildJoined] = useState<User[]>([]);


  // useEffect ---------------------------------------------------------
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
      setDataPrice(param.classData.price);
      setDataDateStart(param.classData.started_at);
      setDataDateEnd(param.classData.ended_at);
      setMaxLearners(param.classData.max_learners);
      setChildJoined(param.members);
      if (param.classData.id) {
        setClassData(param.classData);
      } else {
        console.log("khong co id lop hoc!");
      }
    }
  }, [param.classData]);

  useEffect(() => {
    setClassData(param.classData);
  }, [param.classData]);  

  // handle ------------------------------------------------------------
  const handleSaveClass = () => {
    if (dataDateStart && dataDateEnd) {
      if (!classData?.id) {
        console.error("classData.id không tồn tại.");
        return;
      }
      
      AClass.updateClassForLeaner(
        classData.id,
        dataTitle,
        dataDesc,
        dataMajorId,
        dataClassLevel,
        maxLearners,
        dataPrice ?? 0,
        dataDateStart,
        dataDateEnd,
        new Date().getTime(),
        childJoined,
        classData.address?.id ?? 0,
        dataProvinces,
        dataDistrict,
        dataWard,
        dataDetail,
        (isSuccess, errorMessage) => {
          if (isSuccess) {
            setIsDialogVisible(true);
          } else {
            setErrorMessage(errorMessage ?? null);
          }
        }
      );
    }
  }


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <UpdateInfoClass
        classData={param.classData}
        onSetClassData={setClassData}
        title={dataTitle}
        onSetTitle={setDataTitle}
        description={dataDesc}
        onSetDescription={setDataDesc}
        classLevel={dataClassLevel}
        onsetClassLevel={setDataClassLevel}
        maxLearners={maxLearners}
        onSetMaxLearners={setMaxLearners}
        major={dataMajorId}
        onSetMajor={setDataMajorId}
      />
      {classData.lessons && <UpdateInfoLesson lessonData={classData.lessons} />}
      
      <UpdateInfoTuitionLearner
        tuitionData={param.classData}
        onSetDataTuition={setClassData}
        tuition={dataPrice}
        setTuiton={setDataPrice}
        dateStart={dataDateStart}
        setDateStart={setDataDateStart}
        dateEnd={dataDateEnd}
        setDateEnd={setDataDateEnd}
        selectedProvince={dataProvinces}
        setSelectedProvince={setDataProvinces}
        selectedDistrict={dataDistrict}
        setSelectedDistrict={setDataDistrict}
        selectedWard={dataWard}
        setSelectedWard={setDataWard}
        detail={dataDetail}
        setDetail={setDataDetail}
        userId={user.account?.id ?? ""}
        childJoined={childJoined}
        setChildJoined = {setChildJoined}
      />

      <TouchableOpacity style={styles.btnNext} onPress={handleSaveClass}>
        <Text style={styles.txtNext}>{languageContext.BTN_UPDATE_CLASS}</Text>
      </TouchableOpacity>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <Dialog.Container visible={isDialogVisible}>
        <Dialog.Title>{languageContext.DIALOG_TITLE}</Dialog.Title>
        <Dialog.Description>{languageContext.DIALOG_TITLE}.</Dialog.Description>
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
