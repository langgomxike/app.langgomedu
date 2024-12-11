import React, { useCallback, useContext, useEffect, useState } from "react";
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
import Class from "../../../../models/Class";
import ReactAppUrl from "../../../../configs/ConfigUrl";
import moment from "moment";

type Props = {
  tuitionData: Class;
  onSetDataTuition: (data: Class) => void;
  tuition: number;
  setTuiton: (tuition: number) => void;
  dateStart: number;
  setDateStart: (dateStart: number) => void;
  dateEnd: number;
  setDateEnd: (dateEnd: number) => void;
  selectedProvince: string;
  setSelectedProvince: (tuition: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (tuition: string) => void;
  selectedWard: string;
  setSelectedWard: (tuition: string) => void;
  detail: string;
  setDetail: (tuition: string) => void;
  userId: string;
  childJoined: User[];
  setChildJoined: (childs: User[]) => void;
};

const URL = ReactAppUrl.PUBLIC_URL;

const UpdateInfoTuitionLearner = ({
  userId,
  tuition,
  setTuiton,
  dateStart,
  setDateStart,
  dateEnd,
  setDateEnd,
  selectedProvince,
  setSelectedProvince,
  selectedDistrict,
  setSelectedDistrict,
  selectedWard,
  setSelectedWard,
  detail,
  setDetail,
  childJoined,
  setChildJoined
}: Props) => {
  // context
  const languageContext = useContext(LanguageContext).language;

  // state ----------------------------------------------------------------------------------------------
  const [error, setError] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    start: false,
    end: false,
  });
  // lưu id các thằng con tham gia
  // const [childJoined, setChildJoined] = useState<User[]>(childJoinedProp);
  const [childData, setChildData] = useState<User[]>([]);
  // const [joinedState, setJoinedState] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  // Fetch child data
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
    // setChildJoined(childJoinedProp)
  }, [userId]);

  // format gia tien
  const formatCurrency = (value: string) => {
    if (!value) return "";
    // Loại bỏ tất cả ký tự không phải số
    const numericValue = value.replace(/\D/g, "");
    // Format số tiền
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format tuition on input change
  const handleTuitionChange = (value: string) => {
    formatCurrency(value);
    const numericValue = value.replace(/[^0-9]/g, "");
    setTuiton(Number(numericValue));
  };

  // Handle date picker visibility
  const showDatePicker = (type: any) =>
    setDatePickerVisibility({ ...isDatePickerVisible, [type]: true });
  const hideDatePicker = (type: any) =>
    setDatePickerVisibility({ ...isDatePickerVisible, [type]: false });

  // Handle date selection
  const handleDateConfirm = (type: "start" | "end", date: Date) => {
    // Convert Date to timestamp (number)
    const timestamp = date.getTime();
    if (type === "start") setDateStart(timestamp);
    if (type === "end") setDateEnd(timestamp);
    hideDatePicker(type);
  };


  const handlePress = useCallback((user: User) => {
    
    // console.log(user);
    const isAlreadyJoined = childJoined.some((child) => child.id === user.id && child.full_name === user.full_name);
    if (isAlreadyJoined) {
      // Xóa khỏi danh sách tham gia
      const updatedList = childJoined.filter((child) => child.id !== user.id || child.full_name !== user.full_name);
      setChildJoined(updatedList);
    } else {
      // Thêm vào danh sách tham gia
      const joinedChild = childData.find((child) => child.id === user.id && child.full_name === user.full_name);
      if (joinedChild) {
        const updatedList = [...childJoined, joinedChild];
        setChildJoined(updatedList);
      }
    }
  }, [childData, childJoined]);
  
  
  // console.log("child: ", childJoinedProp);
  

  // DANH SACH CON
  const ChildItem = (user: User) => {
    const isJoined = childJoined.some((child) => child.id === user.id);
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
              name={isJoined ? "checkmark-circle-outline" : "checkmark-circle-outline"}
              size={35}
              color={isJoined ? "#44bd32" : "black"}
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
            onPress={() => handlePress(user)}
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
          value={formatCurrency(tuition.toString())}
          onChangeText={handleTuitionChange}
        />
      </View>

      {/* Date Inputs */}
      <View style={styles.marginInput}>
        <Text style={styles.label}>
          {languageContext.DATE_START_PLACEHOLDER}{" "}
          <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => showDatePicker("start")}
        >
          <Text>
            {dateStart
              ? moment(dateStart).format("DD/MM/YYYY")
              : languageContext.DATE_START_PLACEHOLDER}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>
        {languageContext.DATE_END} <Text style={styles.required}>*</Text>
      </Text>
      <TouchableOpacity
        onPress={() => showDatePicker("end")}
        style={styles.input}
      >
        <Text>
          {dateEnd
            ? moment(dateEnd).format("DD/MM/YYYY")
            : languageContext.DATE_END_PLACEHOLDER}
        </Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <DateTimePickerModal
        isVisible={isDatePickerVisible.start}
        mode="date"
        onConfirm={(date) => handleDateConfirm("start", date)}
        onCancel={() => hideDatePicker("start")}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible.end}
        mode="date"
        onConfirm={(date) => handleDateConfirm("end", date)}
        onCancel={() => hideDatePicker("end")}
      />

      {/* Address Inputs */}
      <View style={{ marginTop: 25 }}>
        <Text style={styles.label}>
          {languageContext.ADDRESS} <Text style={styles.required}>*</Text>
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

      <View style={{ marginTop: 25 }}>
        <Text style={styles.label}>
          {languageContext.DETAIL_ADDRESS}{" "}
          <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder={languageContext.DETAIL_ADDRESS_PLACEHOLDER}
          value={detail}
          onChangeText={setDetail}
        />
      </View>

      {/* Child List */}
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
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
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
    color: "#555",
    marginTop: 15,
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

export default UpdateInfoTuitionLearner;
