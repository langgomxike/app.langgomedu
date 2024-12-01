import { FlatList } from "react-native-gesture-handler";
import CustomShimmer from "./CustomShimmer";
import { Dimensions } from "react-native";

const {width, height} = Dimensions.get("window")
export default function ClassListSkeleton() {
    return (
        <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            data={[1, 1]}
            renderItem={(item) => (
               <CustomShimmer width={width * 0.8} height={350} style={{marginRight: 20}} />
            )}
            contentContainerStyle={{ padding: 10,}}
          />
    )
}