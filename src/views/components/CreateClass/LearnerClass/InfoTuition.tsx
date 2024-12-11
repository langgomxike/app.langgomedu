import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import AStudent from "../../../../apis/AStudent";
import User from "../../../../models/User";
import DropDownLocation from "../../dropdown/DropDownLocation";
import { LanguageContext } from "../../../../configs/LanguageConfig";
import { child } from "firebase/database";
import DateTimeConfig from "../../../../configs/DateTimeConfig";
import ReactAppUrl from "../../../../configs/ConfigUrl";

type Props = {
  onNext: (
    tuition?: string,
    dateStart?: string,
    dateEnd?: string,
    maxLearners?: number,
    province?: string,
    district?: string,
    ward?: string,
    detail?: string,
    childIds? : string[]
  ) => void;
  userId: string;
};

const URL = ReactAppUrl.PUBLIC_URL;

const InfoTuition = ({ onNext, userId }: Props) => {
  // context
  const languageContext = useContext(LanguageContext).language;

  const [tuition, setTuition] = useState<number | null>(null); // Giá trị gốc dạng số
  const [formattedTuition, setFormattedTuition] = useState<string>(""); // Giá trị hiển thị
  const [dateStart, setDateStart] = useState(DateTimeConfig.getDateFormatFullYear(new Date().getTime() + 24*60*60*1000));
  const [dateEnd, setDateEnd] = useState("");
  const [error, setError] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerType, setDatePickerType] = useState<"start" | "end">();
  const [childData, setChildData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false); // loading trong thoi gian cho
  
  // State lưu trạng thái tham gia cho từng con
  const [joinedState, setJoinedState] = useState<{ [key: string]: boolean }>(
    {}
  );
  // lưu id các thằng con tham gia
  const [childJoineds, setChildJoineds] = useState<string[]>([]);

  // state address
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [detail, setDetail] = useState("");

  // Kiểm tra logic ngày bắt đầu và ngày kết thúc
  const validateDates = (start: string, end: string) => {
    // Chuyển đổi dd/mm/yyyy thành Date object
    const parseDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day); // Chú ý month - 1 vì tháng trong JavaScript bắt đầu từ 0
    };
  
    const startDate = parseDate(start).getTime();
    const endDate = parseDate(end).getTime();
  
    if (isNaN(startDate) || isNaN(endDate)) {
      setError("Thoi gian khong hop le"); // Ngày không hợp lệ
      return false;
    }

    if (startDate < new Date().getTime() + 23 * 60 * 60 * 1000 - 1) {
      setError("Ngay bat dau khong hop le"); // Ngày không hợp lệ
      return false;
    }
  
    if (startDate + 30*24*60*60*1000 > endDate) {
      setError("Ngay key thuc khong hop le"); // Ngày bắt đầu >= ngày kết thúc
      return false;
    }
  
    setError(""); // Không có lỗi
    return true;
  };  

  // Hiển thị lịch
  const showDatePicker = (type: "start" | "end") => {
    setDatePickerType(type);
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  // Xử lý khi chọn ngày
  const handleConfirm = (date: Date) => {
    // Chuyển đổi ngày thành định dạng dd/mm/yyyy
    const formattedDate = date
      .toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split("/")
      .join("/"); // Đảm bảo định dạng dd/mm/yyyy

    if (datePickerType === "start") {
      if (dateEnd && validateDates(formattedDate, dateEnd)) {
        setDateStart(formattedDate);
      }
    } else if (datePickerType === "end") {
      if (dateStart && validateDates(dateStart, formattedDate)) {
        setDateEnd(formattedDate);
      }
    }

    onNext(
      tuition?.toString(),
      dateStart,
      dateEnd,
      childJoineds.length,
      selectedProvince,
      selectedDistrict,
      selectedWard,
      detail,
      childJoineds
    );
    hideDatePicker();
  };

  // Xử lý thay đổi học phí
  const handleChangeTuition = (value: string) => {
    if (value === "") {
      setTuition(null);
      setFormattedTuition("");
      setError("");
      onNext(
        undefined,
        dateStart,
        dateEnd,
        childJoineds.length,
        selectedProvince,
        selectedDistrict,
        selectedWard,
        detail,
        childJoineds
      );
      return;
    }

    // Loại bỏ dấu phẩy khỏi giá trị nhập vào
    const numericValue = Number(value.replace(/,/g, ""));

    // Kiểm tra nếu giá trị là số hợp lệ
    if (!isNaN(numericValue)) {
      if (numericValue < 0) {
        setError(languageContext.ERROR_TUITION);
      } else if (numericValue < 10000) {
        setError(languageContext.ERROR_TUITION_1);
      } else {
        setError(""); // Reset lỗi nếu hợp lệ
      }

      // Lưu giá trị không có dấu phẩy vào state (để dùng cho tính toán)
      setTuition(numericValue);

      setFormattedTuition(numericValue.toLocaleString("en-US")); // định dạng hiển thị ra gia diện

      // Gửi giá trị không dấu phẩy qua onNext
      onNext(
        numericValue.toString(),
        dateStart,
        dateEnd,
        childJoineds.length,
        selectedProvince,
        selectedDistrict,
        selectedWard,
        detail,
        childJoineds
      );
    } else {
      setError(languageContext.ERROR_TUITION_2);
    }
  };

  // Xử lý khi nhấn nút tham gia
  const handlePress = (id: string) => {
    setJoinedState((prevState) => {
      const newState = {
        ...prevState,
        [id]: !prevState[id], // Đổi trạng thái cho item được nhấn
      };

      // Cập nhật danh sách childJoineds
      if (newState[id]) {
        // Nếu chuyển sang trạng thái tham gia, thêm id vào danh sách
        setChildJoineds((prev) => [...prev, id]);
      } else {
        // Nếu chuyển sang trạng thái không tham gia, loại bỏ id khỏi danh sách
        setChildJoineds((prev) => prev.filter((childId) => childId !== id));
      }

      return newState;
    });
  };


  // Khi có dữ liệu mới, tạo trạng thái ban đầu cho tất cả item
  useEffect(() => {
    const initialJoinedState = childData.reduce((acc, child) => {
      acc[child.id] = false; // Tất cả item ban đầu đều chưa tham gia
      return acc;
    }, {} as { [key: string]: boolean });
    setJoinedState(initialJoinedState);
  }, [childData]);

  // xử lý đồng bộ cho childJoineds
  useEffect(() => {
    console.log("Danh sách các con tham gia:", childJoineds);
    onNext(
      tuition?.toString(),
      dateStart,
      dateEnd,
      childJoineds.length,
      selectedProvince,
      selectedDistrict,
      selectedWard,
      detail,
      childJoineds
    );
  }, [childJoineds]);

  useEffect(() => {
    if (userId) {
      AStudent.getStudentBelongsToUser(
        userId,
        (childs) => {
          setChildData(childs);
        },
        (isLoading) => {
          setLoading(isLoading);
        }
      );
    }
  }, [userId]);

  // DANH SACH CON
  const ChildItem = (user: User) => {
    const isJoined = joinedState[user.id] || false; // Trạng thái của item

    return (
      <View style={styles.boxWhite}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: `${URL}${user.avatar}`,
            }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user.full_name}</Text>
        </View>
        <View style={styles.details}>
          <Text>
            <Ionicons
              name={isJoined ? "checkmark-circle-outline" : "checkmark-circle-outline"} // Icon tùy trạng thái
              size={35}
              color={isJoined ? "#44bd32" : "black"} // Màu sắc tùy trạng thái
            />
          </Text>
          <Text style={styles.description}>
            {isJoined ? languageContext.JOINED : languageContext.JOIN}
          </Text>
          <TouchableOpacity
            style={[
              styles.button,
              isJoined ? styles.buttonCancel : styles.buttonJoin, // Áp dụng style tùy theo trạng thái
            ]}
            onPress={() => handlePress(user.id)}
          >
            <Text
              style={[
                styles.text,
                isJoined ? styles.textCancel : styles.textJoin, // Thay đổi màu chữ
              ]}
            >
              {isJoined
                ? languageContext.BTN_HUY
                : languageContext.BTN_THAM_GIA}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Học phí */}
      <View style={styles.marginInput}>
        <Text style={styles.label}>
          {languageContext.TUITION} <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder={languageContext.TUITION_PLACEHOLDER}
          keyboardType="numeric"
          value={formattedTuition}
          onChangeText={handleChangeTuition}
        />
      </View>

      {/* Ngày bắt đầu */}
      <View style={styles.marginInput}>
        <Text style={styles.label}>
          {languageContext.DATE_START_PLACEHOLDER}{" "}
          <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => showDatePicker("start")}
        >
          <Text>{dateStart || languageContext.DATE_START_PLACEHOLDER}</Text>
        </TouchableOpacity>
      </View>

      {/* Ngày kết thúc */}
      <View style={styles.marginInput}>
        <Text style={styles.label}>
          {languageContext.DATE_END} <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => showDatePicker("end")}
        >
          <Text>{dateEnd || languageContext.DATE_END_PLACEHOLDER}</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Modal lịch */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      {/* Địa chỉ */}
      <View style={styles.marginInput}>
        <Text style={styles.label}>
          Địa chỉ <Text style={styles.required}>*</Text>
        </Text>
        <DropDownLocation
          selectedCity={selectedProvince}
          selectedDistrict={selectedDistrict}
          selectedWard={selectedWard}
          onSetSelectedCity={setSelectedProvince}
          onSetSelectedDistrict={setSelectedDistrict}
          onSetSelectedWard={setSelectedWard}
        />
      </View>

      <View>
        <Text style={styles.label}>
          {languageContext.DETAIL_ADDRESS}{" "}
          <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder={languageContext.DETAIL_ADDRESS_PLACEHOLDER}
          value={detail}
          onChangeText={(text) => {
            setDetail(text);
            onNext(
              tuition?.toString(),
              dateStart,
              dateEnd,
              childJoineds.length,
              selectedProvince,
              selectedDistrict,
              selectedWard,
              text
            );
          }}
        />
      </View>

      <View>
        <Text style={[styles.label, { marginTop: 25 }]}>{languageContext.LIST_CHILD}</Text>
        <FlatList
          data={childData}
          renderItem={({ item }) => ChildItem(item)}
          keyExtractor={(item) => item.id}
          horizontal
          contentContainerStyle={styles.flatListContainer}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 20,
    backgroundColor: "#fff",
  },
  marginInput: {
    marginBottom: 25,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  required: {
    color: "red",
  },

  flatListContainer: {
    paddingHorizontal: 10,
  },
  boxWhite: {
    width: 300,
    margin: 10,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#333",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  details: {
    alignItems: "center",
  },
  checkIcon: {
    fontSize: 24,
    color: "green",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    marginTop: 15,
    color: "#555",
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff", // Màu primary (thay bằng màu của bạn nếu khác)
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center", // Canh giữa nội dung theo chiều ngang
    width: 250,
  },
  text: {
    color: "#fff", // Màu chữ trắng
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonJoin: {
    backgroundColor: "#007BFF", // Màu xanh dương cho nút Tham gia
  },
  buttonCancel: {
    borderWidth: 1,
    borderColor: "red", // Viền đỏ cho nút Hủy chọn
    backgroundColor: "white", // Nền trắng
  },
  textJoin: {
    color: "white", // Chữ trắng cho nút Tham gia
  },
  textCancel: {
    color: "red", // Chữ đỏ cho nút Hủy chọn
  },
});

export default InfoTuition;
