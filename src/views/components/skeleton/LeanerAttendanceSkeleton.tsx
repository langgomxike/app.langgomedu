import { View, StyleSheet } from 'react-native'
import React from 'react'
import CustomShimmer from './CustomShimmer'
import { FlatList } from 'react-native-gesture-handler'


export default function LeanerAttendanceSkeleton() {
  return (
    <View style={styles.container}>
        <FlatList
        data={[1,1,1]}
        renderItem={
            (item) => (
                <CustomShimmer height={80} width={300} style={{marginRight: 10}}/>
            )
        }
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        />
      
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginTop: 10
    }
})