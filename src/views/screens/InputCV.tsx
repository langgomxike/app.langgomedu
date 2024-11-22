import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BackLayout from "../layouts/Back";
import Ionicons from "@expo/vector-icons/Ionicons";
import FloatingBack from "../components/FloatingBack";
import { ScrollView } from "react-native-gesture-handler";
import {
  BarcodeScanningResult,
  Camera,
  useCameraPermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useContext, useEffect, useState } from "react";
import SLog, { LogType } from "../../services/SLog";
import CustomInput from "../components/Inputs/CustomInput";
import Input from "../components/Inputs/CVInput";
import DatePickerInput from "../components/Inputs/DatePickerInput";
import CvBoxEdit from "../components/CV/CVBoxEdit";
import ACV from "../../apis/ACV";
import { UserContext } from "../../configs/UserContext";
import CV from "../../models/CV";
import User from "../../models/User";
import Major from "../../models/Major";
import moment from 'moment';
import { BackgroundColor } from "../../configs/ColorConfig";
import Address from "../../models/Address";

const AVATAR_SIZE = 100;

export default function InputCVScreen() {
  //context
  const {user, setUser} = useContext(UserContext);

  //states
  const [permission, requestPermission] = useCameraPermissions();
  const [cv, setCV] = useState<CV>();
  const [userInfo, setUserInfo] = useState<User>();
  const [address, setAddress] = useState<Address>();
  const [birthday, setBirthday] = useState<string>('');
  const [interestedMajor, setInterestedMajor] = useState<Major>()


  //handlers
  const pickImage = useCallback(() => {
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
      });
  }, [permission]);

  //effect
  useEffect(()=>{
    ACV.getPersonalCV(user.ID, (cv)=>{
      if(cv){
        setCV(cv);
        // console.log('log in screen', JSON.stringify(cv?.user, null, 2));
        setUserInfo(cv.user); 
        setAddress(cv.user?.address);
        // const priorityMajor = cv.interested_majors.find(major => major.priority === 0)
        // setInterestedMajor(priorityMajor ? priorityMajor.major :cv.interested_majors[0].major)
        // console.log(cv.interested_majors[0].major);
        console.log(interestedMajor);
        
        if(cv.user){
          const birthday = new Date(cv.user?.birthday);
          // const birthdayData = birthday.getDate() + '/' + (birthday.getMonth() +1) + '/' + birthday.getFullYear()
          const birthdayData = moment(birthday)
          setBirthday(birthdayData.format('DD/MM/yyyy'));
          // console.log('birthday', birthdayData);
        }
        
      }
    })
  },[])

  return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
    <View>
        <TouchableOpacity style={{ alignSelf: "center" }} onPress={pickImage}>
          <Image
            source={require("../../../assets/avatar/img_avatar_cat.png")}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <Input 
        label="Tieu De Cong Viec" 
        onTextChange={()=>{}} 
        placeholder={"Tieu de cong viec"}
        value={cv?.title}
        require={true}
        editable={true}
        />

        <Input 
        label="Tên"
        onTextChange={()=>{}}
        placeholder={cv?.user?.full_name}
        />

        <Input 
        label="Chuyên Ngành"
        onTextChange={()=>{}}
        placeholder={interestedMajor?.vn_name}
        />

        <Input 
        label="Ngày Sinh"
        onTextChange={()=>{}}
        placeholder={birthday}
        datePicker={true}/>

        <Input
        label="Số điện thoại"
        onTextChange={()=>{}}
        placeholder={userInfo?.phone_number}
        />

        <Input
        label="Địa Chỉ"
        onTextChange={()=>{}}
        placeholder={`${address?.province}, ${address?.district}, ${address?.ward}, ${address?.detail}`}
        />

        {/* <Input
        label="Email"
        onTextChange={()=>{}}
        placeholder={userInfo?.email}
        /> */}

        <Input 
        label="Mo ta ban than"
        onTextChange={()=>{}}
        placeholder="nhap mo ta cua ban o day"
        value={cv?.biography}
        textArea={true}
        editable={true}
        />

    
        <CvBoxEdit 
        typeItem="experience"
        title="experiences">
        </CvBoxEdit>

        <CvBoxEdit 
        typeItem="skills"
        title="skills">
        </CvBoxEdit>

        <CvBoxEdit 
        typeItem="certificate"
        title="certificates">
        </CvBoxEdit>
    </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: BackgroundColor.white
  },

  avatar: {
    borderRadius: 50,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignSelf: "center",
    marginTop: 20,
  },
});
