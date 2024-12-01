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
    tabList: {label: string; value: string; }[],
    onTabChange: (tab: string) => void
}


export default function TabHeader({tabList, onTabChange}: TabHeader) {

    const [activeTab, setActiveTab] = useState(tabList[0].value);

    const handleTabPress = (tab: string) => {
      setActiveTab(tab);
      onTabChange(tab);
    };
    return (
        <FlatList
          data={tabList}
          renderItem={({ item: tab, index }) => (
            <TouchableOpacity
              style={[styles.btnTab]}
              onPress={() => handleTabPress(tab.value)}
            >
              <Text
                style={[
                  styles.textTab,
                  activeTab === tab.value && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
              {activeTab === tab.value && (
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
        justifyContent: "space-between",
        flexGrow: 1, 
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