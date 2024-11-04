import { Text, View, StyleSheet, Image, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
//config
import { BackgroundColor, TextColor } from '../../../configs/ColorConfig'
//icon
import Ionicons from '@expo/vector-icons/Ionicons'
import Feather from '@expo/vector-icons/Feather'
import AntDesign from '@expo/vector-icons/AntDesign'
//orther component
import HLine, { HLineType } from '../../components/HLine'
import CvBox from '../../components/CV/CvBox'
import ExperienceItem from '../../components/CV/ExperienceItem'
import EducationItem from '../../components/CV/EducationItem'
import SkillItem from '../../components/CV/SkillItem'
import ACV from '../../../apis/ACV'
import CV from '../../../models/CV'
import { UserContext } from '../../../configs/UserContext'

export default function PersonalCV() {
  const {user, setUser} = useContext(UserContext);
  const [cv, setCV] = useState<any>();

  //effect
  useEffect(()=>{
    ACV.getPersonalCV(user.ID, (cv)=>{
      setCV(cv);
    })
  },[])
  
  return (
    <ScrollView showsVerticalScrollIndicator={false}
      style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <Image style={styles.avatar} source={require('../../../../assets/avatar/img_avatar_cat.png')} />
        <Text style={styles.badge}> 1000 </Text>
        <Text style={styles.name}>Nguyen Van Hoang </Text>
        <Text style={styles.title}> FullStack Developer</Text>
      </View>
      {/* main - view */}
      <View style={styles.main}>
        {/* informations */}
        <View style={styles.infor}>
          <View style={styles.inforItem}>
            {/* day of birth */}
            <View style={styles.inforItemChild}>
              <AntDesign name="calendar" size={20} color="black" />
              <Text style={styles.inforItemText}> 24/04/2004 </Text>
            </View>
            {/* phone number */}
            <View style={styles.inforItemChild}>
              <Feather name="phone-call" size={20} color="black" />
              <Text style={styles.inforItemText}> 0123456789 </Text>
            </View>

          </View>
          <View style={styles.inforItem}>
            {/* mail */}
            <View style={styles.inforItemChild}>
              <Feather name="mail" size={20} color="black" />
              <Text style={styles.inforItemText}> email@gmail.com </Text>
            </View>
          </View>
          <View style={styles.inforItem}>
            {/* location */}
            <View style={styles.inforItemChild}>
              <Ionicons name="location-outline" size={20} color="black" />
              <Text style={styles.inforItemText}> Địa chỉ a - b - c </Text>
            </View>
          </View>

        </View>
        <HLine type={HLineType.LIGHT} />
        {/* about me */}
        <View style={styles.aboutView}>
          <Text style={styles.aboutText}>
            Tôi tên là [Tên của bạn],
            hiện là [công việc hoặc học vấn].
            Tôi đam mê [sở thích hoặc lĩnh vực quan tâm],
            thích khám phá những điều mới và luôn nỗ lực hoàn thiện bản thân để phát triển trong cuộc sống.
          </Text>
        </View>

        {/* education */}
        <View >
          <CvBox title='Education'>
            {/* <ExperienceItem /> */}
            <EducationItem />
            {/* <SkillItem/> */}
          </CvBox>
        </View>
        {/* work experience */}
        <View >
          <CvBox title='Work Experience'>
            <ExperienceItem />
            {/* <EducationItem/> */}
            {/* <SkillItem/> */}
          </CvBox>
        </View>

        {/* Skill */}
        <View >
          <CvBox title='Skill'>
            {/* <ExperienceItem /> */}
            {/* <EducationItem/> */}
            <SkillItem />
          </CvBox>
        </View>

      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColor.primary,
  },
  header: {
    backgroundColor: BackgroundColor.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  main: {
    flex: 1,
    marginTop: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: BackgroundColor.white,
    paddingTop: 15,
    paddingHorizontal: 10
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 999,
    marginTop: 10
  },
  badge: {
    backgroundColor: BackgroundColor.schedule_leaner,
    color: TextColor.black,
    fontWeight: 'bold',
    paddingHorizontal: 25,
    paddingVertical: 3,
    borderRadius: 10,
    transform: [
      { translateY: -10 }
    ]
  },
  name: {
    color: TextColor.white,
    fontWeight: 'bold',
    fontSize: 20,
  },
  title: {
    color: TextColor.white,
  },
  infor: {
    flexDirection: 'column',
    marginHorizontal: 15,
    marginTop: 10,
  },
  inforItem: {
    flexDirection: 'row',
  },
  inforItemChild: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 15,
  },
  inforItemText: {
    fontSize: 14
  },
  aboutView: {
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  aboutText: {
    fontSize: 14,
    color: TextColor.black
  }

})