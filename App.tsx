import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";

import Search from './src/views/components/Inputs/Seach';
import CustomInput from './src/views/components/Inputs/CustomInput';
import InputRegister from './src/views/components/Inputs/InputRegister';
import OptionPopup from './src/views/components/OptionPopup';
import CourseItem from './src/views/components/CourseItem';
import ImagePicker from './src/views/components/ImagePicker';
import languages from "./languages.json";
import {
  LanguageContext,
  Languages,
  LanguageType,
} from "./src/configs/LanguageConfig";

export default function App() {
  const [text, setText] = useState<string>('');
  const options = ["Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "History",
  "Geography",
  "English Literature"
];
  
  const [selectedOption, setSelectedOption] = useState("");
  const [visibleModal, setVisibleModal] = useState<string | null>(null);
  const [image, setImage] = useState("");
  const [inputvalue, setInputValue] = useState("");
  const [inputTextareaValue, setInputTextareaValue] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSelectOption = (option:string) => {
    setSelectedOption(option);
    setVisibleModal(null);
  }

  const handleImagePicker = (imageUri:string) => {
    setImage(imageUri);
  }

// states
const [language, setLanguage] = useState<LanguageType>(languages.VN);

//handlers
const setLanguageContext = useCallback((language: Languages) => {
  switch (language) {
    case Languages.VN:
      setLanguage(languages.VN);
      break;

    case Languages.EN:
      setLanguage(languages.EN);
      break;

    case Languages.JA:
      setLanguage(languages.JA);
      break;
  }
}, []);
  // jxs
  return (
    <LanguageContext.Provider
      value={{ language: language, setLanguage: setLanguageContext }}
    >
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTest}>Todo list</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
      <View>
          <Text onPress={() => setLanguageContext(Languages.VN)}>VN</Text>
          <Text onPress={() => setLanguageContext(Languages.EN)}>EN</Text>
          <Text onPress={() => setLanguageContext(Languages.JA)}>JA</Text>
        </View>

        {/* Input */}
        <Search 
        value={text} 
        onChangeText={setText} 
        />

        <CustomInput
        label="Nhập tên"
        required={true}
        value={inputvalue}
        onChangeText={setInputValue}
        placeholder="Input here"
        type="password"
        style={{marginBottom: 30}}
        />

      <Text>{inputvalue}</Text>

        <CustomInput
        label="Bạn cảm thấy như thế nào"
        required={true}
        value={inputTextareaValue}
        onChangeText={setInputTextareaValue}
        placeholder="Input here"
        type="textarea"
        />

      <Text>{inputTextareaValue}</Text>

      <InputRegister
        label="Nhập mật khẩu của bạn"
        required={true}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Nhập mật khẩu"
        type="password"
        iconName="password"
        />

        {/* <InputDatePicker
        label="Chọn ngày"
        required={true}
        onChangeText={setInputValue}
        placeholder="Chon ngày"
        /> */}

       

        {/* Buttom */}
        <Pressable style={styles.btnAdd} onPress={() => setVisibleModal('modal_2')}>
          <Text style={styles.btnAddText}>Add</Text>
        </Pressable>

        <Pressable style={styles.btnAdd} onPress={() => setVisibleModal('modal_1')}>
          <Text style={styles.btnAddText}>Show Option</Text>
        </Pressable>

        {/* Content */}
        <View>
          <Text>{text}</Text>
          <Text>{selectedOption}</Text>
        </View>

        <View>
            <OptionPopup 
            visible={visibleModal}
            options={options}
            onSelect={handleSelectOption}
            onRequestClose={() => setVisibleModal(null)}
            />
        </View>

        {/* CouseItem */}
        <View style={styles.course}>
          <CourseItem
          name="Tìm gia sư dạy toán"
          level="Lớp 12"
          date="24/09/2024"
          time={4}
          type="Tại nhà"
          address="Linh Chiểu, Thủ Đức"
          cost={200000}

          />
        </View>

        {/* Image Picker */}
        <View>
          <ImagePicker
          visible={visibleModal}
          onRequestClose={() => setVisibleModal(null)}
          onImagePicker={handleImagePicker}
          />
        </View>
        {image && <Image source={{ uri: image }} style={styles.image} />}
      
      </View>
    </View>
    </LanguageContext.Provider>
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
    marginTop: 20,
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
