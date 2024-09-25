import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type propsButton = {
    title: string;
    textColor: string;
    backgroundColor: string;
    onPress: () => void;
}


const Button = ({title,textColor, backgroundColor, onPress} : propsButton) => {
    return (
        <TouchableOpacity style={[styles.button, {backgroundColor: backgroundColor}]} onPress={onPress}>
            <Text style={[styles.text, {color: textColor}]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
      padding: 10,
      margin: 15,
      borderRadius: 20,
      alignItems: 'center',
      width: 200
    },
    text: {
      fontSize: 16,
      alignItems: 'center',
      fontWeight: 'bold'
    },
  });
  
  export default Button;