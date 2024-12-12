import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native'
import React, {useCallback, useContext} from 'react'
import {BackgroundColor} from '../../configs/ColorConfig'
import Class from '../../models/Class'
import ReactAppUrl from '../../configs/ConfigUrl'
import {LanguageContext} from '../../configs/LanguageConfig'
import {NavigationContext} from "@react-navigation/native";
import ScreenName from "../../constants/ScreenName";
import {CVApprovalRoute, IdNavigationType} from "../../configs/NavigationRouteTypeConfig";

type AuthorTuorInClassProps = {
  classDetail: Class,
}

const URL = ReactAppUrl.PUBLIC_URL
export default function AuthorTuorInClass({classDetail}: AuthorTuorInClassProps) {
  const language = useContext(LanguageContext).language;
  const naviagtion = useContext(NavigationContext);

  //handlers
  const goToProfile = useCallback(() => {
    if (!classDetail || !classDetail.author || !classDetail.author.id) return;

    const data: IdNavigationType = {
      id: classDetail.author.id
    }

    naviagtion?.navigate(ScreenName.PROFILE, data);
  }, [classDetail]);

  const goToCV = useCallback(() => {
    if (!classDetail || !classDetail.author || !classDetail.author.id) return;

    const data: CVApprovalRoute = {
      cv_id: classDetail.author.id
    }

    naviagtion?.navigate(ScreenName.CV, data);
  }, [classDetail]);

  return (
    <View>
      {/* Author info */}
      {classDetail.author?.id !== classDetail.tutor?.id && (
        <TouchableOpacity onPress={goToProfile}>
          <View style={styles.authorContainer}>
            <View style={styles.authorInfoContainer}>
              <Image
                source={{uri: `${URL}${classDetail.author?.avatar}`}}
                style={styles.authorAvatar}
              />
              <Text style={styles.authorName}>
                {classDetail.author?.full_name}
              </Text>
            </View>
            <View style={styles.authorStatusContainer}>
              <Text style={[styles.authorStatus, styles.tutorStatus]}>
                {language.CREATOR}
              </Text>
            </View>
          </View>
          {classDetail.tutor?.id &&
            <View style={styles.authorContainer}>
              <View style={styles.authorInfoContainer}>
                <Image
                  source={{uri: `${URL}${classDetail.tutor?.avatar}`}}
                  style={styles.authorAvatar}
                />
                <Text style={styles.authorName}>
                  {classDetail.tutor?.full_name}
                </Text>
              </View>
              <View style={styles.authorStatusContainer}>
                <Text style={[styles.authorStatus, styles.tutorStatus]}>
                  {language.TUTOR}
                </Text>
              </View>
            </View>

          }
        </TouchableOpacity>
      )}

      {classDetail.author?.id === classDetail.tutor?.id && (
        <TouchableOpacity style={styles.authorContainer} onPress={goToCV}>
          <View style={styles.authorInfoContainer}>
            <Image
              source={{uri: `${URL}${classDetail.tutor?.avatar}`}}
              style={styles.authorAvatar}
            />
            <Text style={styles.authorName}>
              {classDetail.tutor?.full_name}
            </Text>
          </View>
          <View style={styles.authorStatusContainer}>
            <Text style={[styles.authorStatus, styles.tutorStatus]}>
              {language.TUTOR}
            </Text>
            <Text style={[styles.authorStatus, styles.tutorStatus]}>
              {language.CREATOR}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  // Tutor info
  authorContainer: {
    backgroundColor: BackgroundColor.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 10,
  },

  authorInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  authorAvatar: {
    width: 55,
    height: 55,
    borderRadius: 999,
  },

  authorName: {
    fontWeight: "bold",
    fontSize: 16,
  },

  authorStatusContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
    position: "absolute",
    top: 10,
    right: 10,
  },

  authorStatus: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontWeight: "500",
  },

  tutorStatus: {
    backgroundColor: "rgba(201, 230, 255, 0.69)",
    color: BackgroundColor.primary,
  },
})