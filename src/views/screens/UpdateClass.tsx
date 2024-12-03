import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { NavigationRouteContext } from '@react-navigation/native';
import { UpdateClassRoute } from '../../configs/NavigationRouteTypeConfig';
import Class from '../../models/Class';

export default function UpdateClass() {
    // route
    const route = useContext(NavigationRouteContext);
    const param = (route?.params as UpdateClassRoute) || new Class();
    console.log(param.classData);
    
  return (
    <View>
      <Text>UpdateClass</Text>
    </View>
  )
}