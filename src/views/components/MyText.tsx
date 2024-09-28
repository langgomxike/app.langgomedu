import React from "react";
import { Text, View, TouchableOpacity, StyleSheet} from "react-native";

// Định nghĩa enum AppText ở đầu file
export enum AppText {
  hello = "QuanAP",
  hi = "Mono",
  konichiha = "KhoaiLangThang",
}

type HintTextProps = {
  hint: AppText; // Sử dụng AppText cho prop hint
  onPress: () => void;
};

const MyText: React.FC<HintTextProps> = ({ hint, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <Text style={styles.myTextStyle}>{hint}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MyText;

const styles = StyleSheet.create({
  myTextStyle: {
    fontSize: 15,
    color:'#000000',
    textAlign:'center',
  }
});