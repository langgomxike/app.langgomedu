import React, {useCallback, useContext, useEffect, useState} from "react";
import {View, StyleSheet, Text, ScrollView, Alert, TouchableOpacity} from "react-native";
import BackWithDetailLayout from "../layouts/BackWithDetail";
import {BackgroundColor, BorderColor, TextColor} from "../../configs/ColorConfig";
import RatingC from "../components/Rating";
import RatingHint from "../components/RatingHint";
import {TextInput} from "react-native";
import Button from "../components/Button";
import {LanguageContext} from "../../configs/LanguageConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-simple-toast";
import Spinner from "react-native-loading-spinner-overlay";
import ARating from "../../apis/ARating";
import {NavigationContext, NavigationRouteContext} from "@react-navigation/native";
import Rating from "../../models/Rating";
import {AccountContext} from "../../configs/AccountConfig";
import User from "../../models/User";
import AUser from "../../apis/AUser";
import Class from "../../models/Class";
import {RatingNavigationType} from "../../configs/NavigationRouteTypeConfig";
import {AppInfoContext} from "../../configs/AppInfoContext";

const RatingScreen = () => {
  //contexts
  const language = useContext(LanguageContext).language;
  const navigation = useContext(NavigationContext);
  const accountContext = useContext(AccountContext);
  const route = useContext(NavigationRouteContext);
  const appInfos = useContext(AppInfoContext).infos;

  //set State
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [ratee, setRatee] = useState<User | undefined>(undefined);
  const [_class, setClass] = useState<Class | undefined>(undefined);
  const [suggestedRatingList, setSuggestedRatingList] = useState<string[]>([]);

  //set Handle
  const handleRatingChange = useCallback((newRating: number) => {
    setRating(newRating);
  }, []);

  const handleTagPress = useCallback((index: number) => {
    if (selectedReviews.includes(index)) {
      setSelectedReviews(selectedReviews.filter(i => i !== index));
    } else {
      setSelectedReviews([...selectedReviews, index]);
    }
  }, [selectedReviews]);

  const sendReview = useCallback(() => {
    setLoading(true);
    let ratingContents: string[] = [];

    switch (language.TYPE) {
      case "vi":
        ratingContents = appInfos.suggested_rating_contents.vn;
        break;
      case "en":
        ratingContents = appInfos.suggested_rating_contents.en;
        break;
      case "ja":
        ratingContents = appInfos.suggested_rating_contents.ja;
        break;
    }

    const content = [...ratingContents?.filter((v, i) => selectedReviews.includes(i)), text.trim()].join(", ");

    const newRating = new Rating();
    newRating.content = content;
    newRating.rater = accountContext.account;
    newRating.value = rating;
    newRating.ratee = ratee;
    newRating.class = _class;

    const timeId = setTimeout(() => {
      setLoading(false);
    }, 10000);

    ARating.sendRating(newRating,
      (result) => {
        if (result) {
          Alert.alert(language.RATING_TITLE, language.RATING_SUCCESS, [
            {
              text: "OK",
              onPress: () => {
                navigation?.goBack();
              }
            }
          ]);
        } else {
          Alert.alert(language.RATING_TITLE, language.RATING_FAILURE);
        }
      },
      () => {
        setLoading(false);
        clearTimeout(timeId);
      }
    );
  }, [selectedReviews, text, appInfos.suggested_rating_contents, rating, accountContext.account, ratee, _class]);

  //effects
  useEffect(() => {
    const id: string = (route?.params as RatingNavigationType)?.id;
    const _class = (route?.params as RatingNavigationType)?.class as Class;

    setClass(_class);
    AUser.getUserById(id, (user) => {
      if (user) {
        setRatee(user);
      } else {
        Toast.show(language.INVALID_RATING_TUTOR, 2000);
        navigation?.goBack();
      }
    });
  }, []);

  useEffect(() => {
    switch (language.TYPE) {
      case "vi":
        setSuggestedRatingList(appInfos.suggested_rating_contents.vn);
        break;

      case "en":
        setSuggestedRatingList(appInfos.suggested_rating_contents.en);
        break;

      case "ja":
        setSuggestedRatingList(appInfos.suggested_rating_contents.ja);
        break;
    }
  }, []);

  useEffect(() => {
    if (navigation) {
      navigation.setOptions({
        title: language.RATING_TITLE,
        headerShown: true,
        contentStyle: {
          padding: 0,
        },
        headerStyle: {
          backgroundColor: BackgroundColor.primary,
        },
        headerTintColor: "#fff",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        )
      });
    }
  }, [navigation]);

  return (
    <BackWithDetailLayout icName={""} user={ratee} canGoBack={false}>

      <Spinner visible={loading}/>

      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <>
          {/* rating stars */}
          <RatingC onRatingChange={handleRatingChange}/>

          {/* title comment */}
          <View style={styles.titleBox}>
            <Text style={styles.title}>{language.RATING_TITLE_1}?</Text>
          </View>

          {/* rating hint */}
          <View style={styles.hintRatingBox}>
            {(showAll ? [...suggestedRatingList] : [...suggestedRatingList?.slice(0, 10)])?.map((tag, index) => (
              <RatingHint
                key={index}
                content={tag}
                isActive={selectedReviews.includes(index)}
                onPress={() => handleTagPress(index)}
              />
            ))}

            {!showAll && suggestedRatingList.length > 10 && <RatingHint
              key={suggestedRatingList?.length ?? -1}
              content={"..."}
              isActive={false}
              onPress={() => setShowAll(true)}
            />}
          </View>

          {showAll && <Ionicons onPress={() => setShowAll(false)} style={styles.closeDown} name={"chevron-up-outline"}
                                size={20}/>}

          {/* comments */}
          <Text style={styles.title}>{language.RATING_TITLE_2}:</Text>

          <TextInput
            style={styles.textArea}
            value={text}
            onChangeText={setText}
            placeholder={language.EDIT_HERE}
            placeholderTextColor="gray"
            numberOfLines={8} // Số dòng mặc định
            multiline={true} // Để có thể nhập nhiều dòng
          />

          {/* button send */}
          <Button backgroundColor={BackgroundColor.primary}
                  onPress={sendReview}
                  title={language.SUBMIT}
                  textColor={TextColor.white}
          />
        </>
      </ScrollView>
    </BackWithDetailLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.white,
    alignItems: 'center',
    // height: 450,
    // width: '100%',
  },
  titleBox: {
    marginTop: 0,
  },

  closeDown: {
    alignSelf: "center",
    marginVertical: 10,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BorderColor.primary,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  hintRatingBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 5,
    marginTop: 10,
  },

  textArea: {
    borderColor: BorderColor.gray_30, // Màu viền
    borderWidth: 1, // Độ dày viền
    padding: 10, // Khoảng cách giữa văn bản và viền
    textAlignVertical: 'top', // Văn bản bắt đầu từ đỉnh
    backgroundColor: BackgroundColor.white, // Màu nền
    borderRadius: 5, // Bo góc của textarea
    marginTop: 10,
  }
})

export default RatingScreen;
