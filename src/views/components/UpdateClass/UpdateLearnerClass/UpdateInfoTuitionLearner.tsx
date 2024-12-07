import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import AStudent from "../../../../apis/AStudent";
import User from "../../../../models/User";
import DropDownLocation from "../../dropdown/DropDownLocation";
import { LanguageContext } from "../../../../configs/LanguageConfig";
import Class from "../../../../models/Class";

type Props = {
  tuitionData: Class;
  userId: string;
  // childs: string[];
};

const UpdateInfoTuitionLearner = ({ tuitionData, userId }: Props) => {
  // context
  const languageContext = useContext(LanguageContext).language;

  // Tuition state
  const [tuition, setTuition] = useState<number | null>(
    tuitionData.price || null
  );
  const [formattedTuition, setFormattedTuition] = useState<string>(
    tuition?.toLocaleString("en-US") || ""
  );

  // con
  const [joinedState, setJoinedState] = useState<{ [key: string]: boolean }>(
    {}
  );

  // lưu id các thằng con tham gia
  const [childJoineds, setChildJoineds] = useState<string[]>([]);

  // err
  const [error, setError] = useState("");

  // Dates state
  const [dateStart, setDateStart] = useState<Date | null>(
    tuitionData.started_at ? new Date(tuitionData.started_at) : null
  );
  const [dateEnd, setDateEnd] = useState<Date | null>(
    tuitionData.ended_at ? new Date(tuitionData.ended_at) : null
  );
  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    start: false,
    end: false,
  });

  // Address state
  const [selectedProvince, setSelectedProvince] = useState(
    tuitionData.address?.province || ""
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    tuitionData.address?.district || ""
  );
  const [selectedWard, setSelectedWard] = useState(
    tuitionData.address?.ward || ""
  );
  const [detail, setDetail] = useState(tuitionData.address?.detail || "");

  // Child data
  const [childData, setChildData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("city-: ", selectedProvince);
  console.log("district-: ", selectedDistrict);
  console.log("ward-: ", selectedWard);

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
  }, [userId]);

  // Format tuition on input change
  const handleTuitionChange = (value: any) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setTuition(Number(numericValue));
    setFormattedTuition(Number(numericValue).toLocaleString("en-US"));
  };

  // Handle date picker visibility
  const showDatePicker = (type: any) =>
    setDatePickerVisibility({ ...isDatePickerVisible, [type]: true });
  const hideDatePicker = (type: any) =>
    setDatePickerVisibility({ ...isDatePickerVisible, [type]: false });

  // Handle date selection
  const handleDateConfirm = (type: any, date: any) => {
    if (type === "start") setDateStart(date);
    if (type === "end") setDateEnd(date);
    hideDatePicker(type);
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

  // DANH SACH CON
  const ChildItem = (user: User) => {
    const isJoined = joinedState[user.id] || false; // Trạng thái của item

    return (
      <View style={styles.boxWhite}>
        <View style={styles.userInfo}>
          <Image
            source={{
              uri: "https://cdn.vectorstock.com/i/1000v/51/87/student-avatar-user-profile-icon-vector-47025187.jpg",
            }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user.full_name}</Text>
        </View>
        <View style={styles.details}>
          <Text>
            <Ionicons
              name={isJoined ? "checkmark" : "checkmark"} // Icon tùy trạng thái
              size={35}
              color={isJoined ? "green" : "black"} // Màu sắc tùy trạng thái
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
              ? dateStart.toLocaleDateString()
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
            ? dateEnd.toLocaleDateString()
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
        <Text style={[styles.label, { marginTop: 25 }]}>Danh sách con</Text>
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
    marginRight: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "gray",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
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
