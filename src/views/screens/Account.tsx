import { Text, View, FlatList, StyleSheet } from "react-native";
import BackWithDetailLayout from "../layouts/BackWithDetail";
import { ListItem } from "../../configs/AccountListItemConfig";
import AccountItem, { AccountItemProps } from "../components/AccountItem";
import QRInfo from "../components/QRInfo";
import { QRItems } from "../../configs/QRConfig";

export default function AccountScreen() {
  const FlatListItem = ({ item }: { item: AccountItemProps }) => {
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
