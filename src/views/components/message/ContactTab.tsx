import {TabItem} from "../Tab";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {NavigationContext} from "@react-navigation/native";
import User from "../../../models/User";
import ScreenName from "../../../constants/ScreenName";
import AMessage from "../../../apis/AMessage";
import {Image, ScrollView, StyleSheet, Text, View} from "react-native";
import ChatContactItem from "../ChatContactItem";
import {LanguageContext} from "../../../configs/LanguageConfig";
import SFirebase, {FirebaseNode} from "../../../services/SFirebase";
import CustomShimmer from "../skeleton/CustomShimmer";
import {SearchContext} from "../../../configs/AppContext";
import {IdNavigationType} from "../../../configs/NavigationRouteTypeConfig";

const fakeContacts: number[] = [];

for (let i = 0; i < 10; i++) {
  fakeContacts.push(i);
}


const contactTab: TabItem = {
  view: () => {
    //contexts
    const searchContext = useContext(SearchContext);
    const navigation = useContext(NavigationContext);
    const language = useContext(LanguageContext).language;

    //states
    const [contacts, setContacts] = useState<Array<User>>([]);
    const [loading, setLoading] = useState(false);

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

    const handleGoToProfile = useCallback((userId: string) => {
      const data : IdNavigationType = {
        id: userId,
      }
      navigation?.navigate(ScreenName.PROFILE, data);
    }, []);

    //effects
    useEffect(() => {
      SFirebase.track(FirebaseNode.Messages, [], () => {
        setLoading(true);
        AMessage.getContactsOfUser((contacts: User[]) => {
          setContacts(contacts);
          setLoading(false);
        });
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
            onPress={() => handleGoToProfile(contact.id)}
          />
        ))}

        {loading && contacts.length < 1 && (
          fakeContacts.map(i => (
            <View key={i} style={{flexDirection: "row", gap: 10}}>
              <CustomShimmer height={60} style={styles.avatar}/>

              <CustomShimmer height={60} style={styles.item}/>
            </View>
          ))
        )}

        {!loading && contacts.length < 1 && (
          <>
            <Image
              source={require("../../../../assets/images/ic_empty.png")}
              style={[styles.emptyImage]}
            />

            <Text style={{flex: 1, alignSelf: "center"}}>{language.EMPTY_LIST}</Text>
          </>
        )}

        <View style={{height: 70}}/>
      </ScrollView>
    );
  },
};

export default contactTab;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    marginVertical: 5,
    borderRadius: 10,
    minHeight: 60,
    width: "100%"
  },

  emptyImage: {
    marginTop: 50,
    width: 100,
    height: 100,
    backgroundColor: "#fff",
    alignSelf: "center",
    margin: 15,
  },

  avatar: {
    marginVertical: 10,
    borderRadius: 100,
    minHeight: 60,
    width: 60,
    height: 60,
  }
});