import { Text , View} from "react-native";
import MyIcon,{AppIcon} from "../components/MyIcon";
export default function DuTestScreen() {
  return (
    <>
      <View>
      <Text>Screen test here</Text>
      <MyIcon icon={AppIcon.chat_tab}/>
      <MyIcon icon={AppIcon.chat_tab}/>
      <MyIcon icon={AppIcon.chat_tab}/>
      <MyIcon icon={AppIcon.chat_tab}/>
      <MyIcon icon={AppIcon.chat_tab}/>
      <MyIcon icon={AppIcon.chat_tab}/>
      </View>
    
    </>
  );
}
