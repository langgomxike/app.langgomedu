import { FlatList, StyleSheet, View } from "react-native";
import CustomShimmer from "./CustomShimmer";

export default function ListMajorSkeleton() {
    return (
        <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={[1,1,1,1]}
            renderItem={({ item, index }) => (
              <View style={styles.listMajorContainer}>
                <CustomShimmer width={80} height={100}/>
              </View>
            )}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />
    )
}

const styles = StyleSheet.create({
    listMajorContainer: {
        flexDirection: "row",
        marginBottom: 20,
        gap: 20,
        paddingHorizontal: 10,
      },
})