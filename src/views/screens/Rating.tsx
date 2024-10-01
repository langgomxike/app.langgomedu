import { useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import BackWithDetailLayout from "../layouts/BackWithDetail";
import { BackgroundColor, BorderColor, TextColor } from "../../configs/ColorConfig";
import Rating from "../components/Rating";
import RatingHint from "../components/RatingHint";
import { TextInput } from "react-native";
import Button from "../components/Button";

const RatingScreen = () => {
    const tags = ['Thú Vị', 'Nhiệt Huyết', 'Tận tâm', 'Hiền', 'Rất tốt', '...'];

    //set State
    const [rating, setRating] = useState(0);

    const [activeTag, setActiveTag] = useState(-1);

    const [text, setText] = useState('');

    //set Handle

    const handleRatingChange = (newRating: number) => {
        setRating(newRating)
        console.log(rating);
    }

    const handleTagPress = (index: number) => {
        setActiveTag(index);
        console.log(activeTag);

    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <BackWithDetailLayout icName="Back" >
                <View style={styles.container}>
                    {/* rating stars */}
                    <Rating onRatingChange={handleRatingChange} />
                    {/* title comment */}
                    <View style={styles.titleBox}>
                        <Text style={styles.title} > Bạn cảm thấy gia sư của bạn </Text>
                        <Text style={styles.title}> như thế nào? </Text>
                    </View>
                    {/* rating hint */}
                    <View style={styles.hintRatingBox}>
                        {tags.map((tag, index) => (
                            <RatingHint
                                key={index}
                                content={tag}
                                isActive={activeTag === index}
                                onPress={() => handleTagPress(index)}
                            />
                        ))}
                    </View>
                    {/* comments */}
                    <Text style={styles.title}> Hãy để lại cảm nhận của bạn về gia sư này. </Text>
                    <TextInput
                        style={styles.textArea}
                        value={text}
                        onChangeText={setText}
                        placeholder="Nhập văn bản tại đây..."
                        placeholderTextColor="gray"
                        numberOfLines={4} // Số dòng mặc định
                        multiline={true} // Để có thể nhập nhiều dòng
                    />
                    {/* button send */}
                    <Button backgroundColor={BackgroundColor.primary}
                    onPress={()=>{}}
                    title="Gui Danh Gia"
                    textColor={TextColor.white}
                    />

                </View>
            </BackWithDetailLayout>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: BackgroundColor.white,
        alignItems: 'center',
        height: 450,
        width: '100%',
    },
    titleBox: {
        marginTop: 0,
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
        width: '80%',
        height: 150, // Chiều cao của textarea
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
