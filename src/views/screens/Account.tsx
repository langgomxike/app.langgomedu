import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import BackWithDetailLayout from "../layouts/BackWithDetail";
import { ListItem } from "../../configs/AccountListItemConfig";
import AccountItem, { AccountItemProps } from "../components/AccountItem";
import QRInfo from "../components/QRInfo";
import { QRItems } from "../../configs/QRConfig";
import { useContext, useEffect } from "react";
import { NavigationContext } from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";

export default function AccountScreen() {
  // contexts
  const navigation = useContext(NavigationContext);

  //handlers
  const FlatListItem = ({
    item,
    index,
  }: {
    item: AccountItemProps;
    index: number;
  }) => {
    //handlers
    const handlers = [
      () => {},
      () => {
        navigation?.navigate(ScreenName.CV);
      },
      () => {},
      () => {},
      () => {},
      () => {},
      () => {},
      () => {},
    ];

    return (
      <View>
        <AccountItem
          iconName={item.iconName}
          title={item.title}
          screenName={item.screenName}
        />
      </View>
    );
  };

  navigation?.navigate(ScreenName.CV);

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
