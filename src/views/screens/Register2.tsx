import {Alert, ScrollView, StyleSheet, Text, View} from "react-native";
import MyIcon, {AppIcon} from "../components/MyIcon";
import InputRegister from "../components/Inputs/InputRegister";
import Button from "../components/Button";
import {useCallback, useContext, useState} from "react";
import {NavigationContext, NavigationRouteContext} from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";
import {BarcodeScanningResult, Camera, useCameraPermissions,} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import SLog, {LogType} from "../../services/SLog";
import Ionicons from "@expo/vector-icons/Ionicons";
import {BackgroundColor, TextColor} from "../../configs/ColorConfig";
import {LanguageContext} from "../../configs/LanguageConfig";
import DateTimeConfig from "../../configs/DateTimeConfig";
import {AuthType, RegisterType} from "../../configs/NavigationRouteTypeConfig";
import Spinner from "react-native-loading-spinner-overlay";
import AUser from "../../apis/AUser";
import User from "../../models/User";
import SAsyncStorage, {AsyncStorageKeys} from "../../services/SAsyncStorage";
import Toast from "react-native-simple-toast";

export default function RegisterStep2Screen() {
  //contexts
  const navigation = useContext(NavigationContext);
  const [permission, requestPermission] = useCameraPermissions();
  const languageContext = useContext(LanguageContext);
  const route = useContext(NavigationRouteContext);

  //states
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [dayOfBirth, setDayOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  //handlers
  const goBack = useCallback(() => {
    navigation?.goBack();
    navigation?.goBack();
  }, []);

  const onRegister = useCallback(() => {
    if (!id || !name || !dayOfBirth || !gender || !address) {
      Alert.alert(languageContext.language.UPLOAD_CITIZEN_ID, languageContext.language.INVALID_UPLOAD_CITIZEN_ID);
      return;
    }

    const {phone_number, username, password} = route?.params as RegisterType ?? {
      phone_number: "",
      username: "",
      password: ""
    };

    if (!phone_number || !username || !password) {
      Alert.alert(languageContext.language.REGISTER, languageContext.language.REGISTER_FAILED);
      return;
    }

    const user = new User();
    user.id = id;
    user.full_name = name;
    user.phone_number = phone_number;
    user.password = password;
    user.hometown = address;
    const day = +dayOfBirth.substring(0, 2);
    const month = +dayOfBirth.substring(2, 4);
    const year = +dayOfBirth.substring(4, 8);
    const date = new Date(year, month, day);
    user.birthday = date.getTime();
    user.username = username;
    setLoading(true);

    const data: AuthType = {user}
    navigation?.navigate(ScreenName.OTP, data);
  }, [id, name, dayOfBirth, gender, address]);

  function goToLogin(): void {
    navigation?.navigate(ScreenName.LOGIN);
  }

  const pickImage = useCallback(() => {
    setLoading(true);
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    })
      .then((result) => {
        SLog.log(LogType.Info, "ImagePicker", "process result", result);

        if (!result.canceled) {
          return Camera.scanFromURLAsync(result.assets[0].uri);
        }
        return [];
      })
      .then((value: BarcodeScanningResult[]) => {
        SLog.log(
          LogType.Info,
          "BarcodeScanningResult",
          "process result",
          value
        );

        processResult(value.length > 0 ? value[0].data : "");
      })
      .catch(() => {
        setLoading(false);
      })
  }, [permission]);

  const processResult = useCallback(
    (result: string) => {
      const data = result.split("|");
      let id: string = "",
        name: string = "",
        dayOfBirth: string = "",
        gender: string = "",
        address: string = "";

      if (data.length > 1) {
        id = data[0];
        setId(id);
      }

      if (data.length > 3) {
        name = data[2];
        setName(name);
      }

      if (data.length > 4) {
        dayOfBirth = data[3];
        const day = +dayOfBirth.substring(0, 2);
        const month = +dayOfBirth.substring(2, 4);
        const year = +dayOfBirth.substring(4, 8);
        const date = new Date(year, month, day);
        setDayOfBirth(DateTimeConfig.getDateFormat(date.getTime(), true));
      }

      if (data.length > 5) {
        gender = data[4];
        setGender(gender);
      }

      if (data.length > 6) {
        address = data[5];
        setAddress(address);
      }

      setLoading(false);
      if (!id || !name || !dayOfBirth || !gender || !address) {
        Alert.alert(languageContext.language.UPLOAD_CITIZEN_ID, languageContext.language.INVALID_UPLOAD_CITIZEN_ID);
        return;
      } else {
        Toast.show(languageContext.language.UPLOADED_CITIZEN_ID, 1500);
      }
    },
    [permission]
  );

  return (
    <ScrollView style={styles.container}>
      <Spinner visible={loading}/>

      {/* back button */}
      <Ionicons
        name="close"
        size={30}
        style={styles.backButton}
        onPress={goBack}
      />

      <View style={{height: 50}}/>

      {/* illustration text*/}
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>{languageContext.language.REGISTER}</Text>
          <Text style={styles.content}>{languageContext.language.REGISTER_HINT}</Text>
        </View>
      </View>

      {/* pick citizen's id*/}
      <View>
        <View style={styles.row1}>
          {/* pick citizen image to scan */}
          <View style={styles.image}>
            <MyIcon
              icon={AppIcon.icon_image}
              size="50"
              onPress={pickImage}
            />
          </View>
        </View>

        {/* hint*/}
        <Text style={styles.hint}>{languageContext.language.UPLOAD_CITIZEN_ID}</Text>
      </View>

      {/* view id after pick citizen's id*/}
      <View style={styles.input}>
        <InputRegister
          label={languageContext.language.ID}
          value={id}
          required={false}
          onChangeText={() => {
          }}
          placeholder={languageContext.language.ID}
          type="text"
          iconName="user"
          editable={true}
        />
      </View>

      {/* view name after pick citizen's id*/}
      <View style={styles.input}>
        <InputRegister
          label={languageContext.language.FULL_NAME}
          value={name}
          required={false}
          onChangeText={() => {
          }}
          placeholder={languageContext.language.FULL_NAME}
          type="text"
          iconName="user"
          editable={true}
        />
      </View>

      {/* view day of birth after pick citizen's id*/}
      <View style={styles.input}>
        <InputRegister
          label={languageContext.language.DATE_OF_BIRTH}
          value={dayOfBirth}
          required={false}
          onChangeText={() => {
          }}
          placeholder={languageContext.language.DATE_OF_BIRTH}
          type="text"
          iconName="user"
          editable={true}
        />
      </View>

      {/* view gender after pick citizen's id*/}
      <View style={styles.input}>
        <InputRegister
          label={languageContext.language.GENDER}
          value={gender}
          required={false}
          onChangeText={() => {
          }}
          placeholder={languageContext.language.GENDER}
          type="text"
          iconName="user"
          editable={true}
        />
      </View>

      {/* view address after pick citizen's id*/}
      <View style={styles.input}>
        <InputRegister
          label={languageContext.language.HOMETOWN}
          value={address}
          required={false}
          onChangeText={() => {
          }}
          placeholder={languageContext.language.HOMETOWN}
          editable={true}
          type="text"
          iconName="user"
        />
      </View>

      {/*submit button*/}
      <View style={styles.button}>
        {/* submit button */}
        <Button
          title={languageContext.language.REGISTER}
          textColor="white"
          backgroundColor={BackgroundColor.primary}
          onPress={onRegister}
        />

        {/* hint text */}
        <Text style={styles.link} onPress={goToLogin}>{languageContext.language.NOT_HAVE_ACCOUNT_YET}</Text>
      </View>

      <View style={{height: 50}}/>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },

  icon: {
    marginTop: "5%",
    marginLeft: "5%",
  },

  iconInput: {
    left: 10,
    top: 25,
    justifyContent: "center",
  },

  input: {
    top: "0%",
    height: 20,
    width: "90%",
    marginBottom: "17%",
    alignSelf: "center",
  },

  img: {
    width: 150,
    height: 150,
    marginTop: 50,
    borderRadius: 100,
    alignSelf: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: "5%",
  },

  content: {
    fontSize: 14,
    marginBottom: "20%",
  },

  test: {
    top: -10,
  },

  text: {
    top: 5,
    left: 90,
    marginBottom: "-15%",
  },

  link: {
    color: TextColor.sub_primary,
  },

  button: {
    marginTop: "10%",
    alignItems: "center",
  },

  row1: {
    flexDirection: "row", // Đặt các biểu tượng nằm trên cùng một hàng
    justifyContent: "center", // Cân đối khoảng cách giữa các biểu tượng
    marginBottom: 20, // Thêm khoảng cách dưới hàng icon
  },

  image: {
    marginHorizontal: 20,
    marginBottom: 10,
  },

  row: {
    // Đặt các biểu tượng nằm trên cùng một hàng
    marginLeft: "5%", // Cân đối khoảng cách giữa các biểu tượng
    marginBottom: " -12%", // Thêm khoảng cách dưới hàng icon
    justifyContent: "space-evenly",
  },

  textTaiAnh: {
    marginTop: 20,
    alignSelf: "center",
  },

  hint: {
    marginTop: "-10%",
    alignSelf: "center",
    marginBottom: "5%",
  },
});
