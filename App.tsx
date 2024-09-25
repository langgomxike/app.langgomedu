import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
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

//
import Rating from "./src/views/components/Rating";
import HLine, {HLineType} from "./src/views/components/HLine";

export default function App() {
  const tabs: Array<TabItem> = [];

  for (let i = 0; i < 2; i++) {
    const element: TabItem = {
      title: "Tab heloo" + i,
      view: () => <Text>{i}</Text>,
    };

    tabs.push(element);
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

      case Languages.JA:
        setLanguage(languages.JA);
        break;
    }
  }, []);

  const handleRatingChange = (newRating : number) =>{
    setRating(newRating)
  }

  //Return View
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

        {/* <View>
          <HorizontalList
            title="Test list"
            onViewAll={() => alert("hello")}
            list={tabs}
            ItemView={(item) => <Text>{JSON.stringify(item)}</Text>}
          />
          </View> */}
          <Rating onRatingChange={handleRatingChange}/>
          <Text> {rating}</Text>
          <HLine type={HLineType.NORMAL} color="#FFB800"/>
      </View>
      
    </LanguageContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    padding: 100,
  },
});
