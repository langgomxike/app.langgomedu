import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionicons from "@expo/vector-icons/Ionicons";
import { BackgroundColor } from '../../../configs/ColorConfig';

type ItemManagerProps = {
    title: string,

}

export default function ItemManager({title}: ItemManagerProps) {
  return (
        <TouchableOpacity style={[styles.itemContainer, styles.boxshadow]}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="black" />
        </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: BackgroundColor.white,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 20,
      },
    
      title: {
        fontWeight: "bold",
        fontSize: 16,
      },
    
      boxshadow: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    
        elevation: 5,
      },
})