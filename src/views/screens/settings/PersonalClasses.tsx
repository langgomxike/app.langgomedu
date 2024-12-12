import { Text, View } from 'react-native'
import React, { Component, useContext } from 'react'
import { LanguageContext } from '../../../configs/LanguageConfig';

export default function PersonalClasses() {
    const language = useContext(LanguageContext).language;
    return (
      <View>
        <Text>{language.PERSONALCLASSES}</Text>
      </View>
    )
}
