import {useCallback, useContext, useState} from "react";
import {View, StyleSheet, Text, ScrollView} from "react-native";
import BackWithDetailLayout from "../layouts/BackWithDetail";
import {BackgroundColor, BorderColor, TextColor} from "../../configs/ColorConfig";
import Rating from "../components/Rating";
import RatingHint from "../components/RatingHint";
import {TextInput} from "react-native";
import Button from "../components/Button";
import {LanguageContext} from "../../configs/LanguageConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-simple-toast";

const RatingScreen = () => {
  //contexts
  const language = useContext(LanguageContext).language;

  //set State
  const [rating, setRating] = useState(5);
  const [activeTag, setActiveTag] = useState(-1);
  const [text, setText] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState<number[]>([]);

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
    alert(rating + [...language.RATING?.filter((v, i) => selectedReviews.includes(i)), text.trim()].join(", "))
  }, [selectedReviews, text, language, rating]);

  return (
    <BackWithDetailLayout icName="Back">
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <>
          {/* rating stars */}
          <Rating onRatingChange={handleRatingChange}/>

          {/* title comment */}
          <View style={styles.titleBox}>
            <Text style={styles.title}> Bạn cảm thấy gia sư của bạn </Text>
            <Text style={styles.title}> như thế nào? </Text>
          </View>

          {/* rating hint */}
          <View style={styles.hintRatingBox}>
            {(showAll ? [...language.RATING] : [...language.RATING?.slice(0, 10)])?.map((tag, index) => (
              <RatingHint
                key={index}
                content={tag}
                isActive={selectedReviews.includes(index)}
                onPress={() => handleTagPress(index)}
              />
            ))}

            {!showAll && <RatingHint
              key={language.RATING?.length ?? -1}
              content={"..."}
              isActive={false}
              onPress={() => setShowAll(true)}
            />}
          </View>

          {showAll && <Ionicons onPress={() => setShowAll(false)} style={styles.closeDown} name={"chevron-up-outline"} size={20}/>}

          {/* comments */}
          <Text style={styles.title}> Hãy để lại cảm nhận của bạn về gia sư này. </Text>

          <TextInput
            style={styles.textArea}
            value={text}
            onChangeText={setText}
            placeholder="Nhập văn bản tại đây..."
            placeholderTextColor="gray"
            numberOfLines={8} // Số dòng mặc định
            multiline={true} // Để có thể nhập nhiều dòng
          />

          {/* button send */}
          <Button backgroundColor={BackgroundColor.primary}
                  onPress={sendReview}
                  title="Gui Danh Gia"
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
  },
})

export default RatingScreen;
