import { ScrollView, StyleSheet, Text } from "react-native";
import InfoClass from "./TurtorClass/InfoClass";
import InfoLesson from "./TurtorClass/InfoLesson";
import InfoTuition from "./TurtorClass/InfoTuition";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useCallback, useState } from "react";
import AClass from "../../apis/AClass";
import Lesson from "../../models/Lesson";
import Dialog from "react-native-dialog";


const TurtorClass = () => {
  // state
  const [dataTitle, setDataTitle] = useState<string>("");
  const [dataDesc, setDataDesc] = useState<string>("");
  const [dataMajorId, setDataMajorId] = useState<number>(-1);
  const [dataClassLevel, setDataClassLevel] = useState<number>(-1);

  // thêm state để báo lỗi khi các trường để trống
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // lesson
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [dataPrice, setDataPrice] = useState<number | null>(null);
  const [dataDateStart, setDataDateStart] = useState("");
  const [dataDateEnd, setDataDateEnd] = useState("");

  // Dialog state
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const handleDataChangeClass = (
    title?: string,
    desc?: string,
    monHoc?: string,
    capHoc?: number
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
  };

  const handleDataChangeLesson = (lessons: Lesson[]) => {
    console.log("class session", lessons);

    setLessons(lessons);
  };

  const handleDataChangeTuition = (
    price?: string,
    dateStart?: string,
    dateEnd?: string
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

  const handleSaveClass = useCallback(() => {
    console.log("title: ", dataTitle);
    console.log("description: ", dataDesc);
    console.log("majorId: ", dataMajorId);
    console.log("classLevelId: ", dataClassLevel);
    console.log("gia: ", dataPrice);
    console.log("startedAt: ", dataDateStart);
    console.log("endedAt: ", dataDateEnd);
    console.log("Type of endedAt: ", typeof dataDateEnd);

    if (!dataTitle.trim()) {
      setErrorMessage("Vui lòng nhập tiêu đề.");
      return;
    }

    if (!dataDesc.trim()) {
      setErrorMessage("Vui lòng nhập mô tả.");
      return;
    }

    if (dataMajorId === -1) {
      setErrorMessage("Vui lòng chọn môn học.");
      return;
    }

    if (dataClassLevel === -1) {
      setErrorMessage("Vui lòng chọn cấp học.");
      return;
    }

    if (dataPrice === null || dataPrice === 0 || isNaN(dataPrice)) {
      setErrorMessage("Vui lòng nhập học phí hợp lệ.");
      return;
    }

    if (!dataDateStart.trim() || !dataDateEnd.trim()) {
      setErrorMessage("Vui lòng chọn ngày bắt đầu và ngày kết thúc.");
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
        dataPrice,
        convertStringToTimestamp(dataDateStart),
        convertStringToTimestamp(dataDateEnd),
        lessons,
        () => {
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
    dataPrice,
    dataDateStart,
    dataDateEnd,
    lessons,
  ]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <InfoClass onNext={handleDataChangeClass} />
      <InfoLesson handleGetLesson={handleDataChangeLesson} />
      <InfoTuition onNext={handleDataChangeTuition} />

      <TouchableOpacity style={styles.btnNext} onPress={handleSaveClass}>
        <Text style={styles.txtNext}>Tạo Lớp</Text>
      </TouchableOpacity>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {/* Dialog thông báo thành công */}
      <Dialog.Container visible={isDialogVisible}>
        <Dialog.Title>Thành Công!</Dialog.Title>
        <Dialog.Description>
          Lớp học của bạn đã được tạo thành công.
        </Dialog.Description>
        <Dialog.Button
          label="OK"
          onPress={() => setIsDialogVisible(false)} // Đóng dialog khi nhấn "OK"
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
