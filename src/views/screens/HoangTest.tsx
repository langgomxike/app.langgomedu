import { useCallback, useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
} from "react-native";

// import Search from '../components/Inputs/Seach';
// import CustomInput from '../components/Inputs/CustomInput';
// import InputRegister from '../components/Inputs/InputRegister';
// import GenderInput from '../components/Inputs/GenderInput';
// import OptionPopup from '../components/OptionPopup';
// import CourseItem from '../components/CourseItem';
// import ImagePicker from '../components/ImagePicker';

import Home from './Home'
import ClassDetail from './ClassDetail'
import ClassList from './ClassList'
import CVList from './CVList'
import History from "./History";

export default function HoangTestScreen() {
  const [selectedOption, setSelectedOption] = useState("");
  const [visibleModal, setVisibleModal] = useState<string | null>(null);
  const [image, setImage] = useState("");
  const [inputvalue, setInputValue] = useState("");
  const [inputTextareaValue, setInputTextareaValue] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [text, setText] = useState<string>('');
  const [gender, setGender] = useState<number>(0); // 0: Female, 1: male

//   const options = ["Mathematics",
//     "Physics",
//     "Chemistry",
//     "Biology",
//     "Computer Science",
//     "History",
//     "Geography",
//     "English Literature"
//   ];

//   const handleSelectOption = (option:string) => {
//     setSelectedOption(option);
//     setVisibleModal(null);
//   }

//   const handleImagePicker = (imageUri:string) => {
//     setImage(imageUri);
//   }

  return (
    //#region example component
    // <ScrollView>
    //   <View style={styles.container}>
    //   {/* Header */}
    //   <View style={styles.header}>
    //     <Text style={styles.headerTest}>Todo list</Text>
    //   </View>

    //   {/* Body */}
    //   <View style={styles.body}>

    //     {/* Input */}
    //     <Search 
    //     value={text} 
    //     onChangeText={setText} 
    //     />

    //     <CustomInput
    //     label="Nhập tên"
    //     required={true}
    //     value={inputvalue}
    //     onChangeText={setInputValue}
    //     placeholder="Input here"
    //     type="password"
    //     style={{marginBottom: 30}}
    //     />

    //   <Text>{inputvalue}</Text>

    //     <CustomInput
    //     label="Bạn cảm thấy như thế nào"
    //     required={true}
    //     value={inputTextareaValue}
    //     onChangeText={setInputTextareaValue}
    //     placeholder="Input here"
    //     type="textarea"
    //     />

    //   <Text>{inputTextareaValue}</Text>

    //   <GenderInput
    //   value={gender}
    //   onChange={setGender}
    //   styleInputWidth={{width: "30%"}}
    //   style={{marginTop: 30, marginBottom: 30}}
    //   />

    //   <InputRegister
    //     label="Nhập mật khẩu của bạn"
    //     required={true}
    //     value={phoneNumber}
    //     onChangeText={setPhoneNumber}
    //     placeholder="Nhập mật khẩu"
    //     type="password"
    //     iconName="password"
    //     />

        

    //     {/* <InputDatePicker
    //     label="Chọn ngày"
    //     required={true}
    //     onChangeText={setInputValue}
    //     placeholder="Chon ngày"
    //     /> */}

       

    //     {/* Buttom */}
    //     <Pressable style={styles.btnAdd} onPress={() => setVisibleModal('modal_2')}>
    //       <Text style={styles.btnAddText}>Add</Text>
    //     </Pressable>

    //     <Pressable style={styles.btnAdd} onPress={() => setVisibleModal('modal_1')}>
    //       <Text style={styles.btnAddText}>Show Option</Text>
    //     </Pressable>

    //     {/* Content */}
    //     <View>
    //       <Text>{text}</Text>
    //       <Text>{selectedOption}</Text>
    //     </View>

    //     <View>
    //         <OptionPopup 
    //         visible={visibleModal}
    //         options={options}
    //         onSelect={handleSelectOption}
    //         onRequestClose={() => setVisibleModal(null)}
    //         />
    //     </View>

    //     {/* CouseItem */}
    //     <View style={styles.course}>
    //       <CourseItem
    //       name="Tìm gia sư dạy toán"
    //       level="Lớp 12"
    //       date="24/09/2024"
    //       time={4}
    //       type="Tại nhà"
    //       address="Linh Chiểu, Thủ Đức"
    //       cost={200000}

    //       />
    //     </View>

    //     {/* Image Picker */}
    //     <View>
    //       <ImagePicker
    //       visible={visibleModal}
    //       onRequestClose={() => setVisibleModal(null)}
    //       onImagePicker={handleImagePicker}
    //       />
    //     </View>
    //     {image && <Image source={{ uri: image }} style={styles.image} />}
      
    //   </View>
    // </View>
    // </ScrollView>
    //#endregion
    <View style={styles.container}>
      {/* <Home></Home> */}
      {/* <ClassList></ClassList> */}
      {/* <ClassDetail></ClassDetail> */}
      {/* <CVList></CVList> */}
      {/* <History/> */}
      {/* <UserManager/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
  course : {
  },
  container: {
    flex: 1,
    // backgroundColor: "#0D99FF",
    // alignItems: "center",
    // justifyContent: "center",
    // marginTop: 20,
  },

  header: {
    backgroundColor: "orange",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  headerTest: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "600",
  },

  body: {
    paddingHorizontal: 10,
    marginTop: 10,
  },

  btnAdd: {
    backgroundColor: "#0D99FF",
    padding: 15,
    borderRadius: 7,
    marginTop: 50,
  },

  btnAddText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});
