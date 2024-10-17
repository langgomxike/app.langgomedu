import { FlatList } from "react-native-gesture-handler";
import CustomShimmer from "./CustomShimmer";

export default function ClassListSkeleton() {
    return (
        <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            data={[1, 1]}
            renderItem={(item) => (
               <CustomShimmer width={320} height={320} style={{marginRight: 20}} />
            )}
            contentContainerStyle={{paddingHorizontal: 20}}
          />
    )
}