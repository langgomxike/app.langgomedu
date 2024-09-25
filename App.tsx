import { StatusBar } from "expo-status-bar";
import {useCallback, useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View, SafeAreaView,
  Image,
  Alert
} from "react-native";

import Search from './src/views/components/Inputs/Seach';
import OptionPopup from './src/views/components/OptionPopup';
import CourseItem from './src/views/components/CourseItem';
import ImagePicker from './src/views/components/ImagePicker';
import languages from "./languages.json";
import {
  LanguageContext,
  Languages,
  LanguageType,
} from "./src/configs/LanguageConfig";

//
import Rating from "./src/views/components/Rating";
import HLine, { HLineType } from "./src/views/components/HLine";
import Badge from "./src/views/components/Badge";
import Buttons from "./src/views/components/Button";
import Box from "./src/views/components/Box";

export enum BadgeBackgroundColor {
  Warning = "#FFB800",
  Primary = "#0D99FF",
  Error = "#FF3D00",
  Dark = "#2F2F2F",
  Light = "#FFFFFF",
  WarningBale = "#FFEFB7",
  PrimaryBale = "#6AC0FF",
  ErrorBale = "#FFA4A4",
  DarkBale = "#C3C3C3",
  LightBale = "#E9ECEE",
}

export enum BadgeTextColor {
  Warning = "#FFB800",
  Primary = "#0D99FF",
  Error = "#FF3D00",
  Dark = "#2F2F2F",
  Light = "#FFFFFF",
}

export enum ButtonBackgroundColor {
  Warning = "#FFB800",
  Primary = "#0D99FF",
  Error = "#FF3D00",
  Light = "#FFFFFF",
  Gray = "#E4E4E4"
}

// Mảng dữ liệu kiểu propsBox
const boxesData = [
  {
      title: "Sub Title 1",
      content: "This is the first content.",
      image: require('./assets/ic_graduate_outline_gradient.png')
  },
  {
      title: "Sub Title 2",
      content: "This is the second content.",
      image:  require('./assets/ic_gradute_and_scroll.png')
  },
  {
      title: "Sub Title 3",
      content: "This is the third content.",
      image:  require('./assets/ic_graduate_outline_gradient.png')
  }
];

export enum ButtonTextColor {
  Dark = "#1E1E1E",
  Light = "#FFFFFF"
}

export default function App() {


  // su kien nhan nut
  const handleButtonPress = () => {
    Alert.alert("Button", "Hello world!!!");
  }

  const handleBadgePress = () => {
    Alert.alert("Badge", "Hello world!!!");
  }


  //refs, contexts

  // states
  const [language, setLanguage] = useState<LanguageType>(languages.VN);
  const [rating, setRating] = useState(0);

  //handlers
  const setLanguageContext = useCallback((language: Languages) => {
    switch (language) {
      case Languages.VN:
        setLanguage(languages.VN);
        break;

      case Languages.EN:
        setLanguage(languages.EN);
        break;

      //Return View
      case Languages.JA:
        setLanguage(languages.JA);
        break;
    }
  }, []);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
  }

  const handleSelectOption = (option: string) => {
    // setSelectedOption(option);
    // setVisibleModal(null);
  }

  const handleImagePicker = (imageUri: string) => {
    // setImage(imageUri);
  }

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
        {/* <Search 
        value={text} 
        onChangeText={setText} 
        /> */}

        {/* Buttom */}
        {/* <Pressable style={styles.btnAdd} onPress={() => setVisibleModal('modal_2')}>
          <Text style={styles.btnAddText}>Add</Text>
        </Pressable> */}

        {/* <Pressable style={styles.btnAdd} onPress={() => setVisibleModal('modal_1')}>
          <Text style={styles.btnAddText}>Show Option</Text>
        </Pressable> */}

        {/* Content */}
        {/* <View>
          <Text>{text}</Text>
          <Text>{selectedOption}</Text>
        </View> */}

        <View>
            <OptionPopup 
            // visible={visibleModal}
            // options={options}
            // onSelect={handleSelectOption}
            // onRequestClose={() => setVisibleModal(null)}
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
          // visible={visibleModal}
          // onRequestClose={() => setVisibleModal(null)}
          onImagePicker={handleImagePicker}
          />
        </View>
        {/* {image && <Image source={{ uri: image }} style={styles.image} />} */}
      

        <View style={styles.badge}>
          <Badge color= {BadgeBackgroundColor.LightBale} content="Badge" colorText= {BadgeTextColor.Primary} onPress={handleBadgePress}/>
        </View>

        <View>
          <Buttons title="title button" textColor={ButtonTextColor.Dark} backgroundColor={ButtonBackgroundColor.Primary} onPress={handleButtonPress}/>
        </View>

        <SafeAreaView>
            {/* Truyền mảng boxesData vào Box component */}
            <Box titleHeader="Title" contents={boxesData}/>
        </SafeAreaView>

      </View>
    </View>
    </LanguageContext.Provider >

  );
}

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
  course: {
  },
  container: {  flex: 1,
    backgroundColor: "#0D99FF",
    alignItems: "center",
    justifyContent: 'flex-start',
    marginTop: 50,
  },

  languageSelector: {
    flexDirection: "row",
    justifyContent: "space-around", // Spread buttons evenly
    marginBottom: 20, // Add some space below the language selector
  },

  horizontalList: {
    marginBottom: 20, 
  },

  badge: {
    justifyContent: "center",
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
