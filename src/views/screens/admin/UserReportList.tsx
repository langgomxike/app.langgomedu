import {View, Text, StyleSheet, Image, FlatList} from 'react-native'
import React, {useState} from 'react'
import {BackgroundColor, TextColor} from '../../../configs/ColorConfig';
import UserComponent from '../../components/admin/UserComponent';
import DetailUserBottomSheet from '../../components/bottom-sheet/DetailUserBottomSheet';
import {ScrollView} from 'react-native';

export default function UserReportList() {
  // states
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Image
            source={{uri: "https://cdn-icons-png.flaticon.com/512/4322/4322991.png"}}
            style={styles.userAvatar}
          />
          <Text style={styles.userName}>Đỗ Tuấn Anh</Text>
          <Text style={styles.userName}>1000</Text>
        </View>
        <View style={styles.bodyContainer}>
          <FlatList
            scrollEnabled={false}
            data={[1, 2, 3, 4]}
            renderItem={({item}) => (
              // <UserComponent
              // onPressOpenSheet={handleOpenBottomSheet}
              // isButtonDetailReport={true}/>
              <View></View>
            )}
            contentContainerStyle={{paddingHorizontal: 10,}}
            showsVerticalScrollIndicator={false}
          />

        </View>
      </ScrollView>
      {/* <DetailUserBottomSheet
            isVisible={isVisible}
            onCloseButtonSheet={() => setIsVisible(false)}
        /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 40,
  },

  headerContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: BackgroundColor.primary,
    paddingBottom: 60,
  },

  userAvatar: {
    width: 70,
    height: 70,
    marginBottom: 20,
    marginTop: 20,
  },

  userName: {
    color: TextColor.white,
    fontWeight: "bold",
    fontSize: 18,
    paddingBottom: 10,
  },

  bodyContainer: {
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 10,
    paddingTop: 30,
    backgroundColor: BackgroundColor.white,
  },
});