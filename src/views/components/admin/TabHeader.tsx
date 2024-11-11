import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from "react-native";
import { BackgroundColor, TextColor } from "../../../configs/ColorConfig";

type TabHeader = {
    tabList: string[]
}


export default function TabHeader({tabList}: TabHeader) {

    const [status, setStatus] = useState("Tất cả");

    const headleSetStatusFilter = (newStatus: string, index:number) => {
        setStatus(newStatus);
      };
    return (
        <FlatList
          data={tabList}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.btnTab]}
              onPress={() => headleSetStatusFilter(item, index)}
            >
              <Text
                style={[
                  styles.textTab,
                  status === item && styles.tabTextActive,
                ]}
              >
                {item}
              </Text>
              {status === item && (
                <View style={[styles.bottomLine]}></View>
              )}
            </TouchableOpacity>
          )}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.listTab}
          contentContainerStyle={styles.tabListContentContainer}
        />
    )
}

const styles = StyleSheet.create({
    listTab: {
        paddingVertical: 10,
      },
    
      tabListContentContainer: {
        paddingHorizontal: 20,
      },
    
      btnTab: {
        paddingRight: 20,
      },
    
      textTab: {
        fontWeight: "500",
        textAlign: "center"
      },
    
      tabTextActive: {
        color: TextColor.primary,
      },
    
      bottomLine: {
        marginTop: 8,
        height: 3,
        borderRadius: 99,
        backgroundColor: BackgroundColor.primary,
      },
})