import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useCallback, useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomInput from "../components/Inputs/CustomInput";
import GenderInput from "../components/Inputs/GenderInput";
import AUser from "../../apis/AUser";
import User from "../../models/User";
import DateTimeConfig from "../../configs/DateTimeConfig";
import Avatar from "../components/Avatar";
import ReactAppUrl from "../../configs/ConfigUrl";
const URL = ReactAppUrl.PUBLIC_URL;
export default function ProfileScreen() {
  //states
  const [loading, setLoading] = useState(true);
  const [interestedField, setInterestedField] = useState("");
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const userId = "080204000002";
  const isLoginUser = "080204000001";
  const pastelColors = [
    "#fff",
    // "#ff80aa",
    // "#3399ff",
    // "#00e68a",
    // "#b366ff",
    // "#ffb84d",
    // "#00cc44",
    // "#33ccff",
  ];
  const randomColor =
    pastelColors[Math.floor(Math.random() * pastelColors.length)];

  //laasy thoong tin porfile
  useEffect(() => {
    AUser.getUserProfileById(
      userId,
      (data: User) => {
        // console.log(data);
        setUserProfile(data); // Lưu dữ liệu nhận được vào state
      },
      (isLoading: boolean) => {
        setLoading(isLoading); // Cập nhật trạng thái tải
      }
    );
  }, [userId]);

  //chuyển đổi thời gian
  const timestamp = userProfile?.birthday ?? 0; // Timestamp (milliseconds)
  const date = new Date(timestamp);

  const day = date.getDate(); // Ngày
  const month = date.getMonth() + 1; // Tháng (cần +1 vì tháng tính từ 0)
  const year = date.getFullYear(); // Năm

  console.log(`${day}/${month}/${year}`); // Kết quả: "24/4/2004"
  const brithday = `${day}/${month}/${year}`;

  const timestampj = userProfile?.created_at ?? 0;
  const dayJoin = new Date(timestampj);

  const dayj = dayJoin.getDate(); // Ngày
  const monthj = dayJoin.getMonth() + 1; // Tháng (cần +1 vì tháng tính từ 0)
  const yearj = dayJoin.getFullYear(); // Năm

  console.log(`${dayj}/${monthj}/${yearj}`); // Kết quả: "24/4/2004"
  const dayatent = `${dayj}/${monthj}/${yearj}`;

  //handlers
  const handleSubmit = useCallback(() => {
    alert("Call api to save profile here");
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          {/* screen title */}
          {/* <Text style={styles.title}>Thông Tin </Text> */}
          <View style={styles.infor}>
            <View style={styles.avt}>
              <Image
                source={
                  userProfile?.avatar
                    ? { uri: `${URL}/${userProfile.avatar}` } // Nếu userAvatar tồn tại, sử dụng URI
                    : require("../../../assets/avatar/img_avatar_cat.png") // Nếu không, sử dụng ảnh mặc định
                }
                style={styles.avatar}
              />
            </View>
            <View style={styles.inf}>
              <Text style={styles.name}>{userProfile?.full_name}</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Text style={styles.birthday}>{brithday}</Text>
                <View>
                  {/* {userProfile?.gender_id==1?"nam":"nữ"} */}
                  {userProfile?.gender?.id === 0 ? (
                    <Image
                      style={{ width: 20, height: 20 }}
                      source={require("../../../assets/icons/ic_boy.png")}
                    />
                  ) : userProfile?.gender?.id === 1 ? (
                    <Image
                      style={{ width: 20, height: 20 }}
                      source={require("../../../assets/icons/girl.png")}
                    />
                  ) : (
                    <Image
                      style={{ width: 20, height: 20 }}
                      source={require("../../../assets/icons/img_avatar_rabbit.png")}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.row}>
            <View>
              <Text style={styles.title2}>Điểm uy tín</Text>
              <View>
                <View style={styles.uytin}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                      color: "#0D99FF",
                    }}
                  >
                    {userProfile?.point}
                  </Text>
                  <Image
                    style={styles.diemuytin}
                    source={require("../../../assets/icons/ic_diemuytin.png")}
                  ></Image>
                </View>
              </View>
            </View>
            <View>
              <View>
                <Text style={styles.title2}>Ngày tham gia</Text>
                <Text style={styles.content}>{dayatent}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.title2}>Chuyên ngành quan tâm</Text>
          <View style={styles.majorListContainer}>
            {userProfile?.interested_majors &&
            userProfile?.interested_majors?.length > 0 ? (
              userProfile?.interested_majors?.map((major: any, index: any) => {
                const randomColor =
                  pastelColors[Math.floor(Math.random() * pastelColors.length)];
                return (
                  <View
                    style={[styles.majorItem, { backgroundColor: randomColor }]}
                    key={index}
                  >
                    <Image
                      source={{ uri: `${URL}${major.icon}` }}
                      style={styles.majorIcon}
                    />
                    <Text style={styles.majorName}>{major.vn_name}</Text>
                  </View>
                );
              })
            ) : (
              <Text>Không có chuyên ngành quan tâm</Text>
            )}
          </View>
          <Text style={styles.title2}>Quê quán</Text>
          <Text style={styles.content}>{userProfile?.hometown}</Text>

          <Text style={styles.title2}>Địa chỉ</Text>
          <Text style={styles.content}>
            {userProfile?.address?.detail +
              ", " +
              userProfile?.address?.ward +
              ", " +
              userProfile?.address?.district +
              ", " +
              userProfile?.address?.province +
              " "}
          </Text>
          <Text style={styles.title2}>Liên hệ</Text>

          <View style={styles.contacts}>
            <Text>
              <Text style={{ fontWeight: "bold" }}>Số điện thoại: </Text>
              {userProfile?.phone_number.slice(0, -7) + "*******"}
            </Text>
            <Text>
              <Text style={{ fontWeight: "bold" }}>Địa chỉ email:</Text>{" "}
              {userProfile?.email}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.btns}>
        {userId === isLoginUser ? (
          // Nút Edit khi userId trùng với isLoginUser
          <TouchableOpacity style={styles.buttonEdit} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        ) : (
          // Hiển thị nút Nhắn Tin và Báo Cáo khi không trùng
          <>
            <TouchableOpacity style={styles.buttonNext} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Nhắn Tin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonReport}
              onPress={handleSubmit}
            >
              <Image
                style={{ width: 20, height: 20 }}
                source={require("../../../assets/icons/ic_report_account.png")}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D99FF",
    padding: 10,
    alignItems: "center",
    borderBottomEndRadius: 50,
    borderBottomStartRadius: 50,
  },
  diemuytin: {
    width: 30,
    height: 30,
  },
  uytin: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    backgroundColor: "#fff",
    // padding: 10,
    paddingHorizontal: 20,
    // paddingTop:-20,
    borderRadius: 10,
    width: "100%",
  },
  label: {
    marginBottom: 15,
    fontSize: 18,
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    justifyContent: "center",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonNext: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "80%",
  },
  buttonEdit: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  btns: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonReport: {
    backgroundColor: "#e6e6e6",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "15%",
  },
  mainAvatar: {
    marginBottom: 15,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 20, // Để hình tròn
    borderWidth: 2,
    borderColor: "#fff",
    overflow: "hidden",
    backgroundColor: "#ddd",
    marginBottom: 20,
  },
  button: {
    position: "absolute",
    bottom: -8,
    right: -5,
    borderRadius: 20,
    padding: 5,
  },
  clickButtonImage: {
    width: 25,
    height: 25,
    borderRadius: 50,
  },
  infor: {
    // flexDirection: 'row',
    justifyContent: "flex-start",
    marginBottom: 20,
    width: "100%",
  },
  name: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    width: "100%",
    marginBottom: 10,
  },
  birthday: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  inf: {
    // marginLeft:20,
    alignItems: "center",
  },
  avt: {
    alignItems: "center",
  },
  title2: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    marginTop: 20,
  },
  majorItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  majorListContainer: {
    flexDirection: "row", // Sắp xếp theo hàng ngang
    flexWrap: "wrap", // Tự động xuống dòng khi không đủ chỗ
    justifyContent: "flex-start", // Sắp xếp các item về phía đầu container
    gap: 10, // Khoảng cách giữa các item
  },
  majorIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  majorName: {
    fontSize: 14,
    color: "#333",
  },
  content: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  contacts: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-between",
  },
});
