import { StatusBar } from "expo-status-bar";
import { Alert, StyleSheet, Text, View, SafeAreaView } from "react-native";
import Tab, { TabItem } from "./src/views/components/Tab";
import Pagination from "./src/views/components/Pagination";
import HorizontalList from "./src/views/components/HorizontalList";
import { useCallback, useContext, useState } from "react";
import languages from "./languages.json";
import {
  LanguageContext,
  Languages,
  LanguageType,
} from "./src/configs/LanguageConfig";
import Badge from "./src/views/components/Badge";
import Button from "./src/views/components/Button";
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

  const tabs: Array<TabItem> = [];

  for (let i = 0; i < 2; i++) {
    const element: TabItem = {
      title: "Tab avcgfdgcydgcyd" + i,
      view: () => <Text>{i}</Text>,
    }; 

    // tabs.push(element);
  }

  //refs, contexts

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

  return (
    <LanguageContext.Provider
      value={{ language: language, setLanguage: setLanguageContext }}
    >
      <View style={styles.container}>
        <View>
          <Text onPress={() => setLanguageContext(Languages.VN)}>VN</Text>
          <Text onPress={() => setLanguageContext(Languages.EN)}>EN</Text>
          <Text onPress={() => setLanguageContext(Languages.JA)}>JA</Text>
        </View>

        <View style={styles.horizontalList}>
          <HorizontalList
            title="Test list"
            onViewAll={() => alert("hello")}
            list={tabs}
            ItemView={(item) => <Text>{JSON.stringify(item)}</Text>}
          />
        </View>

        <View style={styles.badge}>
          <Badge color= {BadgeBackgroundColor.LightBale} content="Badge" colorText= {BadgeTextColor.Primary} onPress={handleBadgePress}/>
        </View>

        <View>
          <Button title="title button" textColor={ButtonTextColor.Dark} backgroundColor={ButtonBackgroundColor.Primary} onPress={handleButtonPress}/>
        </View>

        <SafeAreaView>
            {/* Truyền mảng boxesData vào Box component */}
            <Box titleHeader="Title" contents={boxesData}/>
        </SafeAreaView>

      </View>
    </LanguageContext.Provider>

  );
}

const styles = StyleSheet.create({
  container: {
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
    alignItems: "center",
  },
});
