import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

type valueAndStatus = {
  content: string;
  color: string;
  colorText: string;
  onPress?: () => void;
}

const Badge = ({ content, color, colorText, onPress }: valueAndStatus) => {
  return (
    <TouchableOpacity style={[styles.badge, {backgroundColor: color}]} onPress={onPress}>
      <Text style={[styles.badgeText, {color: colorText}]}>{content}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    badge: {
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderRadius: 40,
      width: 100,
    },

    badgeText: {
      fontWeight: 'bold',
      textAlign: 'center'
    },
  });

export default Badge;
