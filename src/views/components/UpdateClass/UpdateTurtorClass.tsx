import { ScrollView, StyleSheet, Text } from "react-native";
import UpdateInfoClass from "./UpdateInfoClass";
import UpdateInfoLesson from "./UpdateInfoLesson";
import UpdateInfoTuition from "./UpdateTurtorClass/UpdateInfoTuition";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useCallback, useContext, useEffect, useState } from "react";
import AClass from "../../../apis/AClass";
import Lesson from "../../../models/Lesson";
import Dialog from "react-native-dialog";
import { NavigationContext } from "@react-navigation/native";
import ScreenName from "../../../constants/ScreenName";
import { AccountContext } from "../../../configs/AccountConfig";
import { RoleList } from "../../../models/Role";
import { LanguageContext } from "../../../configs/LanguageConfig";

const TurtorClass = () => {
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
  const [dataMaxLearner, setDataMaxLearner] = useState<number>(0);

  // thêm state để báo lỗi khi các trường để trống
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // lesson
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [dataPrice, setDataPrice] = useState<number | null>(null);
  const [dataDateStart, setDataDateStart] = useState("");
  const [dataDateEnd, setDataDateEnd] = useState("");

  // state address
  const [dataProvinces, setDataProvinces] = useState(""); // tỉnh - thành phố
  const [dataDistrict, setDataDistrict] = useState(""); // quận - huyện
  const [dataWard, setDataWard] = useState(""); // phường - xã
  const [dataDetail, setDataDetail] = useState(""); // địa chỉ cụa thể

  // luu class id vua tao
  const [createClassId, setCreateClassId] = useState<number>(-1);

  /*===================================================================================*/

  // Dialog state
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const handleDataChangeClass = (
    title?: string,
    desc?: string,
    monHoc?: string,
    capHoc?: number,
    maxLearners?: number
  ) => {
    if (title) {
      setDataTitle(title);
    }

    if (desc) {
      setDataDesc(desc);
    }

    if (monHoc) {
      setDataMajorId(parseInt(monHoc));
    }

    if (capHoc) {
      setDataClassLevel(capHoc);
    }

    if (maxLearners) {
      setDataMaxLearner(maxLearners);
    }
  };

  const handleDataChangeLesson = (lessons: Lesson[]) => {
    console.log("class session", lessons);

    setLessons(lessons);
  };

  const handleDataChangeTuition = (
    price?: string,
    dateStart?: string,
    dateEnd?: string,
    provice?: string,
    district?: string,
    ward?: string,
    detail?: string
  ) => {
    if (price) {
      setDataPrice(parseFloat(price));
    }
    if (dateStart) {
      setDataDateStart(dateStart);
    }
    if (dateEnd) {
      setDataDateEnd(dateEnd);
    }

    if (provice) {
      setDataProvinces(provice);
    }
    if (district) {
      setDataDistrict(district);
    }
    if (ward) {
      setDataWard(ward);
    }
    if (detail) {
      setDataDetail(detail);
    }
  };

  // convert string to date
  const convertStringToTimestamp = (dateString: string) => {
    // Tách ngày, tháng, năm từ chuỗi ngày
    const [day, month, year] = dateString.split("/").map(Number);

    // Tạo đối tượng Date với thứ tự là (year, month - 1, day)
    // Lưu ý: tháng trong Date là từ 0 - 11, nên cần trừ đi 1
    const dateObj = new Date(year, month - 1, day);

    // Kiểm tra tính hợp lệ của dateObj
    if (!isNaN(dateObj.getTime())) {
      // Trả về giá trị thời gian tính bằng milliseconds
      return dateObj.getTime();
    } else {
      // Trả về null nếu dateString không hợp lệ
      return null;
    }
  };

  const handleNavigateToDetail = useCallback((classId: number) => {
    navigation?.navigate(ScreenName.DETAIL_CLASS, { classId });
  }, []);

  const handleSaveClass = useCallback(() => {
    console.log("title: ", dataTitle);
    console.log("description: ", dataDesc);
    console.log("majorId: ", dataMajorId);
    console.log("classLevelId: ", dataClassLevel);
    console.log("max learner: ", dataMaxLearner);
    console.log("gia: ", dataPrice);
    console.log("startedAt: ", dataDateStart);
    console.log("endedAt: ", dataDateEnd);

    console.log("province: ", dataProvinces);
    console.log("district: ", dataDistrict);
    console.log("ward: ", dataWard);
    console.log("detail: ", dataDetail);

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

    // Reset lỗi trước khi tiếp tục
    setErrorMessage(null);

    if (dataDateStart && dataDateEnd) {
      AClass.createClass(
        dataTitle,
        dataDesc,
        dataMajorId,
        dataClassLevel,
        dataMaxLearner,
        dataPrice,
        convertStringToTimestamp(dataDateStart),
        convertStringToTimestamp(dataDateEnd),
        dataProvinces,
        dataDistrict,
        dataWard,
        dataDetail,
        tutorId,
        authorId,
        lessons,
        (isSuccess, insertId) => {
          // kiem tra dung thi tra ve classId
          if (isSuccess && insertId) {
            setCreateClassId(insertId);
          }

          // Hiển thị dialog khi lớp học được tạo thành công
          setIsDialogVisible(true);
        }
      );
    }
  }, [
    dataTitle,
    dataDesc,
    dataMajorId,
    dataClassLevel,
    dataMaxLearner,
    dataPrice,
    dataDateStart,
    dataDateEnd,
    dataProvinces,
    dataDistrict,
    dataWard,
    dataDetail,
    tutorId,
    authorId,
    lessons,
  ]);

  // reset lại các giá trị trong ô input
  const handleResetInput = () => {
    // Reset các trường về giá trị ban đầu
    setDataTitle("");
    setDataDesc("");
    setDataMajorId(-1);
    setDataClassLevel(-1);
    setDataMaxLearner(0);
    setDataPrice(null);
    setDataDateStart("");
    setDataDateEnd("");
    setDataProvinces("");
    setDataDistrict("");
    setDataWard("");
    setDataDetail("");
    setLessons([]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <UpdateInfoClass onNext={handleDataChangeClass} />
      <UpdateInfoLesson handleGetLesson={handleDataChangeLesson} />
      <UpdateInfoTuition onNext={handleDataChangeTuition} />

      <TouchableOpacity style={styles.btnNext} onPress={handleSaveClass}>
        <Text style={styles.txtNext}>{languageContext.BTN_TAO_LOP}</Text>
      </TouchableOpacity>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {/* Dialog thông báo thành công */}
      <Dialog.Container visible={isDialogVisible}>
        <Dialog.Title>{languageContext.DIALOG_TITLE}</Dialog.Title>
        <Dialog.Description>
          {languageContext.DIALOG_DESC}: {createClassId}.
        </Dialog.Description>
        <Dialog.Button
          label="OK"
          onPress={() => {
            handleResetInput();
            setIsDialogVisible(false);
            handleNavigateToDetail(createClassId);
          }} // Đóng dialog khi nhấn "OK"
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

export default TurtorClass;
