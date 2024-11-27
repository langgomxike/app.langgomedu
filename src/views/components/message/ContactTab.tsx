import {TabItem} from "../Tab";
import {useCallback, useContext, useEffect, useState} from "react";
import {NavigationContext} from "@react-navigation/native";
import User from "../../../models/User";
import ScreenName from "../../../constants/ScreenName";
import AMessage from "../../../apis/AMessage";
import {ScrollView, Text, View} from "react-native";
import ChatContactItem from "../ChatContactItem";
import {SearchContext} from "../../screens/Chat";

const contactTab: TabItem = {
  title: "Contacts",
  view: () => {
    //contexts
    const searchContext = useContext(SearchContext);
    const navigation = useContext(NavigationContext);

    //states
    const [contacts, setContacts] = useState<Array<User>>([]);

    //handlers
    const handleFilter = useCallback(
      (contact: User) => {
        return (
          contact.full_name
            ?.toLowerCase()
            ?.includes(searchContext?.toLowerCase()) ||
          contact?.phone_number
            ?.toLowerCase()
            ?.includes(searchContext?.toLowerCase()) ||
          searchContext
            ?.toLowerCase()
            ?.includes(contact.full_name?.toLowerCase()) ||
          searchContext
            ?.toLowerCase()
            ?.includes(contact?.phone_number?.toLowerCase())
        );
      },
      [searchContext]
    );

    const handleGoToProfile = useCallback(() => {
      navigation?.navigate(ScreenName.PROFILE);
    }, []);

    //effects
    useEffect(() => {
      AMessage.getContactsOfUser((contacts: User[]) => {
        setContacts(contacts);
      });
    }, []);

    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {contacts.filter(handleFilter).map((contact) => (
          <ChatContactItem
            key={contact.id}
            user={contact}
            onPress={handleGoToProfile}
          />
        ))}

        {contacts.length < 1 && (
          <Text style={{flex: 1, alignSelf: "center", marginTop: 20}}>Danh sach trong</Text>
        )}

        <View style={{height: 70}}/>
      </ScrollView>
    );
  },
};

export default contactTab;