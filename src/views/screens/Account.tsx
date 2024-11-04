import { View, FlatList, StyleSheet } from "react-native";
import BackWithDetailLayout from "../layouts/BackWithDetail";
import { AccountScreenProps, ListItem, Type } from "../../configs/AccountListItemConfig";
import AccountItem, { AccountItemProps } from "../components/AccountItem";
import QRInfo from "../components/QRInfo";
import { QRItems } from "../../configs/QRConfig";
import ScreenName from "../../constants/ScreenName";

export default function AccountScreen(props : any) {
  const {navigation} = props;
  const FlatListItem = ({ item }: { item: AccountScreenProps }) => {
    return (
      <View>
        <AccountItem
          iconName={item.iconName}
          title={item.title}
          screenName={item.screenName}
          type={item.type}
          onNext={handleOnClickedItem}
        />
      </View>
    );
  };

  //handler
  const handleOnNavigate = (screenName: ScreenName)=> {
    navigation.navigate(screenName);
  }
  const handleOnClickedItem = (settingType: Type, screenName?: ScreenName) => {
    switch (settingType) {
      case Type.screen:
        navigation.navigate(screenName)
        break;
      case Type.popup:
        alert("this is select popup");
        break;
      default:
        alert("this is function")
        break;
    }
  }

  return (
    <>
      <QRInfo id={123} type={QRItems.USER} />
      <BackWithDetailLayout icName="Back">
        <View>
          <FlatList
            data={ListItem}
            renderItem={FlatListItem}
            keyExtractor={(item) => item.title}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </BackWithDetailLayout>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
