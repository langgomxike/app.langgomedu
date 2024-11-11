import React from "react";
import { Text, View, TouchableOpacity, StyleSheet} from "react-native";

// Định nghĩa enum AppText ở đầu file

type HintTextProps = {
  text?: string; // Sử dụng AppText cho prop hint
  onPress?: () => void;
};

const MyText: React.FC<HintTextProps> = ({ text, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <Text style={styles.myTextStyle}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MyText;

const styles = StyleSheet.create({
  myTextStyle: {
    fontSize: 15,
    color:'#000000',
  
  }
});
