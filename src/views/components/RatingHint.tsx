import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { BackgroundColor, BorderColor, TextColor } from "../../configs/ColorConfig";

type prop = {
    content: string,
    isActive: boolean,
    onPress: () => void,
}

const RatingHint = ({ content, isActive, onPress }: prop) => {
    return (
        <TouchableOpacity 
        style={[styles.container,isActive && styles.activeRatingHintBox ]}
        onPress={onPress}>
            <Text style={[styles.text, isActive && styles.activeRatingHintText]}> {content} </Text>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderWidth: 1,
        borderColor: BorderColor.primary,
        borderRadius: 10,
        margin: 5,
    },
    text: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: TextColor.primary
    },
    activeRatingHintBox: {
        backgroundColor: BackgroundColor.primary, // Màu nền khi được chọn
    },
    activeRatingHintText: {
        color: TextColor.white, // Màu chữ khi được chọn
    },
})

export default RatingHint;
